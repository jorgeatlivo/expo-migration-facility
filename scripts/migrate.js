// scripts/migrate-ts-morph.js
const { Project } = require("ts-morph");
const path = require("path");

const project = new Project({
  tsConfigFilePath: path.resolve("tsconfig.json"),
});

const files = project.getSourceFiles("src/**/*.ts?(x)");

// List of cases to migrate: [import name, old path]
const migrations = [
  { name: "ProtectedStackRoutes", oldModule: "@/app/navigation/ProtectedStack/ProtectedStack" },
  { name: "HomeStackRoutes", oldModule: "@/screens/Feed/HomeStack" }
];

for (const sourceFile of files) {
  let modified = false;
  sourceFile.getImportDeclarations().forEach(importDecl => {
    const specifier = importDecl.getModuleSpecifierValue();
    migrations.forEach(({ name, oldModule }) => {
      if (specifier === oldModule) {
        const namedImports = importDecl.getNamedImports();
        namedImports.forEach(namedImport => {
          if (namedImport.getName() === name) {
            // Remove from old import
            namedImport.remove();
            // Add import from new module
            sourceFile.addImportDeclaration({
              namedImports: [name],
              moduleSpecifier: "@/app/navigation/enum"
            });
            modified = true;
          }
        });
        // If old import has nothing left, remove it completely
        if (importDecl.getNamedImports().length === 0) {
          importDecl.remove();
        }
      }
    });
  });
  if (modified) { sourceFile.saveSync(); }
}
console.log('Migration completed!');
