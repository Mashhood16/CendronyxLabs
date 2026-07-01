import glob, re

files = glob.glob(r'C:\Users\mashh\.gemini\antigravity\scratch\virtuallab\src\components\Lab*.tsx')
count = 0
for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    original = content
    
    def repl(m):
        tag_content = m.group(0)
        is_main = ('<main' in tag_content) or ('lg:grid' in tag_content) or ('flex-grow' in tag_content and 'lg:grid-cols' in tag_content) or ('grid-cols-' in tag_content)
        if not is_main:
            return tag_content.replace('overflow-y-auto', 'lg:overflow-y-auto')
        return tag_content
    
    content = re.sub(r'(<[^>]+class(?:Name)?=[\'\"`][^\'\"`]*)(?<![a-z]:)\boverflow-y-auto\b([^\'\"`]*[\'\"`])', repl, content)
    
    # Also I should fix any min-h- or h- inside these stray tags if they exist?
    # Actually just replacing overflow-y-auto with lg:overflow-y-auto is enough because without it, it won't scroll anyway.

    if content != original:
        with open(f, 'w', encoding='utf-8') as file:
            file.write(content)
        count += 1

print('Fixed stray overflow-y-auto in:', count)
