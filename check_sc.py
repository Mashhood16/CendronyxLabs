import re
with open(r'C:\Users\mashh\.gemini\antigravity\scratch\virtuallab\src\components\LabE10NounsPronouns.tsx', 'r', encoding='utf-8') as f:
    content = f.read()
m = re.search(r'<div className="([^"]*grid-cols-2[^"]*)">', content)
if m:
    print(m.group(1))
