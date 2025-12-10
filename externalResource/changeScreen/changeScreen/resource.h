#pragma once
#ifndef RESOURCE_H
#define RESOURCE_H
#include <magnification.h>

typedef enum {
    IDLE,
    OPPOSITE,
    GRAY_SCALE,
    HIGH_CONTRAST
} SCREEN_STATE;

extern MAGCOLOREFFECT g_MagEffectIdentity;   // 恢复桌面上的颜色
extern MAGCOLOREFFECT g_MagEffectOpposite;   // 反色
extern MAGCOLOREFFECT g_MagEffectGrayScale;  // 灰度效果
extern MAGCOLOREFFECT g_MagEffectHighContrast;

void SetColorState(SCREEN_STATE state);
#endif
