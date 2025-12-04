import { spawn } from 'child_process'

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
