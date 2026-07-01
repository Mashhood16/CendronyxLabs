import glob, re

files = glob.glob(r'C:\Users\mashh\.gemini\antigravity\scratch\virtuallab\src\components\Lab*.tsx')

modified = 0
for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    original = content
    
    # Replace "lg: overflow-y-auto" with "overflow-y-auto"
    content = content.replace('lg: overflow-y-auto', 'overflow-y-auto')
    
    # Ensure there is only one overflow-y-auto
    m = re.search(r'(<main[^>]*className=["`])([^"`]+)(["`])', content)
    if m:
        main_tag = m.group(0)
        classes = m.group(2)
        
        # Remove all instances of overflow-y-auto
        classes = re.sub(r'\s+overflow-y-auto', '', classes)
        classes = classes.replace('overflow-y-auto', '')
        
        # Also clean up stray lg: 
        classes = re.sub(r'\s+lg:\s+', ' ', classes)
        
        # Add it exactly once at the beginning
        classes = 'overflow-y-auto ' + classes.strip()
        
        new_main_tag = m.group(1) + classes + m.group(3)
        content = content.replace(main_tag, new_main_tag)

    if content != original:
        with open(f, 'w', encoding='utf-8') as file:
            file.write(content)
        modified += 1

print(f"Cleaned {modified} files")
