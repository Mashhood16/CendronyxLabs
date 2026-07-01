import glob, os, re

components_dir = r'C:\Users\mashh\.gemini\antigravity\scratch\virtuallab\src\components'
files = glob.glob(os.path.join(components_dir, 'Lab*.tsx'))

updated = 0
for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    if 'activeMobileTab ===' in content or 'activeMobileTab ==' in content:
        continue
        
    original = content
    
    # We need to find the layout tags.
    # Look for: <section className={`...`} or <div className={`...lg:col-span...`} or <div className="...lg:col-span..."
    # A safe pattern: find elements with `border-slate-200` that are direct structural elements.
    # Actually, we know exactly what is broken. My previous script `apply_split_screen.py` did:
    # content.replace(classes, new_classes)
    # Then some other script replaced `${activeMobileTab...}` with empty space or ` ? 'flex' : 'hidden'}`!
    # Let's search for the corrupted fragments!
    
    # Corrupted fragment 1: ` ? 'flex' : 'hidden'}`
    # Corrupted fragment 2: ` ? 'block' : 'hidden'}`
    # Corrupted fragment 3: `'flex' : 'hidden'}`
    
    # Let's see if we can find them.
    content = re.sub(r'(lg:\s*)?\s*\?\s*\'(flex|block)\'\s*:\s*\'hidden\'\}\s*', r'', content)
    content = re.sub(r'\'(flex|block)\'\s*:\s*\'hidden\'\}\s*', r'', content)
    
    # Now we have a clean string without the broken logic.
    # Let's inject it using the segmented control position as a marker.
    
    parts = re.split(r'(</button>\s*</div>\s*<main[^>]*>|</button>\s*</div>)', content)
    
    if len(parts) >= 3:
        # parts[0] is everything before the end of the segmented control.
        # parts[1] is the segmented control end and <main>
        # parts[2] is the rest of the file
        
        rest = parts[2]
        
        # Now find the first 3 layout tags in `rest`
        # They start with `<div className="` or `<section className="` or `<div className={` or `<section className={`
        
        def layout_replacer(m):
            tag = m.group(1) # <div or <section
            prefix = m.group(2) # className="
            classes = m.group(3)
            suffix = m.group(4) # "
            
            global count
            count += 1
            if count > 3:
                return m.group(0) # Don't touch more than 3
                
            tab = 'theory' if count == 1 else 'lab'
            
            # clean classes
            classes = re.sub(r'\b(hidden|flex|block)\b', '', classes)
            classes = classes.strip()
            
            # format suffix to be template literal
            if prefix == 'className="':
                prefix = 'className={`'
                suffix = '`}' + suffix[1:]
                
            new_classes = f'{classes} flex-col ${{activeMobileTab === \'{tab}\' ? \'flex\' : \'hidden\'}} lg:flex'
            return f'{tag} {prefix}{new_classes}{suffix}'
            
        global count
        count = 0
        
        # We match top-level layout elements. They usually contain `w-full` or `lg:col-span` or `min-h-`
        # Just match the first 3 `<section` or `<div` that have `className` and don't contain `items-center` without `w-full`...
        # Wait, the simplest regex is just the first 3 block-level tags.
        rest = re.sub(r'(<(?:div|section))\s+className=([\'"{`]+)(.*?)([\'"`]+(?:>|\s))', layout_replacer, rest, count=3)
        
        content = parts[0] + parts[1] + rest
        
    if content != original:
        with open(f, 'w', encoding='utf-8') as file:
            file.write(content)
        updated += 1
        print(f"Fixed {os.path.basename(f)}")

print(f"Fixed {updated} files.")
