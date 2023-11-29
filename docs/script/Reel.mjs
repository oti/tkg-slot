export class Reel {
  constructor({ $Difficulty, $Reel }) {
    this.id = 0;
    this.isStopped = true;
    this.intervalId = null;
    this.amount = [8, 50, 120];
    this.items = Array.from(
      { length: this.amount[2] },
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

  get difficulty() {
    return Number(this.$Difficulty.value / 20);
  }

  get isRandom() {
    // 難易度が 1 3 5 のときはランダムシャッフルとする
    return this.difficulty % 2;
  }

  get length() {
    // 難易度が 0-1 のときは 8、 2-3 のときは 50, 4-5 のときは 120 を引き当てる
    return this.amount[Math.floor(this.difficulty / 2)];
  }

  get newId() {
    return this.items[
      this.isRandom
        ? Math.floor(Math.random() * this.length)
        : this.id < this.length
        ? this.id++
        : 0
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
