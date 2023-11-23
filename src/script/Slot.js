import { Reel } from "./Reel";

export class Slot {
  constructor($Reels, $Start, $Post, $Failed, $Retry) {
    this.count = 0;
    this.isStarted = false;
    this.$Reels = $Reels;
    this.$Start = $Start;
    this.$Post = $Post;
    this.$Failed = $Failed;
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
    this.setStartState(true);
    this.countUp();
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
      this.toggleAttribute(this.$Post, "hidden", !this.isArranged);
      this.toggleAttribute(this.$Failed, "hidden", this.isArranged);
    }
  }

  setStartState(value) {
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
    this.setStartState(false);
    this.ReelInstances.forEach((reel) => reel.stop(), false);
    this.toggleAttribute(this.$Start, "disabled", false);
    this.toggleAttribute(this.$Post, "hidden", true);
    this.toggleAttribute(this.$Failed, "hidden", true);
    this.toggleAttribute(this.$Retry, "hidden", true);
    this.$Start.focus();
  }
}
