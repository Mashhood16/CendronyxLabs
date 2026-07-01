import re

def test_css():
    f = r'C:\Users\mashh\.gemini\antigravity\scratch\virtuallab\src\components\LabC10MoltenLeadChloride.tsx'
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
        
    # 1. Modify the theory column wrapper
    # It looks like: activeMobileTab === 'theory' ? 'flex' : 'hidden'
    # We want to replace it with: activeMobileTab === 'theory' ? 'flex' : activeMobileTab === 'lab' ? 'flex order-2 mt-4' : 'hidden'
    
    # Let's find the Theory column wrapper
    match = re.search(r'(<div[^>]+className=\{`[^`]*?activeMobileTab === \'theory\' \? \'flex\' : \'hidden\'[^`]*?`\})', content)
    if not match:
        print("Could not find theory column wrapper")
        return
        
    wrapper_tag = match.group(1)
    
    new_wrapper_tag = wrapper_tag.replace(
        "activeMobileTab === 'theory' ? 'flex' : 'hidden'",
        "activeMobileTab === 'theory' ? 'flex' : activeMobileTab === 'lab' ? 'flex order-last mt-4' : 'hidden'"
    )
    
    # We also need to add lg:order-none to prevent it from being order-last on desktop
    if 'lg:order-none' not in new_wrapper_tag:
        new_wrapper_tag = new_wrapper_tag.replace('lg:flex', 'lg:flex lg:order-none')
        
    # 2. Modify the first div inside the wrapper (the theory text)
    # The wrapper tag ends with `>`. The next thing should be `<div>` or `<div className="...">`.
    
    wrapper_end = match.end(1) + 1 # wait, match.group(1) doesn't include the closing > if we didn't match it.
    
    # Let's re-match to include the closing >
    match = re.search(r'(<div[^>]+className=\{`[^`]*?activeMobileTab === \'theory\' \? \'flex\' : \'hidden\'[^`]*?`\}>)', content)
    wrapper_tag = match.group(1)
    
    new_wrapper_tag = wrapper_tag.replace(
        "activeMobileTab === 'theory' ? 'flex' : 'hidden'",
        "activeMobileTab === 'theory' ? 'flex' : activeMobileTab === 'lab' ? 'flex order-last mt-4' : 'hidden'"
    )
    new_wrapper_tag = new_wrapper_tag.replace('lg:flex', 'lg:flex lg:order-none')
    
    # Now find the first div after the wrapper
    rest = content[match.end(1):]
    first_div_match = re.search(r'^\s*(<div[^>]*>)', rest)
    if not first_div_match:
        print("Could not find first div")
        return
        
    first_div = first_div_match.group(1)
    
    # Add className to first_div
    if 'className=' in first_div:
        # replace className="X" with className={`X ${...}`}
        # or if it's already {`X`}, just inject
        pass
    else:
        # just add it
        new_first_div = first_div.replace('<div', f'<div className={{`${{activeMobileTab === \'theory\' ? \'block\' : \'hidden\'}} lg:block`}}')
        
    # Apply
    content = content[:match.start(1)] + new_wrapper_tag + rest[:first_div_match.start(1)] + new_first_div + rest[first_div_match.end(1):]
    
    with open('test_output.tsx', 'w', encoding='utf-8') as file:
        file.write(content)
        
    print("Done")

test_css()
