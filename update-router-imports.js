const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'frontend/src/pages');
const files = fs.readdirSync(pagesDir).filter(file => file.endsWith('.tsx'));

files.forEach(file => {
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace useHistory with useNavigate and update imports
  if (content.includes('useNavigate') || content.includes('useSearchParams')) {
    content = content.replace(
      /import \{ (.*?)(useNavigate|useSearchParams)(.*?) \} from ['"]react-router-dom['"]/g,
      (match, p1, p2, p3) => {
        // Remove the hook from the existing import
        const hooks = p1.replace(/,\s*$/, '') + p3.replace(/^,/, '');
        // Add the correct import for v5
        const newImport = `import { ${hooks} } from 'react-router-dom'`;
        if (match.includes('useNavigate')) {
          return `${newImport}\nimport { useNavigate } from 'react-router-dom'`;
        }
        return newImport;
      }
    );
    
    // Replace useNavigate usage with useHistory
    content = content.replace(
      /const navigate = useNavigate\(([^)]*)\)/g,
      'const history = useHistory()'
    );
    
    // Replace navigate() calls with history.push()
    content = content.replace(/navigate\(([^)]+)\)/g, 'history.push($1)');
    
    // Replace useSearchParams with URLSearchParams
    content = content.replace(
      /const \[searchParams, setSearchParams\] = useSearchParams\(\)/g,
      'const searchParams = new URLSearchParams(useLocation().search)'
    );
    
    // Add useHistory to the imports if not already there
    if (content.includes('useHistory') && !content.includes("from 'react-router-dom'")) {
      content = content.replace(
        /import \{/,
        'import { useHistory,'
      );
    }
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});

console.log('Done updating router imports!');
