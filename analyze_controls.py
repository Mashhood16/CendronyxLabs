import glob, re

files = glob.glob(r'C:\Users\mashh\.gemini\antigravity\scratch\virtuallab\src\components\Lab*.tsx')
theory_controls = 0
lab_controls = 0
unknown = 0

for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # Let's split the main content into theory column and lab column
    # Typically, theory column is the first div inside main with activeMobileTab === 'theory'
    # Lab column is the second div with activeMobileTab === 'lab'
    
    # We can search for the columns using regex
    theory_col_match = re.search(r'(<div[^>]+activeMobileTab === \'theory\'.*?)(?=<div[^>]+activeMobileTab === \'lab\')', content, re.DOTALL)
    if not theory_col_match:
        continue
        
    theory_col = theory_col_match.group(1)
    
    # Lab col match is from the first lab col to the next lab col (Data) or end
    rest = content[theory_col_match.end():]
    lab_col_match = re.search(r'(<div[^>]+activeMobileTab === \'lab\'.*?)(?=<div[^>]+activeMobileTab === \'lab\')', rest, re.DOTALL)
    if lab_col_match:
        lab_col = lab_col_match.group(1)
    else:
        lab_col = rest
        
    # Now check where 'Experiment Setup' or 'Controls' or 'Settings' or input/button controls are.
    # Usually they are under a heading like 'Experiment Setup', 'Settings', 'Controls', 'Simulation Parameters'
    keywords = ['Experiment Setup', 'Simulation Controls', 'Controls', 'Settings', 'Simulation Parameters', 'Parameters']
    
    in_theory = any(kw in theory_col for kw in keywords)
    in_lab = any(kw in lab_col for kw in keywords)
    
    if in_theory and not in_lab:
        theory_controls += 1
        # print('Controls in Theory:', f)
    elif in_lab and not in_theory:
        lab_controls += 1
    else:
        # Check if there are range inputs or buttons (that are not just mobile tabs)
        # in theory
        has_input = '<input' in theory_col and 'type="range"' in theory_col
        if has_input:
            theory_controls += 1
            # print('Inputs in Theory:', f)
        else:
            unknown += 1

print('Controls in Theory:', theory_controls)
print('Controls in Lab:', lab_controls)
print('Unknown:', unknown)
