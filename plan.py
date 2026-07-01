import glob, re

def find_jsx_boundary(content, start_index):
    # content[start_index:] starts with '<div'
    # We will count <div and </div
    # Actually we must count ANY tag to be robust? No, just the tag that we started with!
    # If we started with '<div', we must count <div and </div.
    # What if there is a <div /> (self-closing)? We should handle it.
    
    tag_match = re.match(r'<([a-zA-Z0-9]+)', content[start_index:])
    if not tag_match:
        return -1
    tag_name = tag_match.group(1)
    
    count = 0
    i = start_index
    
    while i < len(content):
        # find the next tag
        next_open = content.find(f'<{tag_name}', i)
        next_close = content.find(f'</{tag_name}>', i)
        
        if next_open == -1 and next_close == -1:
            break
            
        if next_open != -1 and (next_close == -1 or next_open < next_close):
            count += 1
            i = next_open + len(f'<{tag_name}')
            # Need to check if it's self-closing <div ... />
            # Find the closing >
            close_angle = content.find('>', i)
            if close_angle != -1 and content[close_angle-1] == '/':
                count -= 1
            i = close_angle + 1 if close_angle != -1 else i
        else:
            count -= 1
            i = next_close + len(f'</{tag_name}>')
            if count == 0:
                return i
                
    return -1

def test():
    files = glob.glob(r'C:\Users\mashh\.gemini\antigravity\scratch\virtuallab\src\components\LabC10MoltenLeadChloride.tsx')
    for f in files:
        with open(f, 'r', encoding='utf-8') as file:
            content = file.read()
            
        theory_col_match = re.search(r'(<div[^>]+activeMobileTab === \'theory\'.*?)(?=<div[^>]+activeMobileTab === \'lab\')', content, re.DOTALL)
        if not theory_col_match:
            continue
            
        theory_col_start = theory_col_match.start(1)
        theory_col_end = theory_col_match.end(1)
        theory_col = content[theory_col_start:theory_col_end]
        
        kw_match = re.search(r'<h[234][^>]*>.*?Experiment Setup.*?</h[234]>', theory_col)
        if kw_match:
            # Walk backwards from kw_match to find `<div`
            # But we want the TOP-LEVEL div inside theory_col.
            # Usually theory_col looks like: <div ...> <div>...</div> <div className="flex-1">...</div> </div>
            # So the div we want is a direct child of theory_col.
            # Let's just find the `<div` that is closest to `kw_match.start()`? 
            # If the header is wrapped in a div, finding the closest `<div` will just get the header's parent, which might not be the whole controls section.
            pass

test()
