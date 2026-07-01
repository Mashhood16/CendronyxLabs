import glob, os, re

components_dir = r'C:\Users\mashh\.gemini\antigravity\scratch\virtuallab\src\components'
files = glob.glob(os.path.join(components_dir, 'Lab*.tsx'))

def process_file(f):
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
        
    if 'setActiveMobileTab(' not in content:
        return False
        
    m = re.search(r'(</button>\s*</div>)(.*)', content, re.DOTALL)
    if not m:
        return False
        
    prefix = content[:m.start(2)]
    rest = m.group(2)
    
    sections = re.findall(r'<section\s+className=[\'"{`]+[^\'"`]+[\'"`]+', rest)
    
    global count
    count = 0
    
    def replacer(m):
        global count
        count += 1
        
        tag_start = m.group(1)
        quote_start = m.group(2)
        classes = m.group(3)
        quote_end = m.group(4)
        
        if 'activeMobileTab' in classes:
            return m.group(0)
            
        tab = 'theory' if count == 1 else 'lab'
        
        classes = re.sub(r'\b(hidden|flex|block)\b', '', classes).strip()
        
        if quote_start == '"' or quote_start == "'":
            quote_start = '{`'
            quote_end = '`}'
            
        new_classes = f"{classes} flex-col ${{activeMobileTab === '{tab}' ? 'flex' : 'hidden'}} lg:flex"
        
        return f"{tag_start}{quote_start}{new_classes}{quote_end}"

    if sections:
        new_rest = re.sub(r'(<section\s+className=)([\'"{`]+)([^\'"`]+)([\'"`]+)', replacer, rest, count=3)
    else:
        new_rest = re.sub(r'(<div\s+className=)([\'"{`]+)([^>]*?(?:lg:col-span|w-full|bg-slate-50)[^>]*?)([\'"`]+)', replacer, rest, count=3)
        
    if new_rest != rest:
        with open(f, 'w', encoding='utf-8') as file:
            file.write(prefix + new_rest)
        return True
    return False

updated = 0
for f in files:
    if process_file(f):
        updated += 1
        print(f"Fixed {os.path.basename(f)}")

print(f"Updated {updated} files.")
