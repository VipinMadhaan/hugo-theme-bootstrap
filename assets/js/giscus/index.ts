import * as params from "@params";
import { LocalStorage } from "js/local-storage";
import ModeToggle from "js/mode";

class Giscus {
  constructor() {
    const theme = params.giscus.theme;
    if (!theme) {
      this.handleModeChange();
    }
  }

  run() {
    this.rerender(this.getPreferredTheme());
  }

  getPreferredTheme() {
    const storedMode = LocalStorage.getItem("mode");
    return ModeToggle.getPreferredMode(storedMode);
  }

  handleModeChange = () => {
    document.addEventListener("hbs:mode", (e) => {
      this.rerender(this.getPreferredTheme(e.detail.mode));
    });

    // Initial rerender based on local storage or system preference
    this.rerender(this.getPreferredTheme());
  };

  rerender(theme) {
    const iframe = document.querySelector("iframe.giscus-frame");
    if (iframe) {
      iframe.contentWindow.postMessage(
        {
          giscus: {
            setConfig: {
              theme: `https://giscus.app/themes/${theme}.css`,
            },
          },
        },
        "https://giscus.app"
      );
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new Giscus().run();
});