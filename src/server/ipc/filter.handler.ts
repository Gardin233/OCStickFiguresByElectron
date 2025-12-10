import { ipcMain } from "electron";
import { getOrCreateScreenFilterProcess } from "../process/screeenFilter.js";

export function setScreenHandler(){
    // IPC 监听：接收渲染进程发送的滤镜类型
    ipcMain.on('change-screen-filter', (event, type: string) => {
        console.log('主进程收到屏幕滤镜变更请求:', type);
    
        const child = getOrCreateScreenFilterProcess();
    
        // 直接写入命令 + 换行（子进程应循环读取 stdin）
        if (child.stdin && !child.stdin.destroyed) {
            const success = child.stdin.write(type + '\n', 'utf8');
            if (!success) {
                console.warn('stdin 缓冲区满，稍后会自动发送');
            }
        } else {
            console.error('子进程 stdin 不可用，可能已关闭');
            // 尝试重启
            setTimeout(() => {
                const retryChild = getOrCreateScreenFilterProcess();
                retryChild.stdin?.write(type + '\n', 'utf8');
            }, 500);
        }
    });
}