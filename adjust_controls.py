import glob, re, os

files = glob.glob(r'C:\Users\mashh\.gemini\antigravity\scratch\virtuallab\src\components\Lab*.tsx')
modified_count = 0

for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
        
    original = content
    
    # 1. Revert order-last mt-4 from wrapper
    if "activeMobileTab === 'lab' ? 'flex order-last mt-4'" in content:
        content = content.replace(
            "activeMobileTab === 'theory' ? 'flex' : activeMobileTab === 'lab' ? 'flex order-last mt-4' : 'hidden'",
            "activeMobileTab === 'theory' ? 'flex' : activeMobileTab === 'lab' ? 'flex mb-4' : 'hidden'"
        )
        # wait, if I use `mb-4`, it gives a little spacing before the simulator. Let's use `flex mb-4`.
        
    # 2. Add visibility class to the Controls div.
    # We can find the controls div by searching for the keywords we used.
    # The controls div is the one containing 'Experiment Setup' or similar.
    # Since we need to modify its className, we can do this safely:
    # Most controls divs have `className="flex-1"` or `className="flex-1 space-y-4"`.
    
    # Let's use a simpler heuristic: find the Theory column string again
    theory_col_match = re.search(r'(<div[^>]+activeMobileTab === \'theory\'.*?)(?=<div[^>]+activeMobileTab === \'lab\')', content, re.DOTALL)
    if not theory_col_match:
        continue
        
    theory_col = theory_col_match.group(1)
    
    # We want to find the `<div className="flex-1">` that wraps the controls.
    # Or find `<h2 className="text-lg font-semibold text-slate-800 dark:text-[#ffffff] mb-4">Experiment Setup</h2>` and find its closest `<div className="flex-1">` parent.
    
    # Actually, we can just replace `<div className="flex-1">` with `<div className={\`flex-1 ${activeMobileTab === 'lab' ? 'block' : 'hidden'} lg:block\`}>`
    # But wait, is it always exactly `<div className="flex-1">`?
    # Some might be `<div className="flex-1 space-y-4">`.
    # Let's search for `<div className="flex-1` within the theory col.
    
    # Wait! If we look at LabC10MoltenLeadChloride.tsx:
    # <div className="flex-1">
    # <h2 className="...">Experiment Setup</h2>
    
    # Let's do a regex replace inside the theory column text ONLY.
    
    def repl_flex1(m):
        # m.group(0) is like `<div className="flex-1">`
        # We replace `flex-1` with ``flex-1 ${activeMobileTab === 'lab' ? 'block' : 'hidden'} lg:block``
        # But wait, we need to change `className="flex-1"` to a template literal `className={\`flex-1 ...\`}`
        full_tag = m.group(0)
        
        # If it's already modified, don't modify again
        if 'activeMobileTab' in full_tag:
            return full_tag
            
        class_match = re.search(r'className=["\']([^"\']*)["\']', full_tag)
        if class_match:
            classes = class_match.group(1)
            # wait, if classes has flex-1, we inject our logic
            if 'flex-1' in classes:
                new_class = f"className={{`{classes} ${{activeMobileTab === 'lab' ? 'block' : 'hidden'}} lg:block`}}"
                return full_tag[:class_match.start()] + new_class + full_tag[class_match.end():]
        
        return full_tag

    new_theory_col = re.sub(r'<div[^>]+className=["\'][^"\']*flex-1[^"\']*["\'][^>]*>', repl_flex1, theory_col)
    
    # If the regex didn't find flex-1, maybe we can search for the `<div` right before the h2.
    if new_theory_col == theory_col:
        # fallback: find `<h2` containing keyword, find the preceding `<div`
        pass
        
    content = content[:theory_col_match.start(1)] + new_theory_col + content[theory_col_match.end(1):]
    
    if content != original:
        with open(f, 'w', encoding='utf-8') as file:
            file.write(content)
        modified_count += 1
        print(f"Modified {os.path.basename(f)}")

print(f"Total modified: {modified_count}")
