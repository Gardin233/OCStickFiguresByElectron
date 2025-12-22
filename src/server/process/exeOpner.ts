import { ChildProcess,execFile } from "child_process";
import { app } from "electron";
import path from "path"
import { externalBase } from "../../global.js";

let DeskTopOpner:ChildProcess |null =null
const exePath =path.join(externalBase,"external","openDesktopIcon.exe")

export function getOrCreateDeskTopOpnerProcess():ChildProcess{
     if (DeskTopOpner && !DeskTopOpner.killed && DeskTopOpner.exitCode === null) {
        console.log('复用已存在的 openDesktopIcon.exe 进程');
        return DeskTopOpner;
    }
      console.log('启动新的 openDesktopIcon.exe 进程（持久运行）');
         DeskTopOpner = execFile(exePath, {
            windowsHide: true,
            maxBuffer: 1024 * 1024 * 10,
        }, (err, stdout, stderr) => {
            if (err) {
                console.error('openDesktopIcon.exe 执行出错:', err);
            }
            if (stdout) console.log('openDesktopIcon.exe 输出:', stdout);
            if (stderr) console.error('openDesktopIcon.exe 错误:', stderr);
        });
    
        // 监听子进程意外退出
        DeskTopOpner.on('exit', (code, signal) => {
            console.log(`openDesktopIcon.exe 已退出，代码: ${code}, 信号: ${signal}`);
            DeskTopOpner = null;
        });
    
        DeskTopOpner.on('error', (err) => {
            console.error('启动 openDesktopIcon.exe 失败:', err);
            DeskTopOpner = null;
        });
    
        // 确保 stdin 可用（某些情况下 spawn 后才准备好）
        DeskTopOpner.stdin?.setDefaultEncoding('utf16le');
        return DeskTopOpner;
}