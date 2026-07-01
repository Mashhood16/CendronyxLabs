import glob, re

files = glob.glob(r'C:\Users\mashh\.gemini\antigravity\scratch\virtuallab\src\components\Lab*.tsx')

def process_file(f):
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    original = content

    def tag_repl(match):
        tag = match.group(1)
        inner = match.group(2)
        
        # We only want to process if it's inside <main> and not the <main> itself.
        # But wait, this regex processes ALL tags. Let's just avoid <main
        if tag == 'main':
            # But wait, we might want to ensure <main> has overflow-y-auto on mobile
            return match.group(0)
            
        cls_match = re.search(r'className=\{`(.*?)`\}', inner)
        if not cls_match:
            cls_match = re.search(r'className="([^"]*)"', inner)
            if not cls_match:
                cls_match = re.search(r"className='([^']*)'", inner)
                if not cls_match:
                    cls_match = re.search(r'className=\{([^}]*)\}', inner)
                    if not cls_match:
                        return match.group(0)
        
        cls_content = cls_match.group(1)
        
        # Only modify elements that have overflow-y-auto or overflow-y-scroll
        if not re.search(r'(?<!lg:)(?<!md:)(?<!sm:)\boverflow-y-(auto|scroll)\b', cls_content):
            # Also modify sections that have min-h-[500px] but no overflow-y-auto (like Simulation window in LabE10)
            if not ('border-slate-200' in cls_content and re.search(r'(?<!lg:)\bmin-h-\[[0-9]+px\]', cls_content)):
                return match.group(0)
        
        new_classes = cls_content
        
        # Change overflow
        new_classes = re.sub(r'(?<![a-z]:)\boverflow-y-auto\b', 'lg:overflow-y-auto', new_classes)
        new_classes = re.sub(r'(?<![a-z]:)\boverflow-y-scroll\b', 'lg:overflow-y-scroll', new_classes)
        
        # Change heights on this specific scrollable container
        new_classes = re.sub(r'(?<![a-z]:)\bh-\[[^\]]+\]', lambda m: 'lg:' + m.group(0), new_classes)
        new_classes = re.sub(r'(?<![a-z]:)\bmin-h-\[[^\]]+\]', lambda m: 'lg:' + m.group(0), new_classes)
        new_classes = re.sub(r'(?<![a-z]:)\bmax-h-\[[^\]]+\]', lambda m: 'lg:' + m.group(0), new_classes)
        new_classes = re.sub(r'(?<![a-z]:)\bmax-h-full\b', 'lg:max-h-full', new_classes)
        # Note: we do NOT touch h-full unless it's strictly necessary, because h-full on a scroll container might just mean "take parent's height"
        # Actually, if we change h-full to lg:h-full on a scroll container, it's fine. It'll just be h-auto on mobile.
        new_classes = re.sub(r'(?<![a-z]:)\bh-full\b', 'lg:h-full', new_classes)
        
        if new_classes != cls_content:
            new_inner = inner[:cls_match.start(1)] + new_classes + inner[cls_match.end(1):]
            return f"<{tag}{new_inner}>"
        return match.group(0)
        
    # Split content by <main and </main> to only target inside <main>
    m = re.search(r'(<main[^>]*>)(.*?)(</main>)', content, re.DOTALL)
    if m:
        main_open = m.group(1)
        inner = m.group(2)
        main_close = m.group(3)
        
        # Ensure main has overflow-y-auto on mobile
        new_main_open = main_open
        if 'overflow-y-auto' not in main_open:
            if 'className="' in main_open:
                new_main_open = main_open.replace('className="', 'className="overflow-y-auto ')
            elif 'className={`' in main_open:
                new_main_open = main_open.replace('className={`', 'className={`overflow-y-auto ')
        
        # Process all tags inside <main>
        pattern = r'<(div|section|p|ul|ol)([^>]*)>'
        new_inner = re.sub(pattern, tag_repl, inner)
        
        new_content = content[:m.start(1)] + new_main_open + new_inner + main_close + content[m.end(3):]
        
        if new_content != original:
            with open(f, 'w', encoding='utf-8') as file:
                file.write(new_content)
            return True
    return False

modified = 0
for f in files:
    if process_file(f):
        modified += 1

print(f"Fixed scroll in {modified} files")
