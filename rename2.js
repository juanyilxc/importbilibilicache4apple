const fs = require('fs');
const path = require('path');

// 配置参数
const OUTPUT_ROOT = './output'; // 输出目录

// 遍历并修改文件后缀名
function renameFilesToMp4(dir) {
  const items = fs.readdirSync(dir);

  items.forEach((item) => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // 如果是目录，递归处理
      renameFilesToMp4(fullPath);
    } else if (stat.isFile()) {
      // 如果是文件，修改后缀名为 .mp4
      const newFilePath = path.join(dir, `${path.basename(item, path.extname(item))}.mp4`);

      // 重命名文件
      fs.renameSync(fullPath, newFilePath);
      console.log(`重命名: ${fullPath} -> ${newFilePath}`);
    }
  });
}

// 确保输出目录存在
if (!fs.existsSync(OUTPUT_ROOT)) {
  console.error(`目录不存在: ${OUTPUT_ROOT}`);
  process.exit(1);
}

// 执行重命名
renameFilesToMp4(OUTPUT_ROOT);