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
    this.$Stop = this.$Reel.querySelector(".Stop");
    this.$Text = this.$Reel.querySelector("span");

    this.$Stop.toggleAttribute("disabled", true);
    this.attachEvent();
  }

  get classString() {
    return `-tkg${String(this.id).padStart(3, "0")}`;
  }

  get newId() {
    return this.items[
      this.isRandom
        ? Math.floor(Math.random() * this.items.length)
        : this.id < this.items.length
        ? this.id++
        : 0
    ];
  }

  attachEvent() {
    this.$Stop.addEventListener("click", () => this.handleClickStop(), false);

    this.$Mode.addEventListener(
      "change",
      ({ target: { checked } }) => (this.isRandom = !checked),
      false
    );
  }

  handleClickStart() {
    this.isShuffling = true;
    this.$Stop.toggleAttribute("disabled", false);
    this.intervalId = window.setInterval(
      () => {
        const old = this.classString;
        this.id = this.newId;
        this.$Text.textContent = this.id;
        this.$Pict.classList.replace(old, this.classString);
      },
      this.isRandom ? 50 : 75
    );
  }

  handleClickStop() {
    clearInterval(this.intervalId);
    this.isShuffling = false;
    this.$Stop.toggleAttribute("disabled", true);
    this.$Reel.dispatchEvent(new Event("stop"));
  }
}
