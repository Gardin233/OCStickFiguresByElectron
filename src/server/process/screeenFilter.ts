import { ChildProcess, execFile } from "child_process";
import path from "path";

  // 全局保存子进程实例（只启动一次）
let screenFilterProcess: ChildProcess | null = null;

const exePath = path.join(process.cwd(), "external", "changeScreen.exe");
// 函数：启动（或重用）子进程
export function getOrCreateScreenFilterProcess(): ChildProcess {
    if (screenFilterProcess && !screenFilterProcess.killed && screenFilterProcess.exitCode === null) {
        console.log('复用已存在的 changeScreen.exe 进程');
        return screenFilterProcess;
    }
    console.log('启动新的 changeScreen.exe 进程（持久运行）');
    screenFilterProcess = execFile(exePath, {
        windowsHide: true,
        maxBuffer: 1024 * 1024 * 10,
    }, (err, stdout, stderr) => {
        if (err) {
            console.error('changeScreen.exe 执行出错:', err);
        }
        if (stdout) console.log('changeScreen.exe 输出:', stdout);
        if (stderr) console.error('changeScreen.exe 错误:', stderr);
    });

    // 监听子进程意外退出
    screenFilterProcess.on('exit', (code, signal) => {
        console.log(`changeScreen.exe 已退出，代码: ${code}, 信号: ${signal}`);
        screenFilterProcess = null;
    });

    screenFilterProcess.on('error', (err) => {
        console.error('启动 changeScreen.exe 失败:', err);
        screenFilterProcess = null;
    });

    // 确保 stdin 可用（某些情况下 spawn 后才准备好）
    screenFilterProcess.stdin?.setDefaultEncoding('utf8');
    return screenFilterProcess;
}
