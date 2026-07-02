const fs = require('fs');
const path = require('path');

function search(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            search(fullPath);
        } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            const lines = content.split('\n');
            let found = false;
            lines.forEach((line, i) => {
                if (line.includes('$')) {
                    // filter out ${ ... } which is template literal
                    const noTemplateLiterals = line.replace(/\$\{[^}]+\}/g, '');
                    if (noTemplateLiterals.includes('$')) {
                       // filter out $match
                       if (!noTemplateLiterals.includes('$match') && !noTemplateLiterals.includes('^[0-9]*$') && !noTemplateLiterals.includes('^[0-9]+$')) {
                           console.log(`${fullPath}:${i+1}: ${line.trim()}`);
                       }
                    }
                }
            });
        }
    }
}

search('d:/gear/frontend/src');
