import { Reel } from "./Reel.mjs";

export class Slot {
  constructor($Cabinet) {
    this.mercyCount = 9;
    this.count = [1, 1, 1, 1];
    this.isStarted = false;
    this.intent = "https://x.com/intent/tweet";
    this.url = "https://oti.github.io/tkg-slot/";
    this.prefixMessage = [
      "イージーモードかつ目押しモードで",
      "イージーモードで",
      "目押しモードで",
      "",
    ];
    this.succeedMessage = encodeURIComponent(
      "回目でTKGスロットを揃えました！🥳🤗🤩"
    );
    this.failedMessage = encodeURIComponent(
      "回やってもTKGスロットを揃えられませんでした😧😮‍💨😓"
    );
    this.hashtags = encodeURIComponent("TKGスロット");
    this.via = "otiext";
    this.$Cabinet = $Cabinet;
    this.$Concentrated = $Cabinet.querySelector(".Concentrated");
    this.$Difficulty = $Cabinet.querySelector(".Difficulty");
    this.$Start = $Cabinet.querySelector(".Start");
    this.$Reels = $Cabinet.querySelectorAll(".Reel");
    this.$Shuffling = $Cabinet.querySelector(".Shuffling");
    this.$Succeed = $Cabinet.querySelector(".Succeed");
    this.$Failed = $Cabinet.querySelector(".Failed");
    this.$Post = $Cabinet.querySelectorAll(".Post");
    this.$Retry = $Cabinet.querySelector(".Retry");
    this.$Waiting = $Cabinet.querySelector(".Waiting");
    this.ReelInstances = Array.from(
      this.$Reels,
      ($Reel) => new Reel({ $Reel, ...this })
    );

    this.attachEvent();
  }

  get isArranged() {
    return (
      this.isStarted &&
      this.isAllStopped &&
      this.ReelInstances.every(({ id }) => id === this.ReelInstances[0].id)
    );
  }

  get isAllStopped() {
    return this.ReelInstances.every(({ isStopped }) => isStopped);
  }

  get isWaiting() {
    const reels = this.ReelInstances.filter(({ isStopped }) => isStopped);
    return (
      this.isStarted &&
      !this.isAllStopped &&
      reels.length === 2 &&
      reels.every(({ id }) => id === this.ReelInstances[0].id)
    );
  }

  get difficulty() {
    return Number(this.$Difficulty.value / 20);
  }

  attachEvent() {
    this.$Concentrated.addEventListener(
      "change",
      () => this.handleChangeConcentrated(),
      false
    );

    [this.$Easy, this.$Ordered].forEach((input) => {
      input.addEventListener("change", () => this.updateCountText(), false);
    });

    this.$Start.addEventListener("click", () => this.handleClickStart(), false);

    this.$Reels.forEach((reel) =>
      reel.addEventListener("stop", () => this.handleStopReel(), false)
    );

    this.$Post.forEach((button) =>
      button.addEventListener("click", () => this.handleClickPost(), false)
    );

    this.$Retry.addEventListener("click", () => this.handleClickRetry(), false);
  }

  updateCountValue(isArranged) {
    this.count[this.difficulty] = isArranged
      ? 1
      : this.count[this.difficulty] + 1;
  }

  updateCountText() {
    this.$Start.textContent = `スタート（${this.count[this.mode]} 回目）`;
  }

  handleChangeConcentrated() {
    document.body.classList.toggle("-concentrated", this.$Concentrated.checked);
  }

  handleClickPost() {
    const text = this.isArranged ? this.succeedMessage : this.failedMessage;
    const count = this.count[this.mode];
    const prefix = this.prefixMessage[this.mode];
    window.open(
      `${this.intent}?url=${this.url}&text=${prefix}${count}${text}&hashtags=${this.hashtags}`,
      "_blank"
    );
  }

  handleClickStart() {
    this.isStarted = true;
    this.$Cabinet.scrollIntoView();
    this.ReelInstances.forEach((reel) => reel.handleClickStart());
    this.$Concentrated.toggleAttribute("disabled", true);
    this.$Difficulty.toggleAttribute("disabled", true);
    this.$Start.toggleAttribute("disabled", true);
    this.$Shuffling.toggleAttribute("hidden", false);
    this.$Waiting.toggleAttribute("hidden", true);
    this.$Retry.toggleAttribute("hidden", false);
  }

  handleClickRetry() {
    this.isStarted = false;
    this.ReelInstances.forEach((reel) => reel.handleClickStop());
    this.$Concentrated.toggleAttribute("disabled", false);
    this.$Difficulty.toggleAttribute("disabled", false);
    this.$Start.toggleAttribute("disabled", false);
    this.$Succeed.toggleAttribute("hidden", true);
    this.$Failed.toggleAttribute("hidden", true);
    this.$Retry.toggleAttribute("hidden", true);
    this.updateCountValue(this.isArranged);
    this.updateCountText();
    this.$Start.focus();
  }

  handleStopReel() {
    if (this.isWaiting) {
      this.$Shuffling.toggleAttribute("hidden", true);
      this.$Waiting.toggleAttribute("hidden", false);
    }
    if (this.isAllStopped) {
      this.$Shuffling.toggleAttribute("hidden", true);
      this.$Waiting.toggleAttribute("hidden", true);
      this.$Succeed.toggleAttribute("hidden", !this.isArranged);
      this.$Failed.toggleAttribute("hidden", this.isArranged);
      this.$Failed
        .querySelector(".Post")
        .toggleAttribute(
          "hidden",
          !(!this.isArranged && this.count[this.difficulty] > this.mercyCount)
        );
    }
  }
}
