"""Opens the Sengoku map in its own window (Edge WebView2, through pywebview). Built into Sengoku.exe by build.bat."""
import os
import sys

import webview


def here(*parts):
    # inside the exe the files are unpacked to a temp folder (sys._MEIPASS)
    return os.path.join(getattr(sys, "_MEIPASS", os.path.dirname(os.path.abspath(__file__))), *parts)


if __name__ == "__main__":
    webview.create_window("Sengoku 戦国", here("index.html"), width=1440, height=900, min_size=(1000, 680),
                          background_color="#0b1529")
    webview.start(http_server=True)  # served over http so fonts and canvas behave as on the web
