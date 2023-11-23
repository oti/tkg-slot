export class Reel {
  constructor($Reel) {
    this.id = 0;
    this.intervalId = null;
    this.isShuffling = false;
    this.items = Array.from({ length: 120 }, (_, index) => index + 1);
    this.$Reel = $Reel;
    this.$Pict = this.$Reel.querySelector(".Pict");
    this.$Stop = this.$Reel.querySelector(".Button");
    this.$Text = this.$Reel.querySelector("span");

    this.toggleAttribute(this.$Stop, "disabled", true);
    this.attachEvent();
  }

  get classString() {
    return `-tkg${String(this.id).padStart(3, "0")}`;
  }

  attachEvent() {
    this.$Stop.addEventListener("click", () => this.stop(), false);
  }

  start() {
    this.setShuffleState(true);
    this.toggleAttribute(this.$Stop, "disabled", false);
    this.intervalId = window.setInterval(() => {
      const old = this.classString;
      this.id = this.items[Math.floor(Math.random() * this.items.length)];
      this.$Text.textContent = this.id;
      this.$Pict.classList.replace(old, this.classString);
    }, 1);
  }

  stop() {
    clearInterval(this.intervalId);
    this.setShuffleState(false);
    this.toggleAttribute(this.$Stop, "disabled", true);
    this.emit();
  }

  emit() {
    this.$Reel.dispatchEvent(new Event("stopreel"));
  }

  setShuffleState(value) {
    this.isShuffling = value;
  }

  toggleAttribute($target, attribute, add) {
    if (add) {
      $target.setAttribute(attribute, "");
    } else {
      $target.removeAttribute(attribute);
    }
  }
}
