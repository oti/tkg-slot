import { Reel } from "./Reel";

export class Slot {
  constructor($Reels, $Start, $Post, $Textarea, $Share, $Failed) {
    this.isStarted = false;
    this.$Reels = $Reels;
    this.$Start = $Start;
    this.$Post = $Post;
    this.$Textarea = $Textarea;
    this.$Share = $Share;
    this.$Failed = $Failed;
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
  }

  handleClickStart() {
    this.setStartState(true);
    this.toggleAttribute(this.$Start, "disabled", true);
    this.ReelInstances.forEach((reel) => reel.start());
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

  toggleAttribute($target, attribute, add) {
    if (add) {
      $target.setAttribute(attribute, "");
    } else {
      $target.removeAttribute(attribute);
    }
  }

  reset() {
    this.setStartState(false);
    this.toggleAttribute(this.$Start, "disabled", false);
    this.toggleAttribute(this.$Post, "hidden", true);
    this.toggleAttribute(this.$Failed, "hidden", true);
    this.$Start.focus();
  }
}
