import glob, re, os

files = glob.glob(r'C:\Users\mashh\.gemini\antigravity\scratch\virtuallab\src\components\Lab*.tsx')
modified_count = 0

keywords = ['Experiment Setup', 'Simulation Controls', 'Controls', 'Settings', 'Simulation Parameters', 'Parameters', 'Interactive Controls']

for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
        
    original = content
    
    # Find the theory column
    theory_col_match = re.search(r'(<div[^>]+activeMobileTab === \'theory\'.*?)(?=<div[^>]+activeMobileTab === \'lab\')', content, re.DOTALL)
    if not theory_col_match:
        continue
        
    theory_col = theory_col_match.group(1)
    
    # Check if this lab has controls in theory
    rest = content[theory_col_match.end():]
    lab_col_match = re.search(r'(<div[^>]+activeMobileTab === \'lab\'.*?)(?=<div[^>]+activeMobileTab === \'lab\')', rest, re.DOTALL)
    lab_col = lab_col_match.group(1) if lab_col_match else rest
    
    in_theory_kw = any(kw in theory_col for kw in keywords)
    in_lab_kw = any(kw in lab_col for kw in keywords)
    has_input = '<input' in theory_col and 'type="range"' in theory_col
    
    needs_relocation = False
    if in_theory_kw and not in_lab_kw:
        needs_relocation = True
    elif has_input:
        needs_relocation = True
        
    if not needs_relocation:
        continue
        
    wrapper_match = re.search(r'(<div[^>]+className=\{`[^`]*?activeMobileTab === \'theory\' \? \'flex\' : \'hidden\'[^`]*?`\})', content)
    if not wrapper_match:
        continue
        
    wrapper_tag = wrapper_match.group(1)
    new_wrapper_tag = wrapper_tag.replace(
        "activeMobileTab === 'theory' ? 'flex' : 'hidden'",
        "activeMobileTab === 'theory' ? 'flex' : activeMobileTab === 'lab' ? 'flex order-last mt-4' : 'hidden'"
    )
    if 'lg:order-none' not in new_wrapper_tag:
        new_wrapper_tag = new_wrapper_tag.replace('lg:flex', 'lg:flex lg:order-none')
        
    idx_wrapper_start = wrapper_match.start(1)
    idx_wrapper_end = content.find('>', idx_wrapper_start) + 1
    
    first_div_start = content.find('<div', idx_wrapper_end)
    if first_div_start == -1:
        continue
        
    first_div_end = content.find('>', first_div_start) + 1
    first_div = content[first_div_start:first_div_end]
    
    if 'className={' in first_div:
        class_expr_match = re.search(r'className=\{`([^`]*)`\}', first_div)
        if class_expr_match:
            classes = class_expr_match.group(1)
            new_class_str = f"className={{`{classes} ${{activeMobileTab === 'theory' ? 'block' : 'hidden'}} lg:block`}}"
            new_first_div = first_div[:class_expr_match.start()] + new_class_str + first_div[class_expr_match.end():]
        else:
            new_first_div = first_div
    elif 'className=' in first_div:
        class_match = re.search(r'className=["\']([^"\']*)["\']', first_div)
        if class_match:
            classes = class_match.group(1)
            new_class_str = f"className={{`{classes} ${{activeMobileTab === 'theory' ? 'block' : 'hidden'}} lg:block`}}"
            new_first_div = first_div[:class_match.start()] + new_class_str + first_div[class_match.end():]
    else:
        new_first_div = first_div.replace('<div', f'<div className={{`${{activeMobileTab === \'theory\' ? \'block\' : \'hidden\'}} lg:block`}}')
        
    content = content[:idx_wrapper_start] + new_wrapper_tag + content[wrapper_match.end(1):first_div_start] + new_first_div + content[first_div_end:]
    
    if content != original:
        with open(f, 'w', encoding='utf-8') as file:
            file.write(content)
        modified_count += 1

print(f"Total modified: {modified_count}")
