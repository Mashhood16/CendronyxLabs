import glob, re
files = glob.glob(r'C:\Users\mashh\.gemini\antigravity\scratch\virtuallab\src\components\Lab*.tsx')
modified = 0

def clean_class(cls_str):
    cls_str = re.sub(r'\$\{activeMobileTab[^}]+\}', '', cls_str)
    cls_str = re.sub(r'activeMobileTab === [\'"][^\'"]+[\'"]', '', cls_str)
    cls_str = re.sub(r'\?\s*[\'"]flex[\'"]\s*:\s*[\'"]hidden[\'"]\s*\}?', '', cls_str)
    
    remove = ['hidden', 'flex', 'block', 'lg:flex', 'order-first', 'lg:order-none', 
              'rounded-b-none', 'lg:rounded-b-xl', 'border-b-0', 'lg:border-b']
              
    words = cls_str.replace('`', ' ').replace('"', ' ').replace("'", ' ').split()
    clean_words = []
    for w in words:
        if w in remove or w == '?' or w == ':' or w == '}' or w == '{' or w == '${':
            continue
        w = re.sub(r'^[\?\:\}]+|[\?\:\}]+$', '', w)
        if w and w not in remove:
            clean_words.append(w)
            
    if 'flex-col' not in clean_words:
        clean_words.append('flex-col')
        
    return " ".join(clean_words)

def process_tags(html, counter):
    pattern = r'<(div|section)([^>]*)>'
    
    def tag_repl(match):
        tag = match.group(1)
        inner = match.group(2)
        
        cls_match = re.search(r'className=\{`(.*?)`\}', inner)
        if not cls_match:
            cls_match = re.search(r'className="([^"]*)"', inner)
            if not cls_match:
                cls_match = re.search(r"className='([^']*)'", inner)
                if not cls_match:
                    cls_match = re.search(r'className=\{([^}]*)\}', inner)
                    if not cls_match:
                        return match.group(0)
        
        cls_content = cls_match.group(1)
        
        if 'border-slate-200' not in cls_content or not re.search(r'\bp-[4568]\b', cls_content):
            return match.group(0)
            
        if 'py-3' in cls_content and 'text-center' in cls_content:
            return match.group(0)
            
        tab = 'theory' if counter[0] == 0 else 'lab'
        counter[0] += 1
        
        cleaned = clean_class(cls_content)
        new_classes = f"{cleaned} ${{activeMobileTab === '{tab}' ? 'flex' : 'hidden'}} lg:flex"
        
        new_inner = inner[:cls_match.start()] + f"className={{`{new_classes}`}}" + inner[cls_match.end():]
        return f"<{tag}{new_inner}>"
        
    return re.sub(pattern, tag_repl, html)

for f in files:
    with open(f, 'r', encoding='utf-8') as file: content = file.read()
    
    if 'activeMobileTab' not in content:
        continue
        
    original = content
    
    # Only match inside main or after buttons
    m = re.search(r'(</button>\s*</div>\s*<div[^>]*>|<main[^>]*>)(.*)', content, re.DOTALL)
    if not m:
        m = re.search(r'(</button>\s*</div>)(.*)', content, re.DOTALL)
        
    if m:
        prefix_html = content[:m.start(2)]
        rest_html = m.group(2)
        
        counter = [0]
        new_rest = process_tags(rest_html, counter)
        
        content = prefix_html + new_rest

    if content != original:
        with open(f, 'w', encoding='utf-8') as file: file.write(content)
        modified += 1

print(f"Injected panel logic into {modified} files")
