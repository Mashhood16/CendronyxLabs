import glob, re
files = glob.glob(r'C:\Users\mashh\.gemini\antigravity\scratch\virtuallab\src\components\Lab*.tsx')

modified = 0

for f in files:
    with open(f, 'r', encoding='utf-8') as file: content = file.read()
    
    original = content
    
    # Remove broken ternary remnants
    content = re.sub(r'\$\{\s*[\'"]\s*[\'"]\s*:\s*[\'"]\s*[\'"]\s*\}', '', content)
    content = re.sub(r'\?\s*[\'"](?:flex|block|hidden)[\'"]\s*:\s*[\'"](?:flex|block|hidden)[\'"]\s*\}', '', content)
    content = re.sub(r'\?\s*[\'"]\s*[\'"]\s*:\s*[\'"]\s*[\'"]\s*\}', '', content)
    
    # Remove hanging lg: that might be left before a space or quote
    content = re.sub(r'\blg:\s+(?=flex|block|\"|\'|`|})', '', content)
    
    if content != original:
        with open(f, 'w', encoding='utf-8') as file: file.write(content)
        modified += 1
        print(f"Fixed syntax errors in {f}")

print(f"Fixed syntax in {modified} files")
