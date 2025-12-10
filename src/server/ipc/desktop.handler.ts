import { execFile } from "child_process";
import { ipcMain } from "electron";
import path from "path";

export function setupDesktopHandler(){
      ipcMain.on('open-desktop-icon',(event,name)=>{
        console.log("主进程已接收双击请求")
        console.log(name)
        // exe 路径
        const exePath = path.join(process.cwd(), "external", "openDesktopIcon.exe");
        // 启动子进程
        const child = execFile(exePath, (err, stdout, stderr) => {
        if (err) {
          console.error("执行失败:", err);
          return;
        }
        if (stdout) console.log("输出:", stdout);
        if (stderr) console.error("错误输出:", stderr);
      });  
      // let fixedName = name.replace(/ - 快捷方式$/, "");
      console.log(name)
      child.stdin.setDefaultEncoding('utf16le'); // 关键！
      child.stdin.write(name + "\n");
    
        
      })
}