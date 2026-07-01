import glob, re

files = glob.glob(r'C:\Users\mashh\.gemini\antigravity\scratch\virtuallab\src\components\Lab*.tsx')
modified = 0

for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    new_content = content
    
    # 1. Add max-w-full to check buttons.
    def button_repl(m):
        attrs = m.group(1)
        if 'w-full' in attrs and 'max-w-full' not in attrs:
            attrs = attrs.replace('w-full', 'w-full max-w-full')
        return f'<button{attrs}>'
    new_content = re.sub(r'<button([^>]*?)>', button_repl, new_content)
    
    # 2. Add min-w-0 overflow-x-hidden to major panels
    # Panels typically start with: className="... w-full ... p-6 ... flex flex-col ..."
    # or className={`...`}
    def panel_repl(m):
        cls = m.group(1)
        if 'w-full' in cls and 'flex-col' in cls and 'p-6' in cls and 'min-w-0' not in cls:
            cls = cls.replace('w-full', 'w-full min-w-0 overflow-x-hidden')
        return f'className="{cls}"'
        
    def panel_repl_template(m):
        cls = m.group(1)
        if 'w-full' in cls and 'flex-col' in cls and 'p-6' in cls and 'min-w-0' not in cls:
            cls = cls.replace('w-full', 'w-full min-w-0 overflow-x-hidden')
        return f'className={{`{cls}`}}'
        
    new_content = re.sub(r'className="([^"]*?w-full[^"]*?flex-col[^"]*?p-6[^"]*?)"', panel_repl, new_content)
    new_content = re.sub(r'className=\{`([^`]*?w-full[^`]*?flex-col[^`]*?p-6[^`]*?)`\}', panel_repl_template, new_content)

    if new_content != content:
        with open(f, 'w', encoding='utf-8') as file:
            file.write(new_content)
        modified += 1

print(f"Modified {modified} files.")
