import glob, re
files = glob.glob(r'C:\Users\mashh\.gemini\antigravity\scratch\virtuallab\src\components\LabC12TransitionMetals.tsx')
for f in files:
    with open(f, 'r', encoding='utf-8') as file: content = file.read()
    m = re.search(r'<div className="lg:hidden.*?</button>\s*</div>', content, re.DOTALL)
    if m: print(m.group(0))
