export class Reel {
  constructor($Reel, $Mode) {
    this.id = 0;
    this.intervalId = null;
    this.isShuffling = false;
    this.items = Array.from({ length: 120 }, (_, index) => index + 1);
    this.isRandom = true;
    this.$Mode = $Mode;
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
    this.$Stop.addEventListener("click", () => this.handleClickStop(), false);

    this.$Mode.addEventListener(
      "change",
      ({ target: { checked } }) => (this.isRandom = !checked),
      false
    );
  }

  emitStop() {
    this.$Reel.dispatchEvent(new Event("stop"));
  }

  toggleAttribute($target, attribute, add) {
    if (add) {
      $target.setAttribute(attribute, "");
    } else {
      $target.removeAttribute(attribute);
    }
  }

  toggleShuffleState(value) {
    this.isShuffling = value;
  }

  handleClickStart() {
    this.toggleShuffleState(true);
    this.toggleAttribute(this.$Stop, "disabled", false);
    this.intervalId = window.setInterval(() => {
      const old = this.classString;
      this.id = this.items[Math.floor(Math.random() * this.items.length)];
      this.$Text.textContent = this.id;
      this.$Pict.classList.replace(old, this.classString);
    }, 1);
  }

  handleClickStop() {
    clearInterval(this.intervalId);
    this.toggleShuffleState(false);
    this.toggleAttribute(this.$Stop, "disabled", true);
    this.emitStop();
  }
}
