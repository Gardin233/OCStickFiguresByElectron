#include "windows.h"
#include "resource.h"
#include "strsafe.h"
#include <magnification.h>
#include<stdio.h>
//状态

void SetColorState(SCREEN_STATE state);

int main() {
    // 初始化本进程的放大功能
    if (MagInitialize()) {
        SCREEN_STATE state = IDLE; // 默认状态

        // 在命令行获取输入
        char input[64];

        while (1) {
            //printf("请输入命令 (IDLE, OPPOSITE, HIGHCONTRAST,GRAYSCALE, EXIT): ");
            fgets(input, sizeof(input), stdin); // 获取命令输入

            // 移除输入的换行符
            input[strcspn(input, "\n")] = 0;

            // 根据输入选择不同的状态
            if (strcmp(input, "IDLE") == 0) {
                state = IDLE;
            }else if (strcmp(input, "OPPOSITE") == 0) {
                state = OPPOSITE;
            }else if (strcmp(input, "GRAYSCALE") == 0) {
                state = GRAY_SCALE;
            }else if (strcmp(input, "EXIT") == 0) {
                break; // 退出循环
            }else if (strcmp(input, "HIGHCONTRAST") == 0) {
                state = HIGH_CONTRAST;
            }else {
                printf("无效命令，请重新输入。\n");
                continue; // 继续循环
            }

            // 设置颜色状态
            SetColorState(state);
        }

        MagUninitialize(); // 退出时反初始化
    }
    else {
        printf("初始化失败。\n");
    }

    return 0;
}
