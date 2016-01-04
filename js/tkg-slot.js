(function() {
  'use strict';

  // element
  var loading = document.querySelectorAll('.loading');
  var percentage = document.querySelectorAll('.percentage');
  var reel = document.querySelectorAll('.reel');
  var msg = document.querySelectorAll('.slot__msg');
  var text = document.querySelectorAll('.msg-text');
  var tweet = document.querySelectorAll('.tweet-link');

  var winText = ['うわぁそろってる……すごいね……','今日はかなりついてるね！','乙。','ﾔｯﾀｰ！ さぁTKGを食べよう！'];
  var loseText = ['はい残念〜','おしい！','ﾝﾝｰwww','まだそろえられないの？','そろうまでやろうね！'];

  // 各スロットのコレクション
  var slotCollection = [];

  // タッチデバイスかどうかでバインドするイベント名を変える
  var toggleEv = 'click';
  if(typeof document.ontouchstart !== 'undefined') {
    toggleEv = 'touchend';
  }

  // ゼロパディング
  var zeroPadding = function(number, length){
     return (Array(length).join('0') + number).slice(-length);
  };

  // TKG写真パスの配列
  var tkgs = (function(){
    var arr = []
    for(var i=1;i<=121;i++) {
      arr.push('http://lab.dskd.jp/tkg-slot/img/'+zeroPadding(i,3)+'.jpg')
    }
    return arr;
  })();



  // プリロード
  var preload = new createjs.LoadQueue(false);

  preload.addEventListener('progress', function(e) {
    updateProgress(e.loaded);
  }, false);
  preload.addEventListener('complete', function(e) {
    hideLoding();
    app();
  }, false);

  // ローディング進捗表示
  function updateProgress(per) {
    percentage[0].textContent = Math.floor(per * 100) + '%';
  }

  // ローディング画面を隠す
  function hideLoding() {
    loading[0].addEventListener('transitionend', function(){
      loading[0].classList.add('hide');
    }, false)

    loading[0].classList.add('fadeOut');
  }

  // プリロード実行
  preload.loadManifest(tkgs);


  // どれか回してる時
  function rolling() {
    text[0].textContent = 'そろうかな〜？';
    tweet[0].textContent = '';
    tweet[0].setAttribute('href', '#')
  }

  // そろった時
  function win() {
    var msg = 'TKGスロットをそろえました！そろえるまでに'+getTotalChangeCount()+'回トライしました！';
    text[0].textContent = winText[Math.floor(Math.random() * winText.length)];
    tweet[0].textContent = '喜びのツイートをする';
    tweet[0].setAttribute('href', 'https://twitter.com/intent/tweet?text='+encodeURIComponent(msg+tkgs[slotCollection[0].status.img])+'&url='+encodeURIComponent('http://lab.dskd.jp/tkg-slot/'));

    resetAllChangeCount();
  }

  // そろってない時
  function lose() {
    var msg = 'TKGスロットを'+getTotalChangeCount()+'回トライしたけどそろえられませんでした……。';
    text[0].textContent = loseText[Math.floor(Math.random() * loseText.length)];
    tweet[0].textContent = '悲しみのツイートをする';
    tweet[0].setAttribute('href', 'https://twitter.com/intent/tweet?text='+encodeURIComponent(msg)+'&url='+encodeURIComponent('http://lab.dskd.jp/tkg-slot/'));
  }

  // インスタンス分のステータスのキーに指定した値があるか調べる
  function statusHasQuery(key, query) {
    return (slotCollection.map(function(slot){
      return slot.status[key];
    }).indexOf(query) !== -1) ? true : false;
  }

  // 写真の一致判定
  function isSameImg() {
    for (var i=0;i<slotCollection.length;i++) {
      if (slotCollection[0].status.img !== slotCollection[i].status.img) {
        return false;
      }
    }
    return true;
  }

  // TKGがそろってるか判定
  function judgement() {
    // 全てスタート済みでなかったらreturn
    if ( statusHasQuery('started', false) ) {
      return;
    }

    // 停止してない写真があるか
    if ( statusHasQuery('pause', false) ) {
      rolling();
      return;
    }

    // 画像が同じか
    if ( isSameImg() ) {
      win();
    } else {
      lose();
    }
  }

  // スロット回した数を取得
  function getTotalChangeCount() {
    var total = 0;
    for (var i=0;i<slotCollection.length;i++) {
      total += slotCollection[i].status.changed;
    }
    return total;
  }

  // スロットが揃ったらクリックカウントを0にもどす
  function resetAllChangeCount() {
    for (var i=0;i<slotCollection.length;i++) {
      slotCollection[i].resetChangeCount();
    }
  }

  // TkgSlot Class
  var TkgSlot = (function() {

    function TkgSlot(el, idx) {
      this.idx = idx;
      this.el = el;
      this.timer = null;
      this.status = {
        pause: null,
        img: null,
        started: null,
        changed: null
      };
    }

    // 初期化
    TkgSlot.prototype.init = function() {
      var self = this;
      // ステータスを初期化
      self.status.pause = true;
      self.status.started = false;
      self.status.changed = 0;
      // バインディング
      self.attachClick();
      // 初期表示
      self.setStartImg();
      // メッセージエリアを表示
      msg[0].classList.remove('hide');
    };

    // clickイベントのバインディング
    TkgSlot.prototype.attachClick = function() {
      var self = this;
      self.el.addEventListener(toggleEv, self.switch.bind(self), false);
    };

    // 「クリックしてSTART!」画像を表示する
    TkgSlot.prototype.setStartImg = function() {
      var self = this;
      self.el.setAttribute('style', 'background-image: url("http://lab.dskd.jp/tkg-slot/img/start.png")');
    };

    // background-imageでTKG写真をランダムに指定する
    TkgSlot.prototype.changeTKG = function() {
      var self = this;
      self.status.img = Math.floor(Math.random() * tkgs.length);
      self.el.setAttribute('style', 'background-image: url("'+tkgs[self.status.img]+'")');
    };

    // slotを開始する
    TkgSlot.prototype.start = function() {
      var self = this;
      self.timer = setInterval(function(){
        self.changeTKG(self.el);
      }, 10);
      if (!self.status.started) self.setStarted();
      self.setPause(false);
      self.updateStatus();
      judgement();
    };

    // slotを停止する
    TkgSlot.prototype.stop = function() {
      var self = this;
      clearInterval(self.timer);
      self.setPause(true);
      self.addChangeCount();
      self.updateStatus();
      judgement();
    };

    // slot開始か停止かの振り分け
    TkgSlot.prototype.switch = function() {
      var self = this;
      (self.status.pause) ? self.start() : self.stop();
    };

    // pauseをトグルする
    TkgSlot.prototype.setStarted = function() {
      var self = this;
      self.status.started = true;
    };

    // pauseをトグルする
    TkgSlot.prototype.setPause = function(value) {
      var self = this;
      self.status.pause = value;
    };

    // カウント数を増加する
    TkgSlot.prototype.addChangeCount = function() {
      var self = this;
      self.status.changed++;
    };

    // カウント数を増加する
    TkgSlot.prototype.resetChangeCount = function() {
      var self = this;
      self.status.changed = 0;
    };

    // ステータスの更新
    TkgSlot.prototype.updateStatus = function() {
      var self = this;
      slotCollection[self.idx].status = self.status;
    };

    return TkgSlot;
  })();

  // 実行
  function app() {
    for (var i=0;i<reel.length;i++) {
      var tkgSlot = new TkgSlot(reel[i], i);

      // インスタンスを初期化
      tkgSlot.init();

      // インスタンスをコレクションに追加
      slotCollection[i] = tkgSlot;
    }
  }
})();
