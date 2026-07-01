import glob, os, re

components_dir = r'C:\Users\mashh\.gemini\antigravity\scratch\virtuallab\src\components'
files = glob.glob(os.path.join(components_dir, 'Lab*.tsx'))

updated = 0

for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    original_content = content
    
    # Remove 'lg: ' or 'lg:' right before the ternary expression
    content = re.sub(r'lg:\s*\$\{activeMobileTab', r'${activeMobileTab', content)
    # Also check if there are any rogue 'lg: ' without anything following it (like we saw in some class strings earlier)
    # Actually wait, we saw `lg: lg:h-full` earlier. Let's fix that too.
    content = re.sub(r'lg:\s*lg:', r'lg:', content)
    
    if content != original_content:
        with open(f, 'w', encoding='utf-8') as file:
            file.write(content)
        updated += 1
        print(f"Fixed {os.path.basename(f)}")

print(f"\nUpdated {updated} files.")
