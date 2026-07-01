import glob, re
files = glob.glob(r'C:\Users\mashh\.gemini\antigravity\scratch\virtuallab\src\components\Lab*.tsx')
count = 0
for f in files:
    with open(f, 'r', encoding='utf-8') as file: content = file.read()
    m = re.search(r'<div className="lg:hidden.*?</button>\s*<button.*?</button>\s*</div>', content, re.DOTALL)
    if m:
        html = m.group(0)
        lab_pos = html.find("setActiveMobileTab('lab')")
        theory_pos = html.find("setActiveMobileTab('theory')")
        if lab_pos != -1 and theory_pos != -1 and lab_pos < theory_pos:
            print(f'Lab is before Theory in {f}')
            count += 1
if count == 0: print('All files have Theory before Lab in the DOM.')
