import glob, re

files = glob.glob(r'C:\Users\mashh\.gemini\antigravity\scratch\virtuallab\src\components\Lab*.tsx')
two_children = 0
other = 0

for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    theory_col_match = re.search(r'(<div[^>]+activeMobileTab === \'theory\'.*?)(?=<div[^>]+activeMobileTab === \'lab\')', content, re.DOTALL)
    if not theory_col_match:
        continue
        
    theory_col = theory_col_match.group(1)
    
    # Check if 'Experiment Setup' or similar is in it
    keywords = ['Experiment Setup', 'Simulation Controls', 'Controls', 'Settings', 'Simulation Parameters', 'Parameters', 'Interactive Controls']
    if not any(kw in theory_col for kw in keywords):
        continue
        
    # Now count direct child divs.
    # A simple heuristic: find the first <div> inside theory_col (which is the theory text wrapper).
    # Then find `<div className="flex-1">` or similar which wraps the controls.
    
    # Actually, we can count the number of top-level tags by looking at the indentation or using a simple bracket matcher.
    # For now, just print the ones that have more than 1 occurrence of `Experiment Setup`
    print(f)
    two_children += 1

print(f"Total files with controls in theory: {two_children}")
