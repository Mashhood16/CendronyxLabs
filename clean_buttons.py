import glob, re
files = glob.glob(r'C:\Users\mashh\.gemini\antigravity\scratch\virtuallab\src\components\Lab*.tsx')
modified = 0

for f in files:
    with open(f, 'r', encoding='utf-8') as file: content = file.read()
    
    original = content
    
    # Theory button
    content = re.sub(
        r"(className=\{`w-full[^`]+activeMobileTab === 'theory'[^`]+'\})\s+[^`]+(`\})",
        r"\1\2",
        content
    )
    
    # Lab button
    content = re.sub(
        r"(className=\{`w-full[^`]+activeMobileTab === 'lab'[^`]+'\})\s+[^`]+(`\})",
        r"\1\2",
        content
    )
    
    if content != original:
        with open(f, 'w', encoding='utf-8') as file: file.write(content)
        modified += 1

print(f"Cleaned stray classes from buttons in {modified} files")
