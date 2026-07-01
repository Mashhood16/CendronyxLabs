import glob, re

files = glob.glob(r'C:\Users\mashh\.gemini\antigravity\scratch\virtuallab\src\components\Lab*.tsx')
count = 0
for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # We want to find overflow-y-auto that is NOT lg:overflow-y-auto, md:overflow-y-auto, sm:overflow-y-auto
    # AND is NOT on the main wrapper container
    # The main wrapper container either is <main or a div with lg:grid or grid-cols-
    
    matches = list(re.finditer(r'(<[^>]+class(?:Name)?=[\'\"`][^\'\"`]*)(?<![a-z]:)\boverflow-y-auto\b([^\'\"`]*[\'\"`])', content))
    
    for m in matches:
        tag_content = m.group(0)
        # Check if it's a main wrapper
        is_main = ('<main' in tag_content) or ('lg:grid' in tag_content) or ('flex-grow' in tag_content and 'lg:grid-cols' in tag_content) or ('grid-cols-' in tag_content)
        if not is_main:
            print('Stray overflow-y-auto found in:', f)
            # print('  ', tag_content)
            count += 1
            break
            
print('Files with stray overflow-y-auto:', count)
