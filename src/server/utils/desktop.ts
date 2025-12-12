import { execFile, spawn } from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url'
import { app } from 'electron'
import fs from 'fs'
import { icon } from '../../types/desktop.js'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function resolveExePath() {
  return app.isPackaged
    ? path.join(process.resourcesPath, "external",'EnumDesktopIcons.exe')  // 打包后位置
    : path.join(process.cwd(),'external','EnumDesktopIcons.exe')          // dev 位置在项目根目录
}

/**
 * 通用打开 exe 函数（主进程使用）
 * @param path exe 文件路径
 * @param args 可选参数数组
 */
export function openEXE(path: string, args: string[] = []) {
  try {
    const child = spawn(path, args, { detached: true, stdio: 'ignore' })
    child.unref() // 子进程独立于 Electron 主进程
    console.log(`已启动 ${path}`)
    return true
  } catch (err) {
    console.error(`启动 ${path} 失败:`, err)
    return false
  }
}
/**
 * @description 获取桌面图标位置，通过使用外部程序获取
 * 
 */
export async function getDesktopIconPosition(): Promise<icon[]> {
  const exePath = resolveExePath();
  // 等待 execFile 执行完成
  const stdout: string = await new Promise((resolve, reject) => {
    execFile(exePath, (error, out) => {
      if (error) return reject(error);
      resolve(out);
    });
  });

  // console.log('exe 输出:\n', stdout);
  const lines = stdout.trim().split(/\r?\n/);
  const icons: icon[] = [];
  for (let i = 1; i < lines.length; i += 3) {
    const [x, y] = lines[i].split(' ').map(Number);
    const name = lines[i + 1];
    const target = lines[i + 2];
    icons.push({ name, position: { x, y }, target });
  }
  // console.log('解析后的图标数组:', icons);
  return icons;
}