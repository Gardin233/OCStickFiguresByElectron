export interface WindowCreateOptions {                  // 可选，用户自定义标识（便于管理）
  width: number;               // 默认值可内部设置
  height: number;
  x: number;
  y: number;
  title: string;
  frame?: boolean;              // 是否有边框
  transparent?: boolean;        // 窗口透明
  skipTaskbar?: boolean;        // 跳过任务栏
  fullscreen?: boolean;
  resizable?: boolean;
}