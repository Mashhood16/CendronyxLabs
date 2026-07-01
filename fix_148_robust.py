import glob, os, re

components_dir = r'C:\Users\mashh\.gemini\antigravity\scratch\virtuallab\src\components'
files = glob.glob(os.path.join(components_dir, 'Lab*.tsx'))

def inject_logic_into_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.read()
        
    original = content
        
    if 'setActiveMobileTab(' not in content:
        return False
        
    # Find <main> block
    m = re.search(r'(<main[^>]*>)(.*)(</main>)', content, re.DOTALL)
    if not m:
        return False
        
    main_open = m.group(1)
    inner_html = m.group(2)
    main_close = m.group(3)
    
    # We will tokenize the inner HTML by tags to track depth.
    # We only care about opening tags `<tag` and closing tags `</tag` and self-closing `<tag/>`.
    # Wait, JSX can have `<Component />` or `{...}` blocks.
    # Tracking depth perfectly with Regex is hard, but we can do a naive approach:
    # Just split by `<` and `>`.
    
    # Actually, we already know the 148 files where ONLY div 3 (or div 2) is missing it.
    # What if we just use a regex on the ENTIRE file to find ANY `<div` or `<section` that has `border-slate-200` AND `rounded-2xl` or `rounded-xl` AND DOES NOT have `activeMobileTab`?
    # Are there any inner elements with `border-slate-200` AND `rounded-xl`?
    # Let's look at LabB10Biostatistics.tsx: inner elements have `rounded-xl` but usually not `border-slate-200`. Wait, `dark:border-[#1c1b1b]` is used on inner elements too?
    pass

    # A simpler approach: find `<div className={` or `<div className="` that is missing the logic, AND contains `w-full`, `lg:col-span`, or `min-h-` or is the VERY LAST `<div` block before `</main>` that looks like a major panel.
    # In `check_visibility.py`, I found the exact broken ones.
    # Let's use `check_visibility.py` logic:
    
    # For <section> tags:
    def replacer(m):
        prefix = m.group(1)
        classes = m.group(2)
        suffix = m.group(3)
        
        if 'activeMobileTab' in classes:
            return m.group(0)
            
        # We need to inject it. Assuming it's the 2nd or 3rd section, it should be 'lab'
        # To be completely safe, we can just inject 'lab' because ONLY the Lab components are missing it!
        # The Theory component (1st) ALWAYS has it because apply_split_screen.py matched it first!
        # Is this true? check_visibility.py output:
        # LabB10KidneyDissection.tsx: ['div 1 is missing...', 'div 3 is missing...']
        # Ah! div 1 is missing it in some!
        pass
