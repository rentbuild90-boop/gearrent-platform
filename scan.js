const fs = require('fs');
const path = require('path');

const GEAR_DIR = 'd:\\gear';
const FRONTEND_APP_DIR = path.join(GEAR_DIR, 'frontend', 'src', 'app');
const OUTPUT_FILE = path.join(GEAR_DIR, 'frontend_scan.md');

let output = '# Frontend Application Scan\n\n';
output += 'This document outlines all pages, roles, and form data fields found across the frontend applications.\n\n';

function extractAttributes(tag) {
    const attrs = {};
    const regex = /(\w+)=("[^"]*"|'[^']*'|\{[^}]*\})/g;
    let match;
    while ((match = regex.exec(tag)) !== null) {
        attrs[match[1]] = match[2].replace(/^["']|["']$/g, '');
    }
    return attrs;
}

function scanFileForFields(filePath, content) {
    const fields = [];
    
    // Look for <input>, <Input>, <textarea>, <Textarea>, <select>, <Select>
    const fieldRegex = /<(input|textarea|select|Input|Textarea|Select)\s([^>]+)>/gi;
    let match;
    
    while ((match = fieldRegex.exec(content)) !== null) {
        const type = match[1];
        const attrs = extractAttributes(match[2]);
        
        // Try to find a meaningful name
        let name = attrs.name || attrs.id || attrs.label || 'unnamed';
        if (name === 'unnamed' && attrs.type) name = `unnamed_${attrs.type}`;
        
        fields.push({
            tag: type,
            name: name,
            type: attrs.type || 'text',
            placeholder: attrs.placeholder || ''
        });
    }
    
    return fields;
}

function processDirectory(dir, rolePrefix = '') {
    if (!fs.existsSync(dir)) return;
    
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory()) {
            processDirectory(fullPath, rolePrefix);
        } else if (entry.isFile() && (entry.name.endsWith('.jsx') || entry.name.endsWith('.tsx') || entry.name.endsWith('.html'))) {
            const content = fs.readFileSync(fullPath, 'utf8');
            const fields = scanFileForFields(fullPath, content);
            
            // Only add to output if it seems to be a page or has fields
            const isPage = entry.name.startsWith('page.') || entry.name === 'code.html';
            if (isPage || fields.length > 0) {
                const relativePath = path.relative(GEAR_DIR, fullPath).replace(/\\/g, '/');
                
                output += `## File: \`${relativePath}\`\n`;
                
                // Determine Role based on path
                let role = 'General';
                if (relativePath.includes('app/admin') || relativePath.includes('admin_control_panel')) role = 'Admin';
                else if (relativePath.includes('app/owner') || relativePath.includes('owner_dashboard')) role = 'Owner';
                else if (relativePath.includes('app/driver') || relativePath.includes('driver_dashboard')) role = 'Driver';
                else if (relativePath.includes('app/user') || relativePath.includes('renter_')) role = 'User / Renter';
                else if (relativePath.includes('app/developer')) role = 'Developer';
                
                output += `**Role:** ${role}  \n`;
                output += `**Location:** \`${fullPath}\`\n\n`;
                
                if (fields.length > 0) {
                    output += `### Form / Data Fields:\n`;
                    output += `| Tag | Name / ID | Type | Placeholder |\n`;
                    output += `|---|---|---|---|\n`;
                    
                    for (const field of fields) {
                        output += `| ${field.tag} | ${field.name} | ${field.type} | ${field.placeholder} |\n`;
                    }
                    output += '\n';
                } else {
                    output += `*No standard form fields detected.*\n\n`;
                }
            }
        }
    }
}

// 1. Scan Next.js App Directory
output += '# Next.js Application (`frontend/src/app`)\n\n';
processDirectory(FRONTEND_APP_DIR);

// 2. Scan Mockup / Additional HTML Directories
output += '# HTML Mockups / Other Frontends\n\n';
const rootEntries = fs.readdirSync(GEAR_DIR, { withFileTypes: true });
for (const entry of rootEntries) {
    if (entry.isDirectory() && entry.name !== 'frontend' && entry.name !== 'gearrent_modern_design_system') {
        processDirectory(path.join(GEAR_DIR, entry.name));
    }
}

fs.writeFileSync(OUTPUT_FILE, output);
console.log(`Scan complete. Results written to ${OUTPUT_FILE}`);
