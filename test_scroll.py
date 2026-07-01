import glob, re

files = glob.glob(r'C:\Users\mashh\.gemini\antigravity\scratch\virtuallab\src\components\Lab*.tsx')

def process_file(f):
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # We want to find and replace height and overflow classes, BUT ONLY if they are not already lg: prefixed
    # and we should NOT touch the <main> tag.
    
    # Let's do a regex replacement on all class attributes, except <main ...>
    
    # Split content by <main and </main> to only target inside <main>
    # Wait, some classes might be on <section> which is inside <main>
    # Let's just process the whole content, but specifically avoid replacing <main ... overflow-y-auto>
    
    # Better: find className="..." or className={`...`}
    def repl_cls(match):
        cls_str = match.group(1) or match.group(2)
        quote = match.group(0)[10:11] # className=" -> " or className={` -> {
        is_template = (quote == '{')
        
        # Don't touch if it's the main tag (we can check context roughly, but let's just do it on all div/section/p)
        # Actually, let's just regex replace the specific classes in the string
        
        # classes to prefix with lg:
        classes = ['overflow-y-auto', 'overflow-y-scroll', r'h-\[[^\]]+\]', r'min-h-\[[^\]]+\]', r'max-h-\[[^\]]+\]', r'max-h-full', r'h-full']
        
        new_cls = cls_str
        for c in classes:
            # find exact word boundary, not preceded by lg: or md: or sm:
            # e.g. (?<!lg:)(?<!md:)(?<!sm:)\boverflow-y-auto\b
            pattern = r'(?<![a-z]:)\b' + c + r'\b'
            new_cls = re.sub(pattern, lambda m: 'lg:' + m.group(0), new_cls)
            
        if is_template:
            return f"className={{`{new_cls}`}}"
        else:
            return f"className=\"{new_cls}\""
            
    # Apply to all elements EXCEPT <main> and the root <div> (which has h-screen)
    # Actually, the easiest way is to split by `<main` and `</main>` and only process the inside, but skipping the `<main` tag itself.
    m = re.search(r'(<main[^>]*>)(.*?)(</main>)', content, re.DOTALL)
    if m:
        main_open = m.group(1)
        inner = m.group(2)
        main_close = m.group(3)
        
        new_inner = re.sub(r'className=\{`([^`]+)`\}|className="([^"]+)"', repl_cls, inner)
        
        # Are there any issues? `h-full` might be used for small elements like progress bars!
        # If I change `h-full` to `lg:h-full`, the progress bar will collapse on mobile!
        # This is dangerous.
        return new_inner != inner
    return False

count = 0
for f in files:
    if process_file(f):
        count += 1
print(f"Would modify {count} files")
