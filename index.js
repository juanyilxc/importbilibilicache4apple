const { execFile } = require('child_process');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

// 配置参数
const INPUT_ROOT = './1651573380'; // 替换为您的根目录
const OUTPUT_ROOT = './output'; // 合并文件输出目录
const MP4BOX_PATH = 'G:/Program Files/nodejs/mp4box.exe'; // 替换为 mp4box.exe 的路径

// 递归查找所有 section 文件
function findSectionFiles(dir) {
  const files = fs.readdirSync(dir);
  const result = { video: null, audio: null };

  files.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // 递归子目录
      const subResult = findSectionFiles(fullPath);
      if (subResult.video) result.video = subResult.video;
      if (subResult.audio) result.audio = subResult.audio;
    } else if (file === '0.section') {
      result.video = fullPath;
    } else if (file === '1.section') {
      result.audio = fullPath;
    }
  });

  return result;
}

// 调用 mp4box.exe 合并音视频文件
function mergeFilesWithMp4box(videoPath, audioPath, outputPath) {
  return new Promise((resolve, reject) => {
    const args = [
      '-add', videoPath, // 添加视频文件
      '-add', audioPath, // 添加音频文件
      outputPath         // 输出文件路径
    ];

    execFile(MP4BOX_PATH, args, (error, stdout, stderr) => {
      if (error) {
        console.error(`合并失败: ${stderr}`);
        reject(error);
      } else {
        console.log(`合并成功: ${outputPath}`);
        resolve(stdout);
      }
    });
  });
}

// 主流程
async function main() {
  if (!fs.existsSync(OUTPUT_ROOT)) {
    fs.mkdirSync(OUTPUT_ROOT, { recursive: true });
  }

  const rootDirs = fs.readdirSync(INPUT_ROOT);

  for (const dir of rootDirs) {
    const fullDirPath = path.join(INPUT_ROOT, dir);
    const stat = fs.statSync(fullDirPath);

    if (stat.isDirectory()) {
      const { video, audio } = findSectionFiles(fullDirPath);

      if (video && audio) {
        const relativePath = path.relative(INPUT_ROOT, path.dirname(video));
        // const outputDir = path.join(OUTPUT_ROOT, relativePath);
        const outputDir = OUTPUT_ROOT;
        if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
        aid = INPUT_ROOT.replace('./', '');
        // 提取父目录名称作为文件名
        const parentDirName = path.basename(path.dirname(path.dirname(video)));
        var outputFile
        await axios.get(`https://api.bilibili.com/x/web-interface/view?aid=${aid}`).then((res) => {
          const title = res.data.code !== 0?null:res.data.data.title;
          console.log(`视频标题: ${title}`);
          outputFile = title==null?parentDirName:title;
          outputFile = path.join(outputDir, `${outputFile}.mp4`);
          console.log(`合并文件: ${video}, ${audio} -> ${outputFile}`);
        });
        
        // const outputFile = path.join(outputDir, `${parentDirName}.mp4`);
        outputFile = Filter(outputFile);
        try {
          await mergeFilesWithMp4box(video, audio, outputFile);
        } catch (e) {
          console.error(`合并失败: ${outputFile}`, e);
        }
      } else {
        console.warn(`跳过目录（缺少音视频文件）: ${fullDirPath}`);
      }
    }
  }
}

// 执行
main().then(() => console.log('全部合并完成！'));

// Filter 过滤文件名
function Filter(name)  {
	name = name.replaceAll("(", "（");
	name = name.replaceAll(")", "）" );
	name = name.replaceAll("<", "《");
	name = name.replaceAll(">", "》");
	// name = name.replaceAll("\\", "#");
	name = name.replaceAll("\"", "\'");
	name = name.replaceAll("/", "#");
	name = name.replaceAll("|", "_");
	name = name.replaceAll("?", "？");
	name = name.replaceAll("*", "-");
	name = name.replaceAll("[","【");
	name = name.replaceAll("]","】");
	name = name.replaceAll(":","：");
	name = name.replaceAll(" ", "");

	return name.trim();
}