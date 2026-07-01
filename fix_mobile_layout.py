import glob, re

files = glob.glob(r'C:\Users\mashh\.gemini\antigravity\scratch\virtuallab\src\components\Lab*.tsx')
count = 0
for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    original = content
    
    # 1. Root div: replace h-screen with min-h-screen lg:h-screen
    # But only if it's the root div. Root div is usually `return ( \n <div ... h-screen`
    def root_repl(m):
        classes = m.group(2)
        # If it already has lg:h-screen, don't duplicate
        if 'lg:h-screen' not in classes:
            classes = re.sub(r'\bh-screen\b', 'min-h-screen lg:h-screen', classes)
        return m.group(1) + classes + m.group(3)
    
    content = re.sub(r'(return\s*\(\s*<div[^>]+className=["`])([^"`]+)(["`])', root_repl, content)
    
    # 2. Remove overflow-y-auto from inner grid wrappers (main or div with lg:grid)
    # AND remove overflow-x-auto from section wrappers (which have lg:flex min-w-0 overflow-x-auto)
    
    def tag_repl(m):
        tag_content = m.group(0)
        # Check if it's a grid wrapper
        is_grid = ('<main' in tag_content) or ('lg:grid' in tag_content) or ('flex-grow' in tag_content and 'lg:grid-cols' in tag_content) or ('grid-cols-' in tag_content)
        
        # Check if it's a section wrapper
        is_section = ('lg:flex' in tag_content and 'min-w-0' in tag_content) or ('shadow-sm' in tag_content and 'border' in tag_content)
        
        if is_grid:
            # Remove overflow-y-auto
            # But wait, it might be lg:overflow-y-auto, we ONLY want to remove overflow-y-auto that applies to mobile
            tag_content = re.sub(r'(?<![a-z]:)\boverflow-y-auto\b', '', tag_content)
            tag_content = re.sub(r'\s+', ' ', tag_content) # clean spaces
            
        if is_section:
            # Change overflow-x-auto to lg:overflow-x-auto
            tag_content = re.sub(r'(?<![a-z]:)\boverflow-x-auto\b', 'lg:overflow-x-auto', tag_content)
            
        # Also let's clean any stray overflow-y-auto on sections just in case
        if is_section and not is_grid:
            tag_content = re.sub(r'(?<![a-z]:)\boverflow-y-auto\b', 'lg:overflow-y-auto', tag_content)
            
        return tag_content

    # Apply tag_repl to all div, main, section tags
    content = re.sub(r'<(?:div|main|section)[^>]+class(?:Name)?=[\'\"`][^\'\"`]*[\'\"`][^>]*>', tag_repl, content)
    
    if content != original:
        with open(f, 'w', encoding='utf-8') as file:
            file.write(content)
        count += 1

print(f"Fixed mobile layout in {count} files")
