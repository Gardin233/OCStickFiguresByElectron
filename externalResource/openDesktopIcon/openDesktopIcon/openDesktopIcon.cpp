#include <windows.h>
#include <shlobj.h>
#include <iostream>
#include <string>
#include <fcntl.h>
#include <io.h>

int wmain() {
    // 设置控制台为 UTF-16，保证中文路径不会乱码
    _setmode(_fileno(stdout), _O_U16TEXT);
    _setmode(_fileno(stdin), _O_U16TEXT);

    std::wstring target;
    while (true) {
        std::getline(std::wcin, target);
        if (target.empty()) {
            return 1;
        }
        HINSTANCE result = ShellExecuteW(nullptr, L"open", target.c_str(), nullptr, nullptr, SW_SHOW);
        if ((int)result <= 32) {
            std::wcerr << L"打开失败，错误码: " << (int)result << std::endl;
            return 2;
        }
    }
    return 0;
}
