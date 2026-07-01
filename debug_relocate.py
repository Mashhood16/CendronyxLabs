import glob, re, os

files = glob.glob(r'C:\Users\mashh\.gemini\antigravity\scratch\virtuallab\src\components\Lab*.tsx')
modified_count = 0

keywords = ['Experiment Setup', 'Simulation Controls', 'Controls', 'Settings', 'Simulation Parameters', 'Parameters', 'Interactive Controls']

for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
        
    theory_col_match = re.search(r'(<div[^>]+activeMobileTab === \'theory\'.*?)(?=<div[^>]+activeMobileTab === \'lab\')', content, re.DOTALL)
    if not theory_col_match:
        continue
        
    theory_col = theory_col_match.group(1)
    
    rest = content[theory_col_match.end():]
    lab_col_match = re.search(r'(<div[^>]+activeMobileTab === \'lab\'.*?)(?=<div[^>]+activeMobileTab === \'lab\')', rest, re.DOTALL)
    lab_col = lab_col_match.group(1) if lab_col_match else rest
    in_lab = any(kw in lab_col for kw in keywords)
    
    if not (any(kw in theory_col for kw in keywords) and not in_lab):
        continue
        
    wrapper_match = re.search(r'(<div[^>]+className=\{`[^`]*?activeMobileTab === \'theory\' \? \'flex\' : \'hidden\'[^`]*?`\})', content)
    if not wrapper_match:
        # Check if the wrapper was ALREADY modified by the previous script!
        already_modified = re.search(r'activeMobileTab === \'lab\' \? \'flex order-last mt-4\'', content)
        if not already_modified:
            print(f"Skipped {os.path.basename(f)}: No wrapper match")
        continue
        
    idx_wrapper_start = wrapper_match.start(1)
    idx_wrapper_end = content.find('>', idx_wrapper_start) + 1
    
    first_div_start = content.find('<div', idx_wrapper_end)
    if first_div_start == -1:
        print(f"Skipped {os.path.basename(f)}: No first div")
        continue

print("Done debugging.")
