import { Slot } from "./Slot";

document.addEventListener("DOMContentLoaded", () => {
  const $Reels = document.querySelectorAll(".Reel");
  const $Start = document.querySelector(".Start");
  const $Post = document.querySelector(".Post");
  const $Failed = document.querySelector(".Failed");
  const $Retry = document.querySelector(".Retry");
  const slot = new Slot($Reels, $Start, $Post, $Failed, $Retry);
  $Retry.addEventListener("click", () => slot.reset(), false);
});
