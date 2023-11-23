import { Slot } from "./Slot";

document.addEventListener("DOMContentLoaded", () => {
  const $Reels = document.querySelectorAll(".Reel");
  const $Start = document.querySelector(".Start");
  const $Succeed = document.querySelector(".Succeed");
  const $Failed = document.querySelector(".Failed");
  const $Post = document.querySelectorAll(".Post");
  const $Retry = document.querySelector(".Retry");
  $Retry.addEventListener("click", () => slot.reset(), false);
  const slot = new Slot($Reels, $Start, $Succeed, $Failed, $Post, $Retry);
});
