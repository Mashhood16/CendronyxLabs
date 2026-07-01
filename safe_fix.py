import glob, re
files = glob.glob(r'C:\Users\mashh\.gemini\antigravity\scratch\virtuallab\src\components\Lab*.tsx')
modified_buttons = 0
modified_panels = 0

def clean_class(cls_str):
    remove_phrases = [
        r'\$\{activeMobileTab === [\'"](?:lab|theory)[\'"] \? [\'"]flex[\'"] : [\'"]hidden[\'"]\} lg:flex',
        r'\$\{activeMobileTab === [\'"](?:lab|theory)[\'"] \? [\'"]flex[\'"] : [\'"]hidden[\'"]\}',
        r'activeMobileTab === [\'"](?:lab|theory)[\'"] \? [\'"]flex[\'"] : [\'"]hidden[\'"]',
        r'activeMobileTab === [\'"](?:lab|theory)[\'"]\s*\?',
        r'\? [\'"]flex[\'"] : [\'"]hidden[\'"]\} lg:flex',
        r'\? [\'"]flex[\'"] : [\'"]hidden[\'"]\}',
        r'\? [\'"]flex[\'"] : [\'"]hidden[\'"]',
        r'order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b',
        r'order-first lg:order-none',
        r'rounded-b-none lg:rounded-b-xl',
        r'border-b-0 lg:border-b',
        r'\blg:flex\b',
        r'\bhidden\b',
        r'\bflex\b(?!\-)',
        r'\bblock\b',
    ]
    for p in remove_phrases:
        cls_str = re.sub(p, '', cls_str)
    
    cls_str = re.sub(r'\s+', ' ', cls_str).strip()
    
    if 'flex-col' not in cls_str:
        cls_str += ' flex-col'
        
    return cls_str

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
    
    # 1. Fix Buttons
    content = re.sub(
        r"(className=\{`w-full py-3 text-sm font-bold[^`]+activeMobileTab === 'theory'[^`]+'\})\s+[^`]+(`\})",
        r"\1\2",
        content
    )
    content = re.sub(
        r"(className=\{`w-full py-3 text-sm font-bold[^`]+activeMobileTab === 'lab'[^`]+'\})\s+[^`]+(`\})",
        r"\1\2",
        content
    )
    if content != original:
        modified_buttons += 1
        
    original_before_panels = content

    # 2. Fix Panels
    m = re.search(r'(</button>\s*</div>\s*<div[^>]*>|<main[^>]*>)(.*)', content, re.DOTALL)
    if not m:
        m = re.search(r'(</button>\s*</div>)(.*)', content, re.DOTALL)
        
    if m:
        prefix_html = content[:m.start(2)]
        rest_html = m.group(2)
        
        counter = [0]
        new_rest = process_tags(rest_html, counter)
        
        content = prefix_html + new_rest

    if content != original_before_panels:
        modified_panels += 1

    if content != original:
        with open(f, 'w', encoding='utf-8') as file: file.write(content)

print(f"Fixed buttons in {modified_buttons} files")
print(f"Fixed panels in {modified_panels} files")
