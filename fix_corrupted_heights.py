import glob, re

files = glob.glob(r'C:\Users\mashh\.gemini\antigravity\scratch\virtuallab\src\components\Lab*.tsx')

modified = 0
for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    original = content
    
    # Fix the corrupted classes
    # min-lg:h-[...] -> lg:min-h-[...]
    content = re.sub(r'min-lg:h-\[([^\]]+)\]', r'lg:min-h-[\1]', content)
    
    # max-lg:h-[...] -> lg:max-h-[...]
    content = re.sub(r'max-lg:h-\[([^\]]+)\]', r'lg:max-h-[\1]', content)
    
    # max-lg:h-full -> lg:max-h-full
    content = content.replace('max-lg:h-full', 'lg:max-h-full')
    
    # Also I should check if there are any `lg:min-lg:h` or similar double lg
    content = content.replace('lg:lg:', 'lg:')
    
    # And fix any `overflow- min-h-[500px]` which was `overflow-y-auto min-h-[500px]` but I replaced `overflow-y-auto`?
    # Wait, in LabE10, I saw `<section className="... overflow- min-lg:h-[500px]"`
    # Why "overflow- "?
    # Ah! Previously the previous agent did `overflow-y-auto` -> `overflow- ` or something when it was stripping!
    content = content.replace('overflow- lg:min-h-', 'lg:overflow-y-auto lg:min-h-')
    content = content.replace('overflow- min-h-', 'lg:overflow-y-auto lg:min-h-')
    content = content.replace('overflow- min-lg:h-', 'lg:overflow-y-auto lg:min-h-')

    if content != original:
        with open(f, 'w', encoding='utf-8') as file:
            file.write(content)
        modified += 1

print(f"Fixed {modified} files")
