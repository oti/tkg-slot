import { Slot } from "./Slot";

document.addEventListener("DOMContentLoaded", () => {
  const $Start = document.querySelector(".Start");
  const $Reels = document.querySelectorAll(".Reel");
  const $Shuffling = document.querySelector(".Shuffling");
  const $Succeed = document.querySelector(".Succeed");
  const $Failed = document.querySelector(".Failed");
  const $Post = document.querySelectorAll(".Post");
  const $Retry = document.querySelector(".Retry");
  new Slot($Start, $Reels, $Shuffling, $Succeed, $Failed, $Post, $Retry);
});
