const fs = require('fs');
const path = require('path');

// 配置参数
const OUTPUT_ROOT = './output'; // 输出目录
let n = 721; // 起始编号

// 遍历并重命名文件
function renameFiles(dir) {
  const items = fs.readdirSync(dir);

  items.forEach((item) => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // 如果是目录，递归处理
      renameFiles(fullPath);
    } else if (stat.isFile() && path.extname(fullPath) === '.mp4') {
      // 如果是 .mp4 文件，移动并重命名
      const newFileName = `${n}-${n + 19}集.mp4`;
      const newFilePath = path.join(OUTPUT_ROOT, newFileName);

      // 移动并重命名文件
      fs.renameSync(fullPath, newFilePath);
      console.log(`重命名并移动: ${fullPath} -> ${newFilePath}`);

      // 更新 n 的值
      n += 21;
    }
  });
}

// 确保输出目录存在
if (!fs.existsSync(OUTPUT_ROOT)) {
  fs.mkdirSync(OUTPUT_ROOT, { recursive: true });
}

// 执行重命名
renameFiles(OUTPUT_ROOT);