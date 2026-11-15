// Loads a self-contained TypeScript data module (type-only imports) into Node
// by transpiling it in memory. Lets build scripts read data files that use
// helper functions, which a regex over the source can't see through.
import { readFileSync } from 'node:fs';
import ts from 'typescript';

export async function loadTsModule(path) {
  const src = readFileSync(path, 'utf8');
  const { outputText } = ts.transpileModule(src, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2020,
      importsNotUsedAsValues: ts.ImportsNotUsedAsValues?.Remove,
    },
  });
  if (/^\s*import\s/m.test(outputText)) {
    throw new Error(`${path} has runtime imports — loadTsModule only handles self-contained data modules`);
  }
  return import('data:text/javascript;base64,' + Buffer.from(outputText, 'utf8').toString('base64'));
}
