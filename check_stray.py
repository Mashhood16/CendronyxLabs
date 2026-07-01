import glob, re
files = glob.glob(r'C:\Users\mashh\.gemini\antigravity\scratch\virtuallab\src\components\Lab*.tsx')
stray_classes = set()
for f in files:
    with open(f, 'r', encoding='utf-8') as file: content = file.read()
    m = re.search(r"className=\{`w-full[^`]+activeMobileTab === 'theory'[^`]+'\}\s+([^`]+)`\}", content)
    if m: stray_classes.add(m.group(1))

for c in stray_classes: print('STRAY:', c)
