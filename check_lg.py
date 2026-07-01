import glob, os, re

components_dir = r'C:\Users\mashh\.gemini\antigravity\scratch\virtuallab\src\components'
files = glob.glob(os.path.join(components_dir, 'Lab*.tsx'))

lg_no_space = 0
lg_space = 0

for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
        if 'lg:${' in content:
            lg_no_space += 1
            print(os.path.basename(f), 'has lg:${')
        if 'lg: ${' in content:
            lg_space += 1
            print(os.path.basename(f), 'has lg: ${')

print(f"lg:${{}} (no space): {lg_no_space}")
print(f"lg: ${{}} (with space): {lg_space}")
