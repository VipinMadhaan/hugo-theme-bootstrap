import * as params from "@params";
import { default as LocalStorage } from "js/local-storage";
import ModeToggle from "js/mode";

class Giscus {
  run() {
    const theme = params.giscus.theme;
    if (!theme) {
      document.addEventListener("hbs:mode", (e: CustomEvent) => {
        this.rerender(this.getTheme(e.detail.mode));
      });
      setTimeout(() => {
        this.rerender(this.getTheme(LocalStorage.getItem("mode")));
      }, 3000);
    }
  }

  getTheme(mode) {
    if (mode === "auto") {
      mode = ModeToggle.getPreferredMode();
    }
    return mode === "dark" ? 'dark_protanopia' : 'light_protanopia'
  }

  rerender(theme) {
    const iframe = document.querySelector<HTMLIFrameElement>(
      "iframe.giscus-frame"
    );
    if (!iframe || !iframe.contentWindow) {
      return;
    }

    iframe.contentWindow.postMessage(
      {
        giscus: {
          setConfig: {
            theme: theme ,
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
