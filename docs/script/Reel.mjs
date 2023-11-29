export class Reel {
  constructor({ $Difficulty, $Reel }) {
    this.id = 0;
    this.intervalId = null;
    this.isStopped = true;
    this.amount = [120, 8];
    this.items = Array.from(
      { length: this.amount[0] },
      (_, index) => index + 1
    );
    this.$Difficulty = $Difficulty;
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
      this.isOrdered
        ? this.id < this.amount[+this.isEasy]
          ? this.id++
          : 0
        : Math.floor(Math.random() * this.amount[+this.isEasy])
    ];
  }

  attachEvent() {
    this.$Stop.addEventListener("click", () => this.handleClickStop(), false);
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
      this.isEasy ? 100 : 10
    );
  }

  handleClickStop() {
    clearInterval(this.intervalId);
    this.isStopped = true;
    this.$Stop.toggleAttribute("disabled", true);
    this.$Reel.dispatchEvent(new Event("stop"));
  }
}
