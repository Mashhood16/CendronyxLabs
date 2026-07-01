import glob, os, re

components_dir = r'C:\Users\mashh\.gemini\antigravity\scratch\virtuallab\src\components'
files = glob.glob(os.path.join(components_dir, 'Lab*.tsx'))

missing = 0
for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    if 'activeMobileTab ===' not in content and 'activeMobileTab ==' not in content:
        missing += 1
        
        # Test my regex
        matches = re.findall(r'(<(?:section|div)\s+className=[\'"{`]+)(w-full[^>]*?|lg:col-span-[^>]*?)([\'"`]+)', content)
        print(f'{os.path.basename(f)} has {len(matches)} matches')
        if len(matches) > 3:
            print('  WARNING: too many matches!')
            
print(f'Missing logic in {missing} files.')
