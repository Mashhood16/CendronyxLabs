import os, re

files = [
    'LabB10BloodSmear.tsx', 'LabC10SaltExcessBase.tsx', 'LabC10StandardizationTitration.tsx',
    'LabCS10FutureTech.tsx'
]

for base in files:
    f = os.path.join(r'C:\Users\mashh\.gemini\antigravity\scratch\virtuallab\src\components', base)
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    m = re.search(r'</button>\s*</div>(.*)', content, re.DOTALL)
    if m:
        divs = re.findall(r'<div\s+className=([\'"{`]+)([^>]*?)([\'"`]+(?:>|\s))', m.group(1))
        print(f'{base}:')
        for i, d in enumerate(divs[:4]):
            print(f'  div {i+1}: {d[1]}')
