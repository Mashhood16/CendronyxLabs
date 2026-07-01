import glob, os, re

components_dir = r'C:\Users\mashh\.gemini\antigravity\scratch\virtuallab\src\components'
files = glob.glob(os.path.join(components_dir, 'Lab*.tsx'))

def parse_and_inject(content):
    if 'setActiveMobileTab(' not in content:
        return content
        
    m = re.search(r'(</button>\s*</div>\s*)(<main[^>]*>)?(.*)', content, re.DOTALL)
    if not m: return content
    
    prefix = content[:m.start(3)]
    rest = m.group(3)
    
    tokens = re.split(r'(</?[a-zA-Z][^>]*>)', rest)
    
    depth = 0
    sibling_count = 0
    new_rest = ""
    
    for token in tokens:
        if token.startswith('<') and not token.startswith('</') and not token.endswith('/>'):
            if depth == 0 and sibling_count < 3 and (token.startswith('<div') or token.startswith('<section')):
                sibling_count += 1
                tab = 'theory' if sibling_count == 1 else 'lab'
                
                class_m = re.search(r'className=([\'"{`]+)(.*?)([\'"`]+)', token)
                if class_m:
                    pre = class_m.group(1)
                    cls = class_m.group(2)
                    post = class_m.group(3)
                    
                    if 'activeMobileTab' not in cls:
                        cls = re.sub(r'\b(hidden|flex|block)\b', '', cls).strip()
                        
                        if pre == '"':
                            pre = '{`'
                            post = '`}'
                        elif pre == "'":
                            pre = "{`"
                            post = "`}"
                            
                        new_cls = f"{cls} flex-col ${{activeMobileTab === '{tab}' ? 'flex' : 'hidden'}} lg:flex"
                        token = token[:class_m.start()] + f'className={pre}{new_cls}{post}' + token[class_m.end():]
            depth += 1
        elif token.startswith('</'):
            depth -= 1
            
        new_rest += token
        
    return prefix + new_rest

updated = 0
for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    new_content = parse_and_inject(content)
    if new_content != content:
        with open(f, 'w', encoding='utf-8') as file:
            file.write(new_content)
        updated += 1
        print(f"Fixed {os.path.basename(f)}")

print(f"Updated {updated} files.")
