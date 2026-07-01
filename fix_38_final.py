import glob, os, re

files = [
    'LabB10BloodSmear.tsx', 'LabB11Bioenergetics.tsx', 'LabB11Fungi.tsx', 'LabB11Genetics.tsx',
    'LabB11Inheritance.tsx', 'LabB11Microbiology.tsx', 'LabB11PlantPhysiology.tsx', 'LabB12Immunity.tsx',
    'LabB12NeuroEndocrine.tsx', 'LabB9Microscopy.tsx', 'LabC10SaltExcessBase.tsx', 'LabC10SaltExcessCarbonate.tsx',
    'LabC10StandardizationTitration.tsx', 'LabC11OrganicAnalysis.tsx', 'LabC12EquilibriumAcidBase.tsx',
    'LabC12SpectroscopyChromatography.tsx', 'LabC12TransitionMetals.tsx', 'LabC9QualitativeAnalysis.tsx',
    'LabC9SeparationTech.tsx', 'LabCS10FutureTech.tsx', 'LabCS10HTMLCSS.tsx', 'LabCS11Applications.tsx',
    'LabCS11DataScience.tsx', 'LabCS12DeepLearning.tsx', 'LabCS12IoTCloud.tsx', 'LabCS12MachineLearning.tsx',
    'LabCS9WebBasics.tsx', 'LabM10ChordBisectors.tsx', 'LabM10CircleApplications.tsx', 'LabM10CommonTangents.tsx',
    'LabM10ComplexApplications.tsx', 'LabM10EqualChords.tsx', 'LabM10InequalityApplications.tsx',
    'LabM10MatrixApplications.tsx', 'LabM11ComplexNumbers.tsx', 'LabM11SequencesSeries.tsx', 'LabM12Functions.tsx',
    'LabM9SetsRelations.tsx'
]

updated = 0
for base in files:
    f = os.path.join(r'C:\Users\mashh\.gemini\antigravity\scratch\virtuallab\src\components', base)
    if not os.path.exists(f): continue
    
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
        
    m = re.search(r'(</button>\s*</div>)(.*)', content, re.DOTALL)
    if not m: continue
    
    prefix = content[:m.start(2)]
    rest = m.group(2)
    
    def replacer(match):
        tag_start = match.group(1)
        quote_start = match.group(2)
        classes = match.group(3)
        quote_end = match.group(4)
        
        if 'activeMobileTab' in classes:
            return match.group(0)
            
        classes = re.sub(r'\b(hidden|flex|block)\b', '', classes).strip()
        
        if quote_start in ['"', "'"]:
            quote_start = '{`'
            quote_end = '`}'
            
        new_classes = f"{classes} flex-col ${{activeMobileTab === 'lab' ? 'flex' : 'hidden'}} lg:flex"
        return f"{tag_start}{quote_start}{new_classes}{quote_end}"
        
    # Find all div/section that have border-slate-200 and p-6 or p-8
    new_rest = re.sub(r'(<(?:div|section)\s+className=)([\'"{`]+)([^>]*?border-slate-200[^>]*?)([\'"`]+(?:>|\s))', replacer, rest)
    
    if new_rest != rest:
        with open(f, 'w', encoding='utf-8') as file:
            file.write(prefix + new_rest)
        updated += 1
        print(f"Fixed {base}")

print(f"Updated {updated} files.")
