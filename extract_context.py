import glob, re

with open(r'C:\Users\mashh\.gemini\antigravity\scratch\virtuallab\src\components\LabB11Bioenergetics.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

with open(r'C:\Users\mashh\.gemini\antigravity\scratch\virtuallab\button_context.txt', 'w', encoding='utf-8') as out:
    buttons = re.finditer(r'<button[^>]*>([^<]*)</button>', content, re.IGNORECASE)
    for b in buttons:
        if 'Check' in b.group(1):
            idx = b.start()
            out.write(content[max(0, idx-400):min(len(content), idx+400)])
            out.write('\n----------------------------------------\n')
