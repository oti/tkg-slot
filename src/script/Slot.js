import { Reel } from "./Reel";

export class Slot {
  constructor($Reels, $Start, $Succeed, $Failed, $Post, $Retry) {
    this.count = 0;
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
    this.$Reels = $Reels;
    this.$Start = $Start;
    this.$Succeed = $Succeed;
    this.$Failed = $Failed;
    this.$Post = $Post;
    this.$Retry = $Retry;
    this.ReelInstances = Array.from(this.$Reels, (value) => new Reel(value));

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
      reel.addEventListener("stopreel", () => this.handleStopReel(), false)
    );

    this.$Post.addEventListener("click", () => this.handleClickPost(), false);
  }

  handleClickStart() {
    this.countUp();
    this.toggleStartState(true);
    this.toggleAttribute(this.$Start, "disabled", true);
    this.toggleAttribute(this.$Retry, "hidden", false);
    this.ReelInstances.forEach((reel) => reel.start());
  }

  handleClickPost() {
    const intent = "https://x.com/intent/tweet";
    const url = "https://oti.github.io/tkg-slot/";
    const text = `${this.count}${encodeURIComponent(
      "回目でTKGスロットを揃えました！"
    )}`;
    window.open(`${intent}?url=${url}&text=${text}`, "_blank");
  }

  handleStopReel() {
    if (this.isAllStopped) {
      this.toggleAttribute(this.$Succeed, "hidden", !this.isArranged);
      this.toggleAttribute(this.$Failed, "hidden", this.isArranged);
    }
  }

  toggleStartState(value) {
    this.isStarted = value;
  }

  countUp() {
    this.count = this.count + 1;
  }

  toggleAttribute($target, attribute, add) {
    if (add) {
      $target.setAttribute(attribute, "");
    } else {
      $target.removeAttribute(attribute);
    }
  }

  reset() {
    this.ReelInstances.forEach((reel) => reel.stop(), false);
    this.toggleStartState(false);
    this.toggleAttribute(this.$Start, "disabled", false);
    this.toggleAttribute(this.$Succeed, "hidden", true);
    this.toggleAttribute(this.$Failed, "hidden", true);
    this.toggleAttribute(this.$Retry, "hidden", true);
    this.$Start.focus();
  }
}
