/**
 * Script để chuyển đổi CSS variables thành lớp tiện ích Tailwind v4
 * Chạy với: node convert-to-css-vars.js
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const stat = promisify(fs.stat);

// Các mẫu thay thế (ngược lại của mẫu trước đó)
const replacements = [
  // Colors - Text
  { pattern: /\btext-\[var\(--foreground\)\]/g, replacement: 'text-foreground' },
  { pattern: /\btext-\[var\(--primary\)\]/g, replacement: 'text-primary' },
  { pattern: /\btext-\[var\(--primary-foreground\)\]/g, replacement: 'text-primary-foreground' },
  { pattern: /\btext-\[var\(--secondary\)\]/g, replacement: 'text-secondary' },
  { pattern: /\btext-\[var\(--secondary-foreground\)\]/g, replacement: 'text-secondary-foreground' },
  { pattern: /\btext-\[var\(--muted-foreground\)\]/g, replacement: 'text-muted-foreground' },
  { pattern: /\btext-\[var\(--accent-foreground\)\]/g, replacement: 'text-accent-foreground' },
  { pattern: /\btext-\[var\(--destructive\)\]/g, replacement: 'text-destructive' },
  { pattern: /\btext-\[var\(--destructive-foreground\)\]/g, replacement: 'text-destructive-foreground' },
  { pattern: /\btext-\[var\(--success\)\]/g, replacement: 'text-success' },
  { pattern: /\btext-\[var\(--success-foreground\)\]/g, replacement: 'text-success-foreground' },
  
  // Colors - Background
  { pattern: /\bbg-\[var\(--background\)\]/g, replacement: 'bg-background' },
  { pattern: /\bbg-\[var\(--foreground\)\]/g, replacement: 'bg-foreground' },
  { pattern: /\bbg-\[var\(--primary\)\]/g, replacement: 'bg-primary' },
  { pattern: /\bbg-\[var\(--primary-foreground\)\]/g, replacement: 'bg-primary-foreground' },
  { pattern: /\bbg-\[var\(--secondary\)\]/g, replacement: 'bg-secondary' },
  { pattern: /\bbg-\[var\(--secondary-foreground\)\]/g, replacement: 'bg-secondary-foreground' },
  { pattern: /\bbg-\[var\(--accent\)\]/g, replacement: 'bg-accent' },
  { pattern: /\bbg-\[var\(--destructive\)\]/g, replacement: 'bg-destructive' },
  { pattern: /\bbg-\[var\(--muted\)\]/g, replacement: 'bg-muted' },
  { pattern: /\bbg-\[var\(--card-background\)\]/g, replacement: 'bg-card' },
  { pattern: /\bbg-\[var\(--popover-background\)\]/g, replacement: 'bg-popover' },
  { pattern: /\bbg-\[var\(--success\)\]/g, replacement: 'bg-success' },

  // Colors - Border
  { pattern: /\bborder-\[var\(--border\)\]/g, replacement: 'border-border' },
  { pattern: /\bborder-\[var\(--input\)\]/g, replacement: 'border-input' },
  { pattern: /\bborder-\[var\(--primary\)\]/g, replacement: 'border-primary' },
  { pattern: /\bborder-\[var\(--destructive\)\]/g, replacement: 'border-destructive' },
  
  // Colors - Ring
  { pattern: /\bring-\[var\(--ring\)\]/g, replacement: 'ring-ring' },
  { pattern: /\bring-offset-\[var\(--background\)\]/g, replacement: 'ring-offset-background' },
  
  // Transitions
  { pattern: /\bduration-\[var\(--transition-normal\)\]/g, replacement: 'duration-normal' },
  { pattern: /\bduration-\[var\(--transition-fast\)\]/g, replacement: 'duration-fast' },
  
  // Special cases with modifiers
  { pattern: /\bbg-\[var\(--primary\)\]\/(\d+)/g, replacement: 'bg-primary/$1' },
  { pattern: /\bbg-\[var\(--secondary\)\]\/(\d+)/g, replacement: 'bg-secondary/$1' },
  { pattern: /\bbg-\[var\(--destructive\)\]\/(\d+)/g, replacement: 'bg-destructive/$1' },
  { pattern: /\bbg-\[var\(--success\)\]\/(\d+)/g, replacement: 'bg-success/$1' },
  { pattern: /\bbg-\[var\(--accent\)\]\/(\d+)/g, replacement: 'bg-accent/$1' },
  
  // Hover states
  { pattern: /\bhover:bg-\[var\(--primary\)\]/g, replacement: 'hover:bg-primary' },
  { pattern: /\bhover:bg-\[var\(--secondary\)\]/g, replacement: 'hover:bg-secondary' },
  { pattern: /\bhover:bg-\[var\(--accent\)\]/g, replacement: 'hover:bg-accent' },
  { pattern: /\bhover:text-\[var\(--accent-foreground\)\]/g, replacement: 'hover:text-accent-foreground' },
  { pattern: /\bhover:text-\[var\(--primary-foreground\)\]/g, replacement: 'hover:text-primary-foreground' },
  { pattern: /\bhover:text-\[var\(--secondary-foreground\)\]/g, replacement: 'hover:text-secondary-foreground' },
  { pattern: /\bhover:border-\[var\(--primary\)\]/g, replacement: 'hover:border-primary' },
  
  // Focus states
  { pattern: /\bfocus:bg-\[var\(--accent\)\]/g, replacement: 'focus:bg-accent' },
  { pattern: /\bfocus:text-\[var\(--accent-foreground\)\]/g, replacement: 'focus:text-accent-foreground' },
  { pattern: /\bfocus-visible:ring-\[var\(--ring\)\]/g, replacement: 'focus-visible:ring-ring' },
  
  // Active states
  { pattern: /\bactive:bg-\[var\(--accent\)\]/g, replacement: 'active:bg-accent' },
  { pattern: /\bactive:bg-\[var\(--accent\)\]\/90/g, replacement: 'active:bg-accent/90' },
  { pattern: /\bactive:text-\[var\(--accent-foreground\)\]/g, replacement: 'active:text-accent-foreground' },
  
  // Data states
  { pattern: /\bdata-\[state=open\]:bg-\[var\(--primary\)\]/g, replacement: 'data-[state=open]:bg-primary' },
  { pattern: /\bdata-\[state=open\]:text-\[var\(--primary-foreground\)\]/g, replacement: 'data-[state=open]:text-primary-foreground' },
];

// Các thư mục cần loại trừ
const excludeDirs = ['node_modules', '.git', '.next', 'dist', 'build'];
// Chỉ xử lý các file có phần mở rộng
const includeExtensions = ['.tsx', '.jsx', '.ts', '.js'];

/**
 * Kiểm tra xem một đường dẫn có phải là thư mục loại trừ hay không
 */
