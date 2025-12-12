import { execFile } from "child_process";
import { ipcMain } from "electron";
import path from "path";

/**
 * 启动 openDesktopIcon.exe 并传入图标名称
 * @param name 桌面图标名称
 */
export function openDesktopIcon(name: string) {
    console.log("准备打开桌面图标:", name);

    const exePath = path.join(process.cwd(), "external", "openDesktopIcon.exe");

    try {
        const child = execFile(exePath, (err, stdout, stderr) => {
            if (err) {
                console.error("执行失败:", err);
                return;
            }
            if (stdout) console.log("输出:", stdout);
            if (stderr) console.error("错误输出:", stderr);
        });
        // 设置 stdin 编码并传入图标名
        child.stdin.setDefaultEncoding('utf16le');
        child.stdin.write(name + "\n", () => {
            child.stdin.end(); // 写完关闭 stdin
        });
    } catch (err) {
        console.error("启动 exe 失败:", err);
    }
}

/**
 * 设置 IPC 监听，将渲染进程请求转发给 openDesktopIcon
 */
export function setupDesktopHandler() {
    ipcMain.on('open-desktop-icon', (event, name: string) => {
        console.log("主进程收到双击请求:", name);
        openDesktopIcon(name); // 调用执行函数
    });
}
