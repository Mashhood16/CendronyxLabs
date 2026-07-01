import glob, re
files = glob.glob(r'C:\Users\mashh\.gemini\antigravity\scratch\virtuallab\src\components\Lab*.tsx')

for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    if 'activeMobileTab' not in content:
        continue
        
    original = content
    
    # --- 1. FIX BUTTONS ---
    content = re.sub(
        r"(<button[^>]*onClick=\{[^}]*setActiveMobileTab\('theory'\)[^}]*\}[^>]*className=\{`)(w-full py-3 text-sm font-bold rounded-xl transition-all text-center)\s*\? ('bg-\[#4158D1\])",
        r"\1\2 ${activeMobileTab === 'theory' ? \3",
        content
    )
    content = re.sub(
        r"(<button[^>]*onClick=\{[^}]*setActiveMobileTab\('lab'\)[^}]*\}[^>]*className=\{`)(w-full py-3 text-sm font-bold rounded-xl transition-all text-center)\s*('bg-\[#4158D1\])",
        r"\1\2 ${activeMobileTab === 'lab' ? \3",
        content
    )
    
    content = re.sub(
        r"(className=\{`w-full py-3 text-sm font-bold[^`]+activeMobileTab === 'lab'[^`]+'\})\s+[^`]+(`\})",
        r"\1\2",
        content
    )

    # --- 2. CLEAN UP BROKEN TERNARIES IN PANELS ---
    content = content.replace(" ${ '' : ''}", "")
    content = content.replace(" '' : ''}", "")
    
    def clean_class(cls_str):
        cls_str = re.sub(r'\$\{activeMobileTab === [\'"](?:lab|theory)[\'"] \? [\'"](?:flex|block)[\'"] : [\'"](?:hidden|block|flex)[\'"]\}', '', cls_str)
        cls_str = re.sub(r'activeMobileTab === [\'"](?:lab|theory)[\'"] \? [\'"](?:flex|block)[\'"] : [\'"](?:hidden|block|flex)[\'"]', '', cls_str)
        cls_str = re.sub(r'\$\{activeMobileTab === [\'"](?:lab|theory)[\'"]\s*\?', '', cls_str)
        cls_str = re.sub(r'\? [\'"](?:flex|block)[\'"] : [\'"]hidden[\'"]\}?', '', cls_str)
        
        remove_phrases = [
            r'order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b',
            r'order-first lg:order-none',
            r'rounded-b-none lg:rounded-b-xl',
            r'border-b-0 lg:border-b',
            r'\blg:flex\b',
            r'\bhidden\b',
            r'\bflex\b(?!\-)',
            r'\blg:block\b',
            r'\bblock\b',
            r'\blg:\s+(?=\s|$)',
        ]
        for p in remove_phrases:
            cls_str = re.sub(p, '', cls_str)
        
        cls_str = re.sub(r'\s+', ' ', cls_str).strip()
        
        if 'flex-col' not in cls_str:
            cls_str += ' flex-col'
            
        return cls_str

    # --- 3. INJECT NEW LOGIC INTO PANELS ---
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
        with open(f, 'w', encoding='utf-8') as file:
            file.write(content)
        print(f"Fixed {f}")
