import re

with open(r'C:\Users\mashh\.gemini\antigravity\scratch\virtuallab\src\components\LabC12TransitionMetals.tsx', 'r', encoding='utf-8') as f: content = f.read()

# Replace corrupted theory button
new_content = re.sub(
    r"(className=\{`w-full[^`]+text-center)\s+\?\s+('bg-[^`]+`\})",
    r"\1 ${activeMobileTab === 'theory' ? \2",
    content
)

# Replace corrupted lab button
new_content = re.sub(
    r"(className=\{`w-full[^`]+text-center)\s+('bg-[^`]+`\})",
    r"\1 ${activeMobileTab === 'lab' ? \2",
    new_content
)

if new_content != content:
    print("Match successful.")
    # Show the match
    m1 = re.search(r"className=\{`w-full[^`]+text-center \$\{activeMobileTab === 'theory'[^`]+`\}", new_content)
    if m1: print("Theory restored:", m1.group(0))
    
    m2 = re.search(r"className=\{`w-full[^`]+text-center \$\{activeMobileTab === 'lab'[^`]+`\}", new_content)
    if m2: print("Lab restored:", m2.group(0))
else:
    print("No match.")
