export class Reel {
  constructor({ $Difficulty, $Reel }) {
    this.id = 0;
    this.isStopped = true;
    this.intervalId = null;
    this.speed = [100, 50, 10];
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
    // 0-100 で引き当てるので 20 で割って 6 段階に変える
    return Number(this.$Difficulty.value / 20);
  }

  get interval() {
    // 2 段階ずつにするため 2 で割って 0,1,2 の添字を得る
    return this.speed[Math.floor(this.difficulty / 2)];
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
        ? // ランダムの場合は 0〜length-1 までの添字を得る
          Math.floor(Math.random() * this.length)
        : // 目押しの場合は　id が length 未満のうちは id にインクリメントし、以上になったら 0 の添字を得る
        this.id < this.length
        ? this.id++
        : 0
    ];
  }

  attachEvent() {
    this.$Stop.addEventListener("click", () => this.handleClickStop(), false);
  }

  handleClickStart() {
    this.isStopped = false;
    !this.isRandom && this.role(1);
    this.intervalId = setInterval(() => this.role(), this.interval);
    this.$Stop.toggleAttribute("disabled", false);
  }

  handleClickStop() {
    this.isStopped = true;
    clearInterval(this.intervalId);
    this.$Stop.toggleAttribute("disabled", true);
    this.$Reel.dispatchEvent(new Event("stop"));
  }

  role(value) {
    const old = this.classString;
    this.id =
      Object.prototype.toString.call(value) === "[object Number]"
        ? value
        : this.newId;
    this.$Text.textContent = this.id;
    this.$Pict.classList.replace(old, this.classString);
  }
}