function isExcludedDir(pathItem) {
  return excludeDirs.some(dir => pathItem.includes(`/${dir}/`) || pathItem.includes(`\\${dir}\\`));
}

/**
 * Kiểm tra xem một file có phải là loại cần xử lý hay không
 */
function shouldProcessFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return includeExtensions.includes(ext) && !isExcludedDir(filePath);
}

/**
 * Xử lý nội dung của một file
 */
async function processFileContent(filePath, content) {
  let newContent = content;
  let hasChanges = false;

  for (const { pattern, replacement } of replacements) {
    const updatedContent = newContent.replace(pattern, replacement);
    if (updatedContent !== newContent) {
      hasChanges = true;
      newContent = updatedContent;
    }
  }

  if (hasChanges) {
    console.log(`Cập nhật: ${filePath}`);
    await writeFile(filePath, newContent, 'utf-8');
    return true;
  }
  
  return false;
}

/**
 * Quét đệ quy tất cả các file trong thư mục
 */
async function scanDirectory(dirPath) {
  try {
    const entries = await readdir(dirPath, { withFileTypes: true });
    let totalUpdated = 0;

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      
      if (entry.isDirectory() && !isExcludedDir(fullPath)) {
        totalUpdated += await scanDirectory(fullPath);
      } else if (entry.isFile() && shouldProcessFile(fullPath)) {
        try {
          const content = await readFile(fullPath, 'utf-8');
          const updated = await processFileContent(fullPath, content);
          if (updated) totalUpdated++;
        } catch (err) {
          console.error(`Lỗi khi xử lý file ${fullPath}:`, err);
        }
      }
    }

    return totalUpdated;
  } catch (err) {
    console.error(`Lỗi khi quét thư mục ${dirPath}:`, err);
    return 0;
  }
}

// Đường dẫn cần xử lý
const DIRS_TO_PROCESS = [
  './src/app',
  './src/components',
  './src/features',
];

// Thực thi script
async function main() {
  console.log('Bắt đầu chuyển đổi CSS variables thành Tailwind v4 utilities...');
  
  let totalFilesUpdated = 0;
  for (const dir of DIRS_TO_PROCESS) {
    try {
      const dirStat = await stat(dir);
      if (dirStat.isDirectory()) {
        const updatedInDir = await scanDirectory(dir);
        totalFilesUpdated += updatedInDir;
        console.log(`- Đã xử lý ${dir}: ${updatedInDir} file được cập nhật`);
      }
    } catch (err) {
      console.error(`Thư mục ${dir} không tồn tại hoặc không thể truy cập`);
    }
  }
  
  console.log(`\nHoàn thành! Đã cập nhật ${totalFilesUpdated} file.`);
  console.log('\nLưu ý: Vui lòng kiểm tra lại các file đã được cập nhật để đảm bảo không có vấn đề.');
  console.log('Một số trường hợp đặc biệt có thể cần chỉnh sửa thủ công.');
}

main().catch(err => {
  console.error('Đã xảy ra lỗi:', err);
  process.exit(1);
}); 