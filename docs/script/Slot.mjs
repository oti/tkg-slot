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
    this.$Easy = $Cabinet.querySelector(".Easy");
    this.$Ordered = $Cabinet.querySelector(".Ordered");
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

  get mode() {
    const {
      $Easy: { checked: isEasy },
      $Ordered: { checked: isOrdered },
    } = this;
    return isEasy && isOrdered ? 0 : isEasy ? 1 : isOrdered ? 2 : 3;
  }

  attachEvent() {
    [this.$Easy, this.$Ordered].forEach((input) => {
      input.addEventListener("change", () => this.updateCountText(), false);
    });

    this.$Start.addEventListener("click", () => this.handleClickStart(), false);

    this.$Reels.forEach((reel) =>
      reel.addEventListener("stop", () => this.handleEmitStop(), false)
    );

    this.$Post.forEach((button) =>
      button.addEventListener("click", () => this.handleClickPost(), false)
    );

    this.$Retry.addEventListener("click", () => this.handleClickRetry(), false);
  }

  updateCountValue(value) {
    this.count[this.mode] =
      Object.prototype.toString.call(value) === "[object Number]"
        ? value
        : this.count[this.mode] + 1;
  }

  updateCountText() {
    this.$Start.textContent = `スタート（${this.count[this.mode]} 回目）`;
  }

  handleEmitStop() {
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
          !(!this.isArranged && this.count > this.mercyCount)
        );
    }
  }

  handleClickPost() {
    const {
      count,
      intent,
      url,
      succeedMessage,
      failedMessage,
      hashtags,
      isArranged,
    } = this;
    const text = isArranged ? succeedMessage : failedMessage;
    const prefix = this.prefixMessage[this.mode];
    window.open(
      `${intent}?url=${url}&text=${prefix}${count}${text}&hashtags=${hashtags}`,
      "_blank"
    );
  }

  handleClickStart() {
    this.$Cabinet.scrollIntoView();
    this.ReelInstances.forEach((reel) => reel.handleClickStart());
    this.isStarted = true;
    this.$Easy.toggleAttribute("disabled", true);
    this.$Ordered.toggleAttribute("disabled", true);
    this.$Start.toggleAttribute("disabled", true);
    this.$Shuffling.toggleAttribute("hidden", false);
    this.$Waiting.toggleAttribute("hidden", true);
    this.$Retry.toggleAttribute("hidden", false);
  }

  handleClickRetry() {
    this.ReelInstances.forEach((reel) => reel.handleClickStop());
    this.isStarted = false;
    this.$Easy.toggleAttribute("disabled", false);
    this.$Ordered.toggleAttribute("disabled", false);
    this.$Start.toggleAttribute("disabled", false);
    this.$Succeed.toggleAttribute("hidden", true);
    this.$Failed.toggleAttribute("hidden", true);
    this.$Retry.toggleAttribute("hidden", true);
    this.updateCounter();
    this.updateCountText();
    this.$Start.focus();
  }
}
