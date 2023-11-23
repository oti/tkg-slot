import { Reel } from "./Reel";

export class Slot {
  constructor({
    $Failed,
    $Mode,
    $Post,
    $Reels,
    $Retry,
    $Shuffling,
    $Start,
    $Succeed,
  }) {
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
    this.$Mode = $Mode;
    this.$Start = $Start;
    this.$Reels = $Reels;
    this.$Shuffling = $Shuffling;
    this.$Succeed = $Succeed;
    this.$Failed = $Failed;
    this.$Post = $Post;
    this.$Retry = $Retry;
    this.ReelInstances = Array.from($Reels, (reel) => new Reel(reel, $Mode));

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
    return this.ReelInstances.every(({ isShuffling }) => !isShuffling);
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

  toggleAttribute($target, attribute, add) {
    if (add) {
      $target.setAttribute(attribute, "");
    } else {
      $target.removeAttribute(attribute);
    }
  }

  toggleStartState(value) {
    this.isStarted = value;
  }

  handleEmitStop() {
    if (this.isAllStopped) {
      this.toggleAttribute(this.$Shuffling, "hidden", true);
      this.toggleAttribute(this.$Succeed, "hidden", !this.isArranged);
      this.toggleAttribute(this.$Failed, "hidden", this.isArranged);
      this.toggleAttribute(
        this.$Failed.querySelector(".Post"),
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
    this.toggleStartState(true);
    this.toggleAttribute(this.$Start, "disabled", true);
    this.toggleAttribute(this.$Shuffling, "hidden", false);
    this.toggleAttribute(this.$Retry, "hidden", false);
    this.ReelInstances.forEach((reel) => reel.handleClickStart());
  }

  handleClickRetry() {
    this.ReelInstances.forEach((reel) => reel.handleClickStop());
    this.toggleStartState(false);
    this.toggleAttribute(this.$Start, "disabled", false);
    this.toggleAttribute(this.$Succeed, "hidden", true);
    this.toggleAttribute(this.$Failed, "hidden", true);
    this.toggleAttribute(this.$Retry, "hidden", true);
    this.counterUpdate();
    this.$Start.focus();
  }
}
