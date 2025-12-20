import path from "path";
import Audic from "audic";

interface AudioData {
    volume?: number;
    loop?: boolean;
    fadeIn?: number;
    startTime?: number;
    speed?: number;
}

export class AudioManager {
    private bgms: Map<string, Audic> = new Map();
    private sfxs: Map<string, Audic[]> = new Map(); // SFX 可以同时多实例播放
    // ------------------- 注册音频 -------------------
    loadBGMFiles(files: { id: string; url: string }[]) {
        for (const file of files) {
            const audioPath = file.url;
            console.log(audioPath)
            const audic = new Audic(audioPath);
            this.bgms.set(file.id, audic);
        }
        console.log("BGM 注册完成:", files.map(f => f.id));
    }

    loadSFXFiles(files: { id: string; url: string }[]) {
        for (const file of files) {
            const audioPath =  file.url;
            // SFX 初始化空数组，每次播放 new 一个实例
            this.sfxs.set(file.id, []);
        }
        console.log("SFX 注册完成:", files.map(f => f.id));
    }

    // ------------------- 卸载音频 -------------------
    unloadBGM(id: string) {
        const bgm = this.bgms.get(id);
        if (bgm) {
            bgm.destroy();
            this.bgms.delete(id);
        }
    }
    unloadSFX(id: string) {
        const arr = this.sfxs.get(id);
        if (arr) {
            for (const sfx of arr) sfx.destroy();
            this.sfxs.delete(id);
        }
    }

    // ------------------- 播放 -------------------
    async playBGM(id: string, data: AudioData = {}) {
        const bgm = this.bgms.get(id);
        if (!bgm) return;
        bgm.volume = data.volume ?? 1;
        bgm.loop = data.loop ?? true;
        if (data.startTime) bgm.currentTime = data.startTime;
        console.log('播放')
        await bgm.play();
        // 可选淡入
        if (data.fadeIn) {
            bgm.volume = 0;
            const step = (data.volume ?? 1) / (data.fadeIn * 60);
            let v = 0;
            const interval = setInterval(() => {
                v += step;
                if (v >= (data.volume ?? 1)) {
                    bgm.volume = data.volume ?? 1;
                    clearInterval(interval);
                } else {
                    bgm.volume = v;
                }
            }, 1000 / 60);
        }
    }

    async playSFX(id: string, data: AudioData = {}) {
        const arr = this.sfxs.get(id);
        if (!arr) return;

        const audioPath = path.join(process.cwd(), id); // 如果你想用 id 映射文件，需要自己存路径
        const sfx = new Audic(audioPath);
        sfx.volume = data.volume ?? 1;
        sfx.loop = data.loop ?? false;
        if (data.startTime) sfx.currentTime = data.startTime;
        arr.push(sfx);
  

        await sfx.play();

        // 可选淡入
        if (data.fadeIn) {
            sfx.volume = 0;
            const step = (data.volume ?? 1) / (data.fadeIn * 60);
            let v = 0;
            const interval = setInterval(() => {
                v += step;
                if (v >= (data.volume ?? 1)) {
                    sfx.volume = data.volume ?? 1;
                    clearInterval(interval);
                } else {
                    sfx.volume = v;
                }
            }, 1000 / 60);
        }
    }
}
