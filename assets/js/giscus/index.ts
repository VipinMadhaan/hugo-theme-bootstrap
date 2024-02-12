import * as params from "@params";
import { default as LocalStorage } from "js/local-storage";
import ModeToggle from "js/mode";

class Giscus {
  run() {
    const theme = params.giscus.theme;
    if (!theme) {
      document.addEventListener("hbs:mode", (e: CustomEvent) => {
        this.handleThemeChange(e.detail.mode);
      });
      setTimeout(() => {
        this.handleThemeChange(LocalStorage.getItem("mode"));
      }, 2000);
    }
  }

  handleThemeChange(mode) {
    if (mode === "auto") {
      mode = ModeToggle.getPreferredMode();
    }
    const theme = mode === "dark" ? "dark" : "light";
    this.updateIframeTheme(theme);
  }

  updateIframeTheme(theme) {
    const iframe = document.querySelector<HTMLIFrameElement>(
      "iframe.giscus-frame"
    );
    if (!iframe) {
      return;
    }
    const themeUrl = "https://giscus.app/themes/" + theme + ".css";
    iframe.contentWindow.postMessage(
      {
        giscus: {
          setConfig: {
            theme: themeUrl,
          },
        },
      },
      "https://giscus.app"
    );
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new Giscus().run();
});