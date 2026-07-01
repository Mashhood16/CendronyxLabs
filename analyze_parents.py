import glob, re

def analyze_file(f):
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # Find button
    match = re.search(r'<button([^>]*?)>[^<]*Check[^<]*</button>', content)
    if not match: return
    
    idx = match.start()
    before = content[:idx]
    divs = re.findall(r'<div\s+className=([\'"{`]+)(.*?)([\'"`]+)', before)
    if divs:
        print(f.split('\\')[-1], 'parents:')
        for d in divs[-3:]:
            print('  ', d[1].strip())

for f in glob.glob(r'C:\Users\mashh\.gemini\antigravity\scratch\virtuallab\src\components\Lab*.tsx')[:20]:
    analyze_file(f)
