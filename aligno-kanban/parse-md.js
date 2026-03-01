import fs from 'fs';
import path from 'path';

const basePath = path.resolve('..');

let tasks = [];
let existingTitles = new Set();

// Function to parse detailed script blocks
function parseDetailedScripts(fileContent, columnId, sourceFile) {
  const blocks = fileContent.split(/^##\s+SCRIPT/gm).filter(b => b.trim() !== '');
  
  for (const block of blocks) {
    const titleMatch = block.match(/^(?:\s+(\d+):\s+"(.*?)"|:\s+"(.*?)")/);
    if (!titleMatch) continue;
    
    const scriptNumber = titleMatch[1] ? `Script ${titleMatch[1]}` : 'Idea';
    const content = titleMatch[2] || titleMatch[3];
    
    if (existingTitles.has(content) && columnId === 'ideas') {
      // Skip if already in Approved or Archive
      continue;
    }
    
    if (columnId === 'approved' || columnId === 'archived') {
      existingTitles.add(content);
    }
    
    const categoryMatch = block.match(/\*\*Category:\*\*\s+(.*?)\s+\|/);
    const category = categoryMatch ? categoryMatch[1].trim() : undefined;
    
    const statusMatch = block.match(/\*\*Status:\*\*\s+(.*?)$/m);
    const status = statusMatch ? statusMatch[1].trim() : undefined;
    
    const hookAudioMatch = block.match(/- AUDIO:\s+"?(.*?)"?$/m);
    const hookAudio = hookAudioMatch ? hookAudioMatch[1].trim() : undefined;
    
    const hookTextMatch = block.match(/- TEXT ON SCREEN:\s+"?(.*?)"?$/m);
    const hookText = hookTextMatch ? hookTextMatch[1].trim() : undefined;
    
    const hookVisualMatch = block.match(/- VISUAL:\s+(.*?)$/m);
    const hookVisual = hookVisualMatch ? hookVisualMatch[1].trim() : undefined;
    
    const captionMatch = block.match(/\*\*CAPTION:\*\*\n([\s\S]*?)(?=\n\*\*SCRIPT:\*\*|\n\*\*CTA:\*\*|$)/);
    const caption = captionMatch ? captionMatch[1].trim() : undefined;
    
    const scriptMatch = block.match(/\*\*SCRIPT:\*\*\n([\s\S]*?)(?=\n\*\*CTA:\*\*|$)/);
    const scriptBody = scriptMatch ? scriptMatch[1].trim() : undefined;
    
    const ctaMatch = block.match(/\*\*CTA:\*\*\s+"?(.*?)"?$/m);
    const cta = ctaMatch ? ctaMatch[1].trim() : undefined;
    
    tasks.push({
      id: `task-${columnId}-${tasks.length}`,
      columnId,
      content,
      sourceFile,
      scriptNumber,
      createdAt: new Date().toISOString(),
      category,
      status,
      hookAudio,
      hookText,
      hookVisual,
      caption,
      scriptBody,
      cta,
    });
  }
}

// 1. Parse APPROVED CONTENT.md
try {
  const approvedContent = fs.readFileSync(path.join(basePath, 'APPROVED CONTENT.md'), 'utf-8');
  parseDetailedScripts(approvedContent, 'approved', 'APPROVED CONTENT.md');
} catch (e) {
  console.error('Error reading APPROVED CONTENT.md:', e);
}

// 2. Parse ARCHIVE.md
try {
  const archive = fs.readFileSync(path.join(basePath, 'ARCHIVE.md'), 'utf-8');
  parseDetailedScripts(archive, 'archived', 'ARCHIVE.md');
} catch (e) {
  console.error('Error reading ARCHIVE.md:', e);
}

// 3. Parse all SCRIPTS*.md files for Content Ideas
const files = fs.readdirSync(basePath);
const scriptFiles = files.filter(f => f.startsWith('SCRIPTS') && f.endsWith('.md'));

for (const file of scriptFiles) {
  try {
    const fileContent = fs.readFileSync(path.join(basePath, file), 'utf-8');
    parseDetailedScripts(fileContent, 'ideas', file);
  } catch (e) {
    console.error(`Error reading ${file}:`, e);
  }
}

const dataTsContent = `import type { BoardData } from './types';

export const initialData: BoardData = {
  columns: [
    { id: 'ideas', title: 'Content Ideas' },
    { id: 'approved', title: 'Approved' },
    { id: 'archived', title: 'Archived' },
  ],
  tasks: ${JSON.stringify(tasks, null, 2)}
};
`;

fs.writeFileSync(path.resolve('./src/data.ts'), dataTsContent);
console.log('Successfully generated src/data.ts based on markdown files. Total tasks:', tasks.length);