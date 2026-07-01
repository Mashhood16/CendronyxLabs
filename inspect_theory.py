import glob, re

files = glob.glob(r'C:\Users\mashh\.gemini\antigravity\scratch\virtuallab\src\components\Lab*.tsx')
count = 0
for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    theory_col_match = re.search(r'(<div[^>]+activeMobileTab === \'theory\'.*?)(?=<div[^>]+activeMobileTab === \'lab\')', content, re.DOTALL)
    if not theory_col_match:
        continue
        
    theory_col = theory_col_match.group(1)
    
    # We want to find the last top-level div inside the theory column.
    # Actually, we can just split the theory column by `Experiment Setup` or `Controls`.
    
    keywords = ['Experiment Setup', 'Simulation Controls', 'Controls', 'Settings', 'Simulation Parameters', 'Parameters', 'Interactive Controls']
    
    kw_found = None
    for kw in keywords:
        if kw in theory_col:
            kw_found = kw
            break
            
    if kw_found:
        print(f"File: {f.split(r'\\')[-1]}, Keyword: {kw_found}")
        
        # Let's find the header tag containing the keyword
        header_match = re.search(r'<h[234][^>]*>.*?'+kw_found+r'.*?</h[234]>', theory_col)
        if header_match:
            # Let's assume the controls block starts at the parent of this header.
            # But the header might be wrapped in a div.
            # It's usually `<div ...><h2 ...>Experiment Setup</h2>...</div>`
            # Finding the boundary of JSX programmatically is tricky.
            pass
        count += 1

print(f"Total files with controls in theory: {count}")
