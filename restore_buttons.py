import glob, re
files = glob.glob(r'C:\Users\mashh\.gemini\antigravity\scratch\virtuallab\src\components\Lab*.tsx')
modified = 0

for f in files:
    with open(f, 'r', encoding='utf-8') as file: content = file.read()
    
    original = content
    
    # Replace corrupted theory button
    content = re.sub(
        r"(className=\{`w-full[^`]+text-center)\s+\?\s+('bg-[^`]+`\})",
        r"\1 ${activeMobileTab === 'theory' ? \2",
        content
    )
    
    # Replace corrupted lab button
    content = re.sub(
        r"(className=\{`w-full[^`]+text-center)\s+('bg-[^`]+`\})",
        r"\1 ${activeMobileTab === 'lab' ? \2",
        content
    )
    
    # Replace segmented tabs version
    content = re.sub(
        r"(className=\{`w-full[^`]+text-center)\s+\?\s+('bg-white[^`]+`\})",
        r"\1 ${activeMobileTab === 'theory' ? \2",
        content
    )
    
    content = re.sub(
        r"(className=\{`w-full[^`]+text-center)\s+('bg-white[^`]+`\})",
        r"\1 ${activeMobileTab === 'lab' ? \2",
        content
    )
    
    if content != original:
        with open(f, 'w', encoding='utf-8') as file: file.write(content)
        modified += 1

print(f"Restored buttons in {modified} files")
