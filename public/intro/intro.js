/* One intro per document opening, including restored back/forward pages. */
(() => {
  const assetBase = new URL(".", document.currentScript.src);
  const CONFIG = Object.freeze({
    playbackRate: 2,
    stallTimeoutMs: 4000,
    maximumDurationMs: 18000,
    reducedMotionDurationMs: 600,
    exitDurationMs: 250,
  });
  let active = false;

  function startIntro() {
    if (active || typeof HTMLDialogElement === "undefined") return;
    active = true;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const previousFocus = document.activeElement;
    const previousOverflow = document.documentElement.style.overflow;
    const dialog = document.createElement("dialog");
    dialog.className = "brand-intro";
    dialog.setAttribute("aria-label", "Abertura TykaYurt");

    const logo = document.createElement("img");
    logo.className = "brand-intro-logo";
    logo.src = new URL("logo.webp", assetBase).href;
    logo.alt = "TykaYurt";
    logo.width = logo.height = 112;
    dialog.append(logo);

    const skip = document.createElement("button");
    skip.className = "brand-intro-skip";
    skip.type = "button";
    skip.textContent = "Pular abertura";
    dialog.append(skip);

    let video;
    let closing = false;
    let waitTimer;
    let maximumTimer;
    let closeTimer;

    function cleanup() {
      clearTimeout(waitTimer);
      clearTimeout(maximumTimer);
      clearTimeout(closeTimer);
      video?.pause();
      if (video) {
        video.removeAttribute("src");
        video.load();
      }
      document.documentElement.style.overflow = previousOverflow;
      dialog.close();
      dialog.remove();
      reducedMotion.removeEventListener("change", onMotionChange);
      window.removeEventListener("pagehide", onPageHide);
      active = false;
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected)
        previousFocus.focus({ preventScroll: true });
    }

    function finish(immediate = false) {
      if (closing) return;
      closing = true;
      clearTimeout(waitTimer);
      clearTimeout(maximumTimer);
      video?.pause();
      if (immediate || reducedMotion.matches) {
        cleanup();
        return;
      }
      dialog.classList.add("is-closing");
      closeTimer = setTimeout(cleanup, CONFIG.exitDurationMs);
    }
    function onMotionChange() {
      if (reducedMotion.matches) finish(true);
    }
    function onPageHide() {
      closing = true;
      cleanup();
    }

    skip.addEventListener("click", () => finish());
    dialog.addEventListener("cancel", (event) => {
      event.preventDefault();
      finish();
    });
    reducedMotion.addEventListener("change", onMotionChange);
    window.addEventListener("pagehide", onPageHide);
    document.body.append(dialog);
    document.documentElement.style.overflow = "hidden";
    dialog.showModal();
    skip.focus({ preventScroll: true });

    if (reducedMotion.matches) {
      waitTimer = setTimeout(() => finish(true), CONFIG.reducedMotionDurationMs);
      return;
    }

    video = document.createElement("video");
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.autoplay = true;
    video.loop = false;
    video.defaultPlaybackRate = CONFIG.playbackRate;
    video.playbackRate = CONFIG.playbackRate;
    video.preload = "auto";
    video.setAttribute("aria-hidden", "true");
    video.setAttribute("disablepictureinpicture", "");
    video.addEventListener("playing", () => {
      clearTimeout(waitTimer);
      dialog.classList.add("is-playing");
    });
    video.addEventListener("waiting", () => {
      clearTimeout(waitTimer);
      waitTimer = setTimeout(() => finish(), CONFIG.stallTimeoutMs);
    });
    video.addEventListener("ended", () => finish());
    video.addEventListener("error", () => finish());
    video.src = new URL("logo-reveal.mp4", assetBase).href;
    dialog.prepend(video);
    waitTimer = setTimeout(() => finish(), CONFIG.stallTimeoutMs);
    maximumTimer = setTimeout(() => finish(), CONFIG.maximumDurationMs);
    video.play()?.catch(() => finish());
  }

  startIntro();
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) startIntro();
  });
})();
