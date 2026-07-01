import glob, re, collections
files = glob.glob(r'C:\Users\mashh\.gemini\antigravity\scratch\virtuallab\src\components\Lab*.tsx')
classes = collections.Counter()
for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    buttons = re.findall(r'<button([^>]*)>.*?Check.*?</button>', content, re.DOTALL | re.IGNORECASE)
    for attrs in buttons:
        class_m = re.search(r'className=([\'"{`]+)(.*?)([\'"`]+)', attrs)
        if class_m:
            c = class_m.group(2).strip()
            c = re.sub(r'\s+', ' ', c)
            classes[c] += 1
for c, count in classes.most_common(10):
    print(f'{count}: {c}')
