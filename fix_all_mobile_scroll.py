import glob, re

files = glob.glob(r'C:\Users\mashh\.gemini\antigravity\scratch\virtuallab\src\components\Lab*.tsx')
count = 0
for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    original = content
    
    # 1. Root div: ensure min-h-screen lg:h-screen, overflow-x-hidden w-full. No overflow-y-auto.
    def root_repl(m):
        classes = m.group(2)
        classes = classes.replace('h-screen', '') # remove standalone h-screen
        classes = re.sub(r'(?<![a-z]:)\boverflow-y-auto\b', '', classes)
        
        # Add required classes if missing
        if 'min-h-screen' not in classes:
            classes += ' min-h-screen'
        if 'lg:h-screen' not in classes:
            classes += ' lg:h-screen'
        if 'overflow-x-hidden' not in classes:
            classes += ' overflow-x-hidden'
        if 'w-full' not in classes:
            classes += ' w-full'
            
        # clean spaces
        classes = re.sub(r'\s+', ' ', classes).strip()
        
        return m.group(1) + classes + m.group(3)
    
    content = re.sub(r'(return\s*\(\s*<div[^>]+className=["`])([^"`]+)(["`])', root_repl, content, count=1)
    
    # 2. & 3. Inner grid wrappers & Section wrappers
    def tag_repl(m):
        tag_content = m.group(0)
        is_grid = ('<main' in tag_content) or ('lg:grid' in tag_content) or ('flex-grow' in tag_content and 'lg:grid-cols' in tag_content) or ('grid-cols-' in tag_content)
        is_section = ('lg:flex' in tag_content and 'min-w-0' in tag_content) or ('shadow-sm' in tag_content and 'border' in tag_content)
        
        if is_grid:
            tag_content = re.sub(r'(?<![a-z]:)\boverflow-y-auto\b', '', tag_content)
            tag_content = re.sub(r'\s+', ' ', tag_content) 
            
        if is_section:
            tag_content = re.sub(r'(?<![a-z]:)\boverflow-x-auto\b', 'lg:overflow-x-auto', tag_content)
            
        if is_section and not is_grid:
            tag_content = re.sub(r'(?<![a-z]:)\boverflow-y-auto\b', 'lg:overflow-y-auto', tag_content)
            
        return tag_content

    content = re.sub(r'<(?:div|main|section)[^>]+class(?:Name)?=[\'\"`][^\'\"`]*[\'\"`][^>]*>', tag_repl, content)
    
    # 4. Tables wrappers
    content = content.replace('mb-4 border rounded">', 'mb-4 border rounded overflow-x-auto">')
    
    if content != original:
        with open(f, 'w', encoding='utf-8') as file:
            file.write(content)
        count += 1

print(f"Fixed all mobile scrolling in {count} files")
