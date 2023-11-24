export class Reel {
  constructor({ $Reel, $Level, $Mode }) {
    this.id = 0;
    this.intervalId = null;
    this.isStopped = true;
    this.isDefaultLevel = true;
    this.isRandom = true;
    this.items = Array.from({ length: 120 }, (_, index) => index + 1);
    this.$Level = $Level;
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
        ? Math.floor(
            Math.random() * (this.isDefaultLevel ? this.items.length : 8)
          )
        : this.id < (this.isDefaultLevel ? this.items.length : 8)
        ? this.id++
        : 0
    ];
  }

  attachEvent() {
    this.$Stop.addEventListener("click", () => this.handleClickStop(), false);

    this.$Level.addEventListener(
      "change",
      ({ target: { checked } }) => (this.isDefaultLevel = !checked),
      false
    );

    this.$Mode.addEventListener(
      "change",
      ({ target: { checked } }) => (this.isRandom = !checked),
      false
    );
  }

  handleClickStart() {
    this.isStopped = false;
    this.$Stop.toggleAttribute("disabled", false);
    this.intervalId = window.setInterval(
      () => {
        const old = this.classString;
        this.id = this.newId;
        this.$Text.textContent = this.id;
        this.$Pict.classList.replace(old, this.classString);
      },
      this.isDefaultLevel ? 10 : 100
    );
  }

  handleClickStop() {
    clearInterval(this.intervalId);
    this.isStopped = true;
    this.$Stop.toggleAttribute("disabled", true);
    this.$Reel.dispatchEvent(new Event("stop"));
  }
}