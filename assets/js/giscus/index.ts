import { giscus as giscusParams } from "@params";
import LocalStorage from "js/local-storage";

class Giscus {
  constructor() {
    this.theme = giscusParams.theme;
  }

  run() {
    if (!this.theme) {
      document.addEventListener("hbs:mode", this.handleModeChange);
      setTimeout(this.handleModeChange, 2000);
    }
  }

  handleModeChange = (e) => {
    const mode = e && e.detail && e.detail.mode;
    const theme = this.getTheme(mode || LocalStorage.getItem("mode"));
    this.rerender(theme);
  };

  getTheme(mode) {
    if (mode === "auto") {
      mode = ModeToggle.getPreferredMode();
    }
    return mode === "dark" ? "dark" : "light";
  }

  rerender(theme) {
    const iframe = document.querySelector<HTMLIFrameElement>(
      "iframe.giscus-frame"
    );
    if (!iframe) {
      return;
    }
    iframe.contentWindow.postMessage(
      {
        giscus: {
          setConfig: {
            theme: "https://giscus.app/themes/" + theme + ".css",
          },
        },
      },
      "https://giscus.app"
    );
  }
}

function initializeGiscus() {
  const giscus = new Giscus();
  giscus.run();
}

document.addEventListener("DOMContentLoaded", initializeGiscus);