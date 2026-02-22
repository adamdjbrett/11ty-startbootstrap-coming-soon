const video = document.getElementById("bg-video");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const coarsePointer = window.matchMedia("(pointer: coarse)").matches;

if (video && !reduceMotion && !coarsePointer) {
  window.addEventListener(
    "load",
    () => {
      const source = video.querySelector("source[data-src]");
      if (!source) {
        return;
      }

      source.src = source.dataset.src;
      video.load();
      video.play().catch(() => {});
    },
    { once: true }
  );
}
