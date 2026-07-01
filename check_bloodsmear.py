import os, re
f = r'C:\Users\mashh\.gemini\antigravity\scratch\virtuallab\src\components\LabB10BloodSmear.tsx'
with open(f, 'r', encoding='utf-8') as file: content = file.read()
m = re.search(r'</button>\s*</div>(.*)', content, re.DOTALL)
panels = re.findall(r'<(?:div|section)\s+className=([\'"{`]+)([^>]*?border-slate-200[^>]*?)([\'"`]+(?:>|\s))', m.group(1))
for i, p in enumerate(panels):
    print(f'Panel {i+1}: {p[1]}')
