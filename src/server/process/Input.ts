import { ChildProcess } from "child_process";
/**
 * 
 * @param input 接受参数
 * @param func 获取子进程的回调
 */
export function useExternalforSingle(input:string,func:()=>ChildProcess,encode:BufferEncoding='utf8'){
    const p = func();
        // 直接写入命令 + 换行（子进程应循环读取 stdin）
    if (p.stdin && !p.stdin.destroyed) {
        const success = p.stdin.write(input + '\n', encode);
        if (!success) {console.warn('stdin 缓冲区满，稍后会自动发送');}
    } else {
        console.error('子进程 stdin 不可用，可能已关闭');
        // 尝试重启
        setTimeout(() => {
            const retryChild = func();
            retryChild.stdin?.write(input + '\n',encode);
        }, 500);
    }
}
