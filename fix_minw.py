import glob, re
files = glob.glob(r'C:\Users\mashh\.gemini\antigravity\scratch\virtuallab\src\components\Lab*.tsx')
modified_count = 0
for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    def repl(m):
        cls = m.group(1)
        if 'w-full' in cls and 'flex-col' in cls and 'min-w-0' not in cls:
            cls += ' min-w-0 overflow-x-hidden'
        return f'className="{cls}"'
        
    new_content = re.sub(r'className="([^"]*?w-full[^"]*?flex-col[^"]*?)"', repl, content)
    
    # Also do it for template literals className={`...`}
    def repl2(m):
        cls = m.group(1)
        if 'w-full' in cls and 'flex-col' in cls and 'min-w-0' not in cls:
            # Inject before the dynamic part if possible, or just append before the closing quote
            # Actually, it's easier to just insert it after 'w-full '
            cls = cls.replace('w-full', 'w-full min-w-0 overflow-x-hidden')
        return f'className={{`{cls}`}}'
        
    new_content = re.sub(r'className=\{`([^`]*?w-full[^`]*?flex-col[^`]*?)`\}', repl2, new_content)
    
    if new_content != content:
        with open(f, 'w', encoding='utf-8') as file:
            file.write(new_content)
        modified_count += 1

print(f'Modified {modified_count} files for panels.')
