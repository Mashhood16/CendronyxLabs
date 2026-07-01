import glob, re
files = glob.glob(r'C:\Users\mashh\.gemini\antigravity\scratch\virtuallab\src\components\Lab*.tsx')
for f in files[:5]:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    buttons = re.findall(r'<button([^>]*)>.*?Check.*?</button>', content, re.DOTALL | re.IGNORECASE)
    for attrs in buttons:
        class_m = re.search(r'className=([\'"{`]+)(.*?)([\'"`]+)', attrs)
        if class_m:
            print(f.split('\\')[-1], class_m.group(2).strip())
