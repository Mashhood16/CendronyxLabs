import glob

files = glob.glob(r'C:\Users\mashh\.gemini\antigravity\scratch\virtuallab\src\components\Lab*.tsx')
count = 0
for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    original = content
    
    content = content.replace('mb-4 border rounded">', 'mb-4 border rounded overflow-x-auto">')
    
    if content != original:
        with open(f, 'w', encoding='utf-8') as file:
            file.write(content)
        count += 1

print(f"Added overflow-x-auto to table wrappers safely in {count} files")
