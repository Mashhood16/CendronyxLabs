import { Project, SyntaxKind, Node, JsxText, StringLiteral } from 'ts-morph';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const project = new Project({
  tsConfigFilePath: path.join(__dirname, '../tsconfig.json'),
});

const enJsonPath = path.join(__dirname, '../src/locales/en/translation.json');
let enData: Record<string, string> = {};
if (fs.existsSync(enJsonPath)) {
  enData = JSON.parse(fs.readFileSync(enJsonPath, 'utf8'));
}

project.addSourceFilesAtPaths("src/components/Lab*.tsx");
const files = project.getSourceFiles("src/components/Lab*.tsx");

console.log(`Processing ${files.length} files...`);

let totalStringsExtracted = 0;

function slugify(text: string, prefix: string): string {
  let s = text.toLowerCase().trim();
  s = s.replace(/[^a-z0-9]/g, '_');
  s = s.replace(/_+/g, '_').replace(/^_|_$/g, '');
  return `${prefix}_${s.substring(0, 30)}`;
}

for (const sourceFile of files) {
  const baseName = sourceFile.getBaseNameWithoutExtension();
  let prefix = `lab.${baseName.toLowerCase().replace('lab', '')}`;
  let modified = false;

  let needsUseTranslate = false;

  // Extract text from JsxText
  const jsxTexts = sourceFile.getDescendantsOfKind(SyntaxKind.JsxText);
  for (const node of jsxTexts) {
    const text = node.getLiteralText();
    if (text.trim().length > 2 && /[a-zA-Z]/.test(text)) {
      const cleanText = text.replace(/\s+/g, ' ').trim();
      if (cleanText.length < 2) continue;
      
      const parent = node.getParent();
      if (parent && parent.getKind() === SyntaxKind.JsxExpression) {
         continue;
      }

      let key = slugify(cleanText, prefix);
      
      let counter = 1;
      let finalKey = key;
      while (enData[finalKey] && enData[finalKey] !== cleanText) {
        finalKey = `${key}_${counter}`;
        counter++;
      }

      enData[finalKey] = cleanText;
      
      const match = text.match(/^(\s*)(.*?)(\s*)$/s);
      if (match) {
        const leading = match[1];
        const trailing = match[3];
        node.replaceWithText(`${leading}{t('${finalKey}')}${trailing}`);
        needsUseTranslate = true;
        modified = true;
        totalStringsExtracted++;
      }
    }
  }

  // Also extract from specific attributes like title, placeholder
  const jsxAttributes = sourceFile.getDescendantsOfKind(SyntaxKind.JsxAttribute);
  for (const attr of jsxAttributes) {
    const name = attr.getNameNode().getText();
    if (['title', 'placeholder', 'label'].includes(name)) {
      const initializer = attr.getInitializer();
      if (initializer && Node.isStringLiteral(initializer)) {
        const text = initializer.getLiteralValue();
        if (text.trim().length > 2 && /[a-zA-Z]/.test(text)) {
          let key = slugify(text, prefix);
          let counter = 1;
          let finalKey = key;
          while (enData[finalKey] && enData[finalKey] !== text) {
            finalKey = `${key}_${counter}`;
            counter++;
          }
          enData[finalKey] = text;
          initializer.replaceWithText(`{t('${finalKey}')}`);
          needsUseTranslate = true;
          modified = true;
          totalStringsExtracted++;
        }
      }
    }
  }

  if (needsUseTranslate) {
    const importDec = sourceFile.getImportDeclaration(dec => dec.getModuleSpecifierValue().includes('i18n'));
    if (!importDec) {
      sourceFile.addImportDeclaration({
        namedImports: ['useTranslate'],
        moduleSpecifier: '../i18n'
      });
    } else {
      const hasUseTranslate = importDec.getNamedImports().some(n => n.getName() === 'useTranslate');
      if (!hasUseTranslate) {
        importDec.addNamedImport('useTranslate');
      }
    }

    const defaultExport = sourceFile.getFunction(dec => dec.isDefaultExport());
    if (defaultExport) {
      const statements = defaultExport.getStatements();
      const hasT = statements.some(s => s.getText().includes('useTranslate('));
      if (!hasT) {
        defaultExport.insertStatements(0, 'const { t } = useTranslate();');
      }
    }
  }

  if (modified) {
    sourceFile.saveSync();
  }
}

fs.writeFileSync(enJsonPath, JSON.stringify(enData, null, 2));
console.log(`Successfully extracted ${totalStringsExtracted} strings into JSON.`);
