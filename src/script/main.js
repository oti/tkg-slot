import { Slot } from "./Slot";

document.addEventListener("DOMContentLoaded", () => {
  const $Reels = document.querySelectorAll(".Reel");
  const $Start = document.querySelector("#Start");
  const $Post = document.querySelector("#Post");
  const $Textarea = document.querySelector("#Textarea");
  const $Share = document.querySelector("#Share");
  const $Failed = document.querySelector("#Failed");

  const slot = new Slot($Reels, $Start, $Post, $Textarea, $Share, $Failed);

  document
    .querySelectorAll(".Retry")
    .forEach((retry) =>
      retry.addEventListener("click", () => slot.reset(), false)
    );
});
