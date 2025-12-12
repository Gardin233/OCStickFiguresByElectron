/*
 * With ref from
 *     Main code: https://stackoverflow.com/questions/4892491/how-to-get-names-of-the-icons-on-desktop
 *     Printing issues: https://blog.csdn.net/qq_42679415/article/details/147113191
 */
#include <windows.h>
#include <shlobj.h>
#include <atlbase.h>
#include <locale.h>

// Class to help with object destruction
// https://devblogs.microsoft.com/oldnewthing/20040520-00/?p=39243
class CCoInitialize {
public:
    CCoInitialize() : m_hr(CoInitialize(NULL)) { 
    
    }
    
    ~CCoInitialize() { 
        if (SUCCEEDED(m_hr)) {
            CoUninitialize();
        }
    }
    
    operator HRESULT() const { 
        return m_hr; 
    }
    
    HRESULT m_hr;
};


// Get shell view for the desktop
// https://devblogs.microsoft.com/oldnewthing/20130318-00/?p=4933
void FindDesktopFolderView(REFIID riid, void** ppv) {
    CComPtr<IShellWindows> spShellWindows;
    spShellWindows.CoCreateInstance(CLSID_ShellWindows);

    CComVariant vtLoc(CSIDL_DESKTOP);
    CComVariant vtEmpty;
    long lhwnd;
    CComPtr<IDispatch> spdisp;
    spShellWindows->FindWindowSW(
        &vtLoc, &vtEmpty,
        SWC_DESKTOP, &lhwnd, SWFO_NEEDDISPATCH, &spdisp);

    CComPtr<IShellBrowser> spBrowser;
    CComQIPtr<IServiceProvider>(spdisp)->
        QueryService(SID_STopLevelBrowser,
            IID_PPV_ARGS(&spBrowser));

    CComPtr<IShellView> spView;
    spBrowser->QueryActiveShellView(&spView);

    spView->QueryInterface(riid, ppv);
}

int main() {
    // Fix text print
    setlocale(LC_CTYPE, "");
    
	// Get FolderView of Desktop
    CCoInitialize init;
    CComPtr<IFolderView> spView;
    FindDesktopFolderView(IID_PPV_ARGS(&spView));
    CComPtr<IShellFolder> spFolder;
    spView->GetFolder(IID_PPV_ARGS(&spFolder));

	// Enumerate child windows (icons)
    CComPtr<IEnumIDList> spEnum;
    spView->Items(SVGIO_ALLVIEW, IID_PPV_ARGS(&spEnum));

	// Check if there are any icons present in Desktop
	int nItemCount = 0;
	spView->ItemCount(SVGIO_ALLVIEW, &nItemCount);
	printf("%d\n", nItemCount);
	if (nItemCount < 1) {
		return 0;
	}

    // Iterate through desktop icons
    for (CComHeapPtr<ITEMID_CHILD> spidl;
        spEnum->Next(1, &spidl, nullptr) == S_OK;
        spidl.Free()) {
        STRRET str;
        STRRET str2;
        spFolder->GetDisplayNameOf(spidl, SHGDN_NORMAL, &str);
        //spFolder->GetDisplayNameOf(spidl, SHGDN_FORADDRESSBAR, &str);
        spFolder->GetDisplayNameOf(spidl, SHGDN_FORPARSING, &str2);
        CComHeapPtr<wchar_t> spszName;
        CComHeapPtr<wchar_t> spszName2;
        StrRetToStr(&str, spidl, &spszName);
        StrRetToStr(&str2, spidl, &spszName2);
        POINT pt;
        spView->GetItemPosition(spidl, &pt);
        printf("%d %d\n", pt.x, pt.y);
        printf("%ls\n", spszName);
        printf("%ls\n", spszName2);
    }
    return 0;
}
