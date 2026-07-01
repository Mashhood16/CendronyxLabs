import glob, re

files = glob.glob(r'C:\Users\mashh\.gemini\antigravity\scratch\virtuallab\src\components\Lab*.tsx')
modified = 0

for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # Only target files that have activeMobileTab
    if 'activeMobileTab' not in content:
        continue
        
    # We want to replace `w-full min-w-0 overflow-x-hidden ... p-6 ...` with the tab logic.
    # But only if it doesn't already have activeMobileTab logic inside it!
    # Let's find all matches
    pattern = r'className=\{`([^\`]*?w-full min-w-0 overflow-x-hidden[^\`]*?p-6[^\`]*?)`\}'
    
    matches = list(re.finditer(pattern, content))
    
    if len(matches) >= 2:
        new_content = content
        # Process in reverse so indices don't shift
        # Actually, let's just use re.sub with a replacement function counting occurrences
        
        counter = [0]
        def panel_repl(m):
            cls = m.group(1)
            # If it already has lg:flex or hidden, skip to avoid double appending
            if 'activeMobileTab' in cls:
                counter[0] += 1
                return m.group(0)
                
            # Clean up any trailing spaces
            cls = cls.rstrip()
            
            # Determine tab
            tab = 'theory' if counter[0] == 0 else 'lab'
            
            # Since the original class was flex-col or similar, we must ensure it displays as flex.
            # Some panels might not have flex-col explicitly in the match, but let's assume they are flex containers if they are the main panels.
            # Wait, theory panel might just be 'block' in some labs. But 'flex flex-col' is universally safe.
            if 'flex-col' not in cls:
                cls += ' flex flex-col'
                
            new_cls = f"{cls} ${{activeMobileTab === '{tab}' ? 'flex' : 'hidden'}} lg:flex"
            
            counter[0] += 1
            return f'className={{`{new_cls}`}}'
            
        new_content = re.sub(pattern, panel_repl, content)
        
        if new_content != content:
            with open(f, 'w', encoding='utf-8') as file:
                file.write(new_content)
            modified += 1

print(f"Injected tab logic into {modified} files.")
