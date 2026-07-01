import glob, os, re

components_dir = r'C:\Users\mashh\.gemini\antigravity\scratch\virtuallab\src\components'
files = glob.glob(os.path.join(components_dir, 'Lab*.tsx'))

updated = 0

for file_path in files:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if 'activeMobileTab ===' in content or 'activeMobileTab ==' in content:
        continue
    
    original_content = content
    
    # We need to find the layout tags.
    # Typically, the layout tags are the children of the main flex container.
    # They start with `<div className="` or `<section className="`.
    # Let's find the first 3 tags that match:
    # `(w-full|lg:col-span-1|lg:col-span-2|bg-white|bg-slate-100)[^`]*` inside `className={`
    # Wait, the easiest way is to find `<div className={` or `<section className={` that has `flex-col` in it.
    
    # Let's find all occurrences of `flex-col` inside a `className={` string.
    # Actually, some might not have `flex-col`.
    # What did apply_split_screen do?
    
    # We can just split the file by `<section className={` and `<div className={`
    # But some layout elements use `""` instead of ``.
    
    # A safer approach: find the segmented control.
    # The segmented control ends with `</button>\s*</div>`.
    # The elements after it are the sections.
    # Let's use regex to find `<section className={` or `<div className={` that come after the segmented control.
    
    def replacer(match):
        prefix = match.group(1) # e.g. '<section className="' or '<div className={`'
        classes = match.group(2) # the classes
        suffix = match.group(3) # e.g. '"' or '`'
        
        # We need to turn the string into a template literal if it isn't one.
        if prefix.endswith('="'):
            prefix = prefix[:-2] + '={`'
            suffix = '`}' + suffix[1:]
        
        # remove 'hidden', 'flex', 'block' if they exist as standalone classes to prevent conflicts
        classes = re.sub(r'\b(hidden|flex|block)\b', '', classes)
        
        # Count which section we are in based on a global variable
        global section_counter
        section_counter += 1
        
        tab = 'theory' if section_counter == 1 else 'lab'
        
        # Add the logic
        new_classes = f'{classes.strip()} flex-col ${{activeMobileTab === \'{tab}\' ? \'flex\' : \'hidden\'}} lg:flex'
        
        return f'{prefix}{new_classes}{suffix}'

    global section_counter
    section_counter = 0
    
    # Find all <section> or top-level <div> that represent the panes.
    # We look for `className={`w-full` or `className="w-full` or `className={`lg:col-span` etc.
    content = re.sub(r'(<(?:section|div)\s+className=[\'"{`]+)(w-full[^>]*?|lg:col-span-[^>]*?)([\'"`]+)', replacer, content)
    
    if content != original_content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        updated += 1
        print(f"Updated {os.path.basename(file_path)}")
    else:
        print(f"Failed to match sections in {os.path.basename(file_path)}")

print(f"Updated {updated} missing files.")
