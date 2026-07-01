import glob, re
files = glob.glob(r'C:\Users\mashh\.gemini\antigravity\scratch\virtuallab\src\components\Lab*.tsx')

modified = 0

def process_tags(html):
    pattern = r'<(div|section)([^>]*)>'
    
    def tag_repl(match):
        tag = match.group(1)
        inner = match.group(2)
        
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
        
        # Identify main panels by border-slate-200 and p-4, p-5, p-6, or p-8
        if 'border-slate-200' not in cls_content or not re.search(r'\bp-[4568]\b', cls_content):
            return match.group(0)
            
        # Exclude specific inner items that look like panels but aren't
        if 'py-3' in cls_content and 'text-center' in cls_content:
            return match.group(0)
            
        new_classes = cls_content
        
        if 'min-w-0' not in new_classes:
            new_classes += ' min-w-0'
            
        if 'overflow-x' not in new_classes:
            new_classes += ' overflow-x-auto'
            
        if new_classes != cls_content:
            new_inner = inner[:cls_match.start(1)] + new_classes + inner[cls_match.end(1):]
            return f"<{tag}{new_inner}>"
        return match.group(0)
        
    return re.sub(pattern, tag_repl, html)

for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
        
    original = content
    
    m = re.search(r'(</button>\s*</div>\s*<div[^>]*>|<main[^>]*>)(.*)', content, re.DOTALL)
    if not m:
        m = re.search(r'(</button>\s*</div>)(.*)', content, re.DOTALL)
        
    if m:
        prefix_html = content[:m.start(2)]
        rest_html = m.group(2)
        
        new_rest = process_tags(rest_html)
        
        content = prefix_html + new_rest

    # Also check if the outermost <div className="flex flex-col h-screen has w-full overflow-x-hidden
    outer_div_match = re.search(r'<div className="flex flex-col h-screen[^"]*"', content)
    if outer_div_match:
        cls = outer_div_match.group(0)
        new_cls = cls
        if 'w-full' not in new_cls:
            new_cls = new_cls.replace('h-screen', 'h-screen w-full')
        if 'overflow-x-hidden' not in new_cls:
            new_cls = new_cls.replace('h-screen', 'h-screen overflow-x-hidden')
        if new_cls != cls:
            content = content.replace(cls, new_cls)

    if content != original:
        with open(f, 'w', encoding='utf-8') as file:
            file.write(content)
        modified += 1

print(f"Fixed overflow in {modified} files")
