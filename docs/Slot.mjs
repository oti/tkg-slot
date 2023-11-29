import { Reel } from "./Reel.mjs";

export class Slot {
  constructor($Cabinet) {
    this.mercyCount = 9;
    this.count = Array(6).fill(1);
    this.isStarted = false;
    this.amount = [8, 50, 120];
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
    this.$Cabinet = $Cabinet;
    this.$Concentrated = $Cabinet.querySelector(".Concentrated");
    this.$Difficulty = $Cabinet.querySelector(".Difficulty");
    this.$DifficultyText = $Cabinet.querySelector(".DifficultyText");
    this.$Start = $Cabinet.querySelector(".Start");
    this.$Reels = $Cabinet.querySelectorAll(".Reel");
    this.$Shuffling = $Cabinet.querySelector(".Shuffling");
    this.$Succeed = $Cabinet.querySelector(".Succeed");
    this.$Failed = $Cabinet.querySelector(".Failed");
    this.$Post = $Cabinet.querySelectorAll(".Post");
    this.$Retry = $Cabinet.querySelector(".Retry");
    this.$Waiting = $Cabinet.querySelector(".Waiting");
    this.ReelInstances = Array.from(
      this.$Reels,
      ($Reel) => new Reel({ $Reel, ...this })
    );

    this.attachEvent();
  }

  get isArranged() {
    // スタート済みで、全てのリールを止めていて、かつ id が全て同じ場合に true を返す
    return (
      this.isStarted &&
      this.isAllStopped &&
      this.ReelInstances.every(({ id }) => id === this.ReelInstances[0].id)
    );
  }

  get isAllStopped() {
    return this.ReelInstances.every(({ isStopped }) => isStopped);
  }

  get isWaiting() {
    // スタート済みで、止めたリールが2つで、かつ同じ id の場合に true を返す
    const reels = this.ReelInstances.filter(({ isStopped }) => isStopped);
    return (
      this.isStarted &&
      !this.isAllStopped &&
      reels.length === 2 &&
      reels.every(({ id }) => id === this.ReelInstances[0].id)
    );
  }

  get difficulty() {
    // 0-100 で引き当てるので 20 で割って 6 段階に変える
    return Number(this.$Difficulty.value / 20);
  }

  get difficultyMessage() {
    // 難易度が 0-1 のときは 8、 2-3 のときは 50, 4-5 のときは 120 を引き当てる
    const length = this.amount[Math.floor(this.difficulty / 2)];
    // 難易度が 1 3 5 のときはランダムシャッフルとする
    const shuffle = this.difficulty % 2 ? "ランダム" : "目押し";
    return `${length}枚${shuffle}`;
  }

  attachEvent() {
    this.$Concentrated.addEventListener(
      "input",
      () => this.handleInputConcentrated(),
      false
    );

    this.$Difficulty.addEventListener(
      "input",
      () => this.handleInputDifficulty(),
      false
    );

    this.$Start.addEventListener("click", () => this.handleClickStart(), false);

    this.$Reels.forEach((reel) =>
      reel.addEventListener("stop", () => this.handleStopReel(), false)
    );

    this.$Post.forEach((button) =>
      button.addEventListener("click", () => this.handleClickPost(), false)
    );

    this.$Retry.addEventListener("click", () => this.handleClickRetry(), false);
  }

  updateCountValue(isArranged) {
    // 揃っている場合はカウントを 1 に戻す
    this.count[this.difficulty] = isArranged
      ? 1
      : this.count[this.difficulty] + 1;
  }

  updateCountText() {
    this.$Start.textContent = `スタート（${this.count[this.difficulty]} 回目）`;
  }

  updateDifficultyText() {
    this.$DifficultyText.textContent = this.difficultyMessage;
  }

  handleClickPost() {
    const {
      count,
      difficulty,
      difficultyMessage,
      failedMessage,
      isArranged,
      intent,
      succeedMessage,
      url,
      hashtags,
    } = this;
    const p = isArranged ? "の" : "を";
    const c = count[difficulty];
    const t = isArranged ? succeedMessage : failedMessage;
    window.open(
      `${intent}?url=${url}&text=${difficultyMessage}${p}${c}${t}&hashtags=${hashtags}`,
      "_blank"
    );
  }

  handleClickStart() {
    this.isStarted = true;
    this.$Cabinet.scrollIntoView();
    this.ReelInstances.forEach((reel) => reel.handleClickStart());
    this.$Concentrated.toggleAttribute("disabled", true);
    this.$Difficulty.toggleAttribute("disabled", true);
    this.$Start.toggleAttribute("disabled", true);
    this.$Shuffling.toggleAttribute("hidden", false);
    this.$Waiting.toggleAttribute("hidden", true);
    this.$Retry.toggleAttribute("hidden", false);
  }

  handleClickRetry() {
    this.isStarted = false;
    this.ReelInstances.forEach((reel) => reel.handleClickStop());
    this.$Concentrated.toggleAttribute("disabled", false);
    this.$Difficulty.toggleAttribute("disabled", false);
    this.$Start.toggleAttribute("disabled", false);
    this.$Succeed.toggleAttribute("hidden", true);
    this.$Failed.toggleAttribute("hidden", true);
    this.$Retry.toggleAttribute("hidden", true);
    this.updateCountValue(this.isArranged);
    this.updateCountText();
    this.updateDifficultyText();
    this.$Start.focus();
  }

  handleInputDifficulty() {
    this.updateCountText();
    this.updateDifficultyText();
  }

  handleInputConcentrated() {
    document.body.classList.toggle("-concentrated", this.$Concentrated.checked);
  }

  handleStopReel() {
    if (this.isWaiting) {
      this.$Shuffling.toggleAttribute("hidden", true);
      this.$Waiting.toggleAttribute("hidden", false);
    }
    if (this.isAllStopped) {
      this.$Shuffling.toggleAttribute("hidden", true);
      this.$Waiting.toggleAttribute("hidden", true);
      this.$Succeed.toggleAttribute("hidden", !this.isArranged);
      this.$Failed.toggleAttribute("hidden", this.isArranged);
      this.$Failed
        .querySelector(".Post")
        .toggleAttribute(
          "hidden",
          !(!this.isArranged && this.count[this.difficulty] > this.mercyCount)
        );
    }
  }
}
