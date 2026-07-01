import glob, re
files = glob.glob(r'C:\Users\mashh\.gemini\antigravity\scratch\virtuallab\src\components\Lab*.tsx')
modified = 0

def replacer(match, counter):
    tag = match.group(1)
    attrs_before = match.group(2)
    quote_start = match.group(3)
    classes = match.group(4)
    quote_end = match.group(5)
    brace_end = match.group(6)
    attrs_after = match.group(7)
    
    if 'activeMobileTab' in classes:
        counter[0] += 1
        return match.group(0)
        
    if 'border-slate-200' not in classes:
        return match.group(0)
        
    if not re.search(r'\bp-[4568]\b', classes):
        return match.group(0)
        
    tab = 'theory' if counter[0] == 0 else 'lab'
    
    classes = re.sub(r'\b(hidden|flex|block)\b(?!\-)', '', classes)
    # also remove any double spaces created
    classes = re.sub(r'\s+', ' ', classes).strip()
    
    if 'flex-col' not in classes:
        classes += ' flex-col'
        
    new_classes = f"{classes} ${{activeMobileTab === '{tab}' ? 'flex' : 'hidden'}} lg:flex"
    
    return f"<{tag} {attrs_before}className={{`{new_classes}`}}{attrs_after}>"

for f in files:
    with open(f, 'r', encoding='utf-8') as file: content = file.read()
    
    if 'activeMobileTab' not in content:
        continue
        
    original = content
    
    m = re.search(r'(</button>\s*</div>)(.*)', content, re.DOTALL)
    if m:
        prefix_html = content[:m.start(2)]
        rest_html = m.group(2)
        
        counter = [0]
        pattern = r'<(div|section)\s+([^>]*?)className=([\'"{`]+)(.*?)([\'"`]+)(\}?)(\s*[^>]*)>'
        
        new_rest = re.sub(pattern, lambda match: replacer(match, counter), rest_html)
        
        content = prefix_html + new_rest

    if content != original:
        with open(f, 'w', encoding='utf-8') as file: file.write(content)
        modified += 1

print(f"Injected panel logic into {modified} files")
