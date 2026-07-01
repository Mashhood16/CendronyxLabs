import glob

files = glob.glob(r'C:\Users\mashh\.gemini\antigravity\scratch\virtuallab\src\components\Lab*.tsx')
count = 0
for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    idx_theory = content.find("activeMobileTab === 'theory'")
    idx_setup = content.find("Experiment Setup")
    idx_lab = content.find("activeMobileTab === 'lab'")
    
    if idx_theory != -1 and idx_setup != -1 and idx_lab != -1:
        if idx_theory < idx_setup < idx_lab:
            print('Found in:', f)
            count += 1
            
print('Total:', count)
