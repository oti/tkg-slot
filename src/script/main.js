import { Slot } from "./Slot";

document.addEventListener("DOMContentLoaded", () => {
  new Slot({
    $Failed: document.querySelector(".Failed"),
    $Mode: document.querySelector(".Mode"),
    $Post: document.querySelectorAll(".Post"),
    $Reels: document.querySelectorAll(".Reel"),
    $Retry: document.querySelector(".Retry"),
    $Shuffling: document.querySelector(".Shuffling"),
    $Start: document.querySelector(".Start"),
    $Succeed: document.querySelector(".Succeed"),
  });
});
