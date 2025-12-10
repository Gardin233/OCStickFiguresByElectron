#include "resource.h"
#include <magnification.h>
// 初始化颜色效果矩阵，用于应用灰度效果或恢复桌面上的颜色。
MAGCOLOREFFECT g_MagEffectIdentity = { 1.0f,  0.0f,  0.0f,  0.0f,  0.0f, 0.0f,  1.0f,  0.0f,  0.0f,  0.0f, 0.0f,  0.0f,  1.0f,  0.0f,  0.0f, 0.0f,  0.0f,  0.0f,  1.0f,  0.0f, 0.0f,  0.0f,  0.0f,  0.0f,  1.0f };
//反色
MAGCOLOREFFECT g_MagEffectOpposite = { -1.0f, 0.0f, 0.0f, 0.0f, 0.0f,0.0f,-1.0f, 0.0f, 0.0f, 0.0f,0.0f, 0.0f,-1.0f, 0.0f, 0.0f,0.0f, 0.0f, 0.0f, 1.0f, 0.0f,1.0f, 1.0f, 1.0f, 0.0f, 1.0f };
//灰度
MAGCOLOREFFECT g_MagEffectGrayScale = { 0.3f,  0.3f,  0.3f,  0.0f,  0.0f,0.6f,  0.6f,  0.6f,  0.0f,  0.0f,0.1f,  0.1f,  0.1f,  0.0f,  0.0f, 0.0f,  0.0f,  0.0f,  1.0f,  0.0f,0.0f,  0.0f,  0.0f,  0.0f,  1.0f };
//强对比度
MAGCOLOREFFECT g_MagEffectHighContrast = {
    2.0f, 0.0f, 0.0f, 0.0f, 0.0f,  // Red通道
    0.0f, 2.0f, 0.0f, 0.0f, 0.0f,  // Green通道
    0.0f, 0.0f, 2.0f, 0.0f, 0.0f,  // Blue通道
    0.0f, 0.0f, 0.0f, 1.0f, 0.0f,  // Alpha通道
    0.0f, 0.0f, 0.0f, 0.0f, 1.0f   // 无变换
};


void SetColorState(SCREEN_STATE state) {
    PMAGCOLOREFFECT pEffect = &g_MagEffectIdentity;
    switch (state) {
    case IDLE:
        pEffect = &g_MagEffectIdentity;
        break;
    case OPPOSITE:
        pEffect = &g_MagEffectOpposite;  // 应用反色效果
        break;
    case GRAY_SCALE:
        pEffect = &g_MagEffectGrayScale;  // 应用灰度效果
        break;
    case HIGH_CONTRAST:
        pEffect = &g_MagEffectHighContrast;
        break;
    }
    // 设置全屏颜色效果
    MagSetFullscreenColorEffect(pEffect);
}