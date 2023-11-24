import { Reel } from "./Reel";

export class Slot {
  constructor($Cabinet) {
    this.count = 1;
    this.mercyCount = 9;
    this.isStarted = false;
    this.intent = "https://x.com/intent/tweet";
    this.url = "https://oti.github.io/tkg-slot/";
    this.succeedMessage = encodeURIComponent(
      "回目でTKGスロットを揃えました！🥳🤗🤩"
    );
    this.failedMessage = encodeURIComponent(
      "回やってもTKGスロットを揃えられませんでした😧😮‍💨😓"
    );
    this.hashtags = encodeURIComponent("TKGスロット");
    this.via = "otiext";
    this.$Level = $Cabinet.querySelector(".Level");
    this.$Mode = $Cabinet.querySelector(".Mode");
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
      (reel) => new Reel(reel, this.$Mode)
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

  attachEvent() {
    this.$Start.addEventListener("click", () => this.handleClickStart(), false);

    this.$Reels.forEach((reel) =>
      reel.addEventListener("stop", () => this.handleEmitStop(), false)
    );

    this.$Post.forEach((button) =>
      button.addEventListener("click", () => this.handleClickPost(), false)
    );

    this.$Retry.addEventListener("click", () => this.handleClickRetry(), false);
  }

  counterUpdate() {
    this.count = this.count + 1;
    this.$Start.textContent = `スタート（${this.count} 回目）`;
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
    window.open(
      `${intent}?url=${url}&text=${count}${text}&hashtags=${hashtags}`,
      "_blank"
    );
  }

  handleClickStart() {
    this.ReelInstances.forEach((reel) => reel.handleClickStart());
    this.isStarted = true;
    this.$Mode.toggleAttribute("disabled", true);
    this.$Start.toggleAttribute("disabled", true);
    this.$Shuffling.toggleAttribute("hidden", false);
    this.$Waiting.toggleAttribute("hidden", true);
    this.$Retry.toggleAttribute("hidden", false);
  }

  handleClickRetry() {
    this.ReelInstances.forEach((reel) => reel.handleClickStop());
    this.isStarted = false;
    this.$Mode.toggleAttribute("disabled", false);
    this.$Start.toggleAttribute("disabled", false);
    this.$Succeed.toggleAttribute("hidden", true);
    this.$Failed.toggleAttribute("hidden", true);
    this.$Retry.toggleAttribute("hidden", true);
    this.counterUpdate();
    this.$Start.focus();
  }
}
