import glob, re

files = glob.glob(r'C:\Users\mashh\.gemini\antigravity\scratch\virtuallab\src\components\Lab*.tsx')

count = 0
for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    original = content
    
    # We want to remove overflow-y-auto from the root div which usually has "h-screen"
    # Search for the root div, which is usually right after the return statement
    m = re.search(r'(return\s*\(\s*<div[^>]+className=["`])([^"`]+)(["`])', content)
    if m:
        prefix = m.group(1)
        classes = m.group(2)
        suffix = m.group(3)
        
        if 'h-screen' in classes and 'overflow-y-auto' in classes:
            new_classes = re.sub(r'\boverflow-y-auto\b', '', classes)
            # clean up multiple spaces
            new_classes = re.sub(r'\s+', ' ', new_classes).strip()
            
            new_root = prefix + new_classes + suffix
            content = content.replace(m.group(0), new_root)
            
    if content != original:
        with open(f, 'w', encoding='utf-8') as file:
            file.write(content)
        count += 1

print(f"Fixed root scroll in {count} files")
