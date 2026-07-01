import glob, os, re
files = glob.glob(r'C:\Users\mashh\.gemini\antigravity\scratch\virtuallab\src\components\Lab*.tsx')
for f in files[:20]:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    buttons = re.findall(r'<button([^>]*)>(.*?)</button>', content, re.DOTALL | re.IGNORECASE)
    for attrs, text in buttons:
        if 'Check' in text:
            class_m = re.search(r'className=([\'"{`]+)(.*?)([\'"`]+)', attrs)
            if class_m:
                print(f'{os.path.basename(f)}: {class_m.group(2).strip()}')
