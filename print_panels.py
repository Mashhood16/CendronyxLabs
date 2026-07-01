import re
with open(r'C:\Users\mashh\.gemini\antigravity\scratch\virtuallab\src\components\LabCS11Applications.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

m = re.search(r'</button>\s*</div>(.*)', content, re.DOTALL)
if m:
    divs = re.findall(r'<(?:div|section)\s+className=([\'"{`]+)([^>]*?border-slate-200[^>]*?)([\'"`]+(?:>|\s))', m.group(1))
    for i, d in enumerate(divs):
        print(f'Panel {i+1} activeMobileTab: {"activeMobileTab" in d[1]} | Classes: {d[1]}')
