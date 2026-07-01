import glob, os, re

components_dir = r'C:\Users\mashh\.gemini\antigravity\scratch\virtuallab\src\components'
files = glob.glob(os.path.join(components_dir, 'Lab*.tsx'))

def evaluate_visibility(f):
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
        
    if 'setActiveMobileTab(' not in content:
        return None
        
    m = re.search(r'</button>\s*</div>(.*)', content, re.DOTALL)
    if not m:
        return None
        
    rest = m.group(1)
    
    # Check <section> tags
    sections = re.findall(r'<section\s+className=[\'"{`]+([^\'"`]+)[\'"`]+', rest)
    
    issues = []
    if sections:
        for idx, s in enumerate(sections):
            if 'activeMobileTab' not in s:
                issues.append(f'section {idx+1} is missing activeMobileTab logic and will always be visible')
    
    # If no <section> tags, look for top-level <div> tags with lg:col-span or w-full
    if not sections:
        divs = re.findall(r'<div\s+className=[\'"{`]+([^>]*?(?:lg:col-span|w-full)[^>]*?)[\'"`]+', rest)
        if divs:
            for idx, d in enumerate(divs[:3]): # only check first 3
                if 'activeMobileTab' not in d:
                    issues.append(f'div {idx+1} is missing activeMobileTab logic and will always be visible')
                    
    return issues

broken_labs = []
for f in files:
    issues = evaluate_visibility(f)
    if issues:
        broken_labs.append((os.path.basename(f), issues))

print(f'Found {len(broken_labs)} broken labs.')
for f, issues in broken_labs[:20]:
    print(f'{f}: {issues}')
