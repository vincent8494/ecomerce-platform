const fs = require('fs');
const path = require('path');

const servicesDir = path.join(__dirname, 'frontend/src/services');
const files = [
  'authService.ts',
  'orderService.ts',
  'paymentService.ts',
  'userService.ts'
];

files.forEach(file => {
  const filePath = path.join(servicesDir, file);
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Convert regular imports to type-only imports for types
  content = content.replace(
    /import \{ ([^}]+) \} from ['"]([^'"]+)['"]/g,
    (match, imports, module) => {
      const typeImports = [];
      const valueImports = [];
      
      imports.split(',').forEach(imp => {
        const trimmed = imp.trim();
        if (['LoginFormData', 'RegisterFormData', 'User', 'Order', 'PaginatedResponse', 
             'ShippingAddress', 'Stripe', 'FormikHelpers', 'ThemeOptions', 'CartItem'].includes(trimmed)) {
          typeImports.push(trimmed);
        } else {
          valueImports.push(trimmed);
        }
      });
      
      const typeImport = typeImports.length > 0 
        ? `import type { ${typeImports.join(', ')} } from '${module}';\n` 
        : '';
      
      const valueImport = valueImports.length > 0 
        ? `import { ${valueImports.join(', ')} } from '${module}';` 
        : '';
      
      return typeImport + valueImport;
    }
  );
  
  // Fix React Router imports if any
  content = content.replace(
    /import \{ (.*?)(useNavigate|useSearchParams)(.*?) \} from ['"]react-router-dom['"]/g,
    'import { $1$3 } from \'react-router-dom\''
  );
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${file}`);
});

// Fix theme.ts
const themePath = path.join(__dirname, 'frontend/src/theme.ts');
if (fs.existsSync(themePath)) {
  let content = fs.readFileSync(themePath, 'utf8');
  content = content.replace(
    /import \{ (ThemeOptions) \} from ['"]@mui\/material\/styles['"]/,
    'import type { $1 } from \'@mui/material/styles\''
  );
  fs.writeFileSync(themePath, content, 'utf8');
  console.log('Updated theme.ts');
}

// Fix formUtils.ts
const formUtilsPath = path.join(__dirname, 'frontend/src/utils/formUtils.ts');
if (fs.existsSync(formUtilsPath)) {
  let content = fs.readFileSync(formUtilsPath, 'utf8');
  content = content.replace(
    /import \{ FormikHelpers \} from ['"]formik['"]/,
    'import type { FormikHelpers } from \'formik\''
  );
  fs.writeFileSync(formUtilsPath, content, 'utf8');
  console.log('Updated formUtils.ts');
}

console.log('Done updating type imports!');
