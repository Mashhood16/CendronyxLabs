import glob, re

files = glob.glob(r'C:\Users\mashh\.gemini\antigravity\scratch\virtuallab\src\components\Lab*.tsx')
count = 0
for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    original = content
    
    # We want to find any container that wraps a table, or just add overflow-x-auto directly to the table container.
    # Look for `<div className="... mb-4 border rounded">\n  <table` or similar.
    # Actually, it's safer to just find `<table` and see if its parent div has `overflow-x-auto`.
    # A simpler regex: find `<div className="([^"]+)">\s*(?:\{.*?\})?\s*<table`
    
    def table_repl(m):
        classes = m.group(1)
        if 'overflow-x-auto' not in classes:
            classes = 'overflow-x-auto ' + classes
        return f'<div className="{classes}">'
    
    content = re.sub(r'<div className="([^"]+)">\s*(?:\{[^}]*\})?\s*<table', table_repl, content)
    
    # Same for className={`...`}
    def table_repl_backtick(m):
        classes = m.group(1)
        if 'overflow-x-auto' not in classes:
            classes = 'overflow-x-auto ' + classes
        return f'<div className={{`{classes}`}}>'
        
    content = re.sub(r'<div className=\{`([^`]+)`\}>\s*(?:\{[^}]*\})?\s*<table', table_repl_backtick, content)

    if content != original:
        with open(f, 'w', encoding='utf-8') as file:
            file.write(content)
        count += 1

print(f"Added overflow-x-auto to table wrappers in {count} files")
