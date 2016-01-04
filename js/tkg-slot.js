(function() {
  'use strict';

  // element
  var loading = document.querySelectorAll('.loading');
  var percentage = document.querySelectorAll('.percentage');
  var reel = document.querySelectorAll('.reel');
  var msg = document.querySelectorAll('.slot__msg');
  var text = document.querySelectorAll('.msg-text');
  var tweet = document.querySelectorAll('.tweet-link');

  var win_text = ['うわぁそろってる……すごいね……','今日はかなりついてるね！','乙。','ﾔｯﾀｰ！ さぁTKGを食べよう！'];
  var lose_text = ['はい残念〜','おしい！','ﾝﾝｰwww','まだそろえられないの？'];

  // 各スロットのコレクション
  var slot_collection = [];

  // タッチデバイスかどうかでバインドするイベント名を変える
  var toggleEv = 'click';
  if(typeof document.ontouchstart !== 'undefined') {
    toggleEv = 'touchend';
  }

  // ゼロパディング
  var zero_padding = function(number, length){
     return (Array(length).join('0') + number).slice(-length);
  };

  // TKG写真パスの配列
  var tkgs = (function(){
    var arr = []
    for(var i=1;i<=121;i++) {
      arr.push('http://lab.dskd.jp/tkg-slot/img/'+zero_padding(i,3)+'.jpg')
    }
    return arr;
  })();



  // プリロード
  var preload = new createjs.LoadQueue(false);

  preload.addEventListener('progress', function(e) {
    update_progress(e.loaded);
  }, false);
  preload.addEventListener('complete', function(e) {
    hide_loding();
    app();
  }, false);

  // ローディング進捗表示
  function update_progress(per) {
    percentage[0].textContent = Math.floor(per * 100) + '%';
  }

  // ローディング画面を隠す
  function hide_loding() {
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
  };

  // そろった時
  function win() {
    var msg = 'TKGスロットをそろえました！そろえるまでに'+getTotalChangeCount()+'回トライしました！';
    text[0].textContent = win_text[Math.floor(Math.random() * win_text.length)];
    tweet[0].textContent = 'ツイートする';
    tweet[0].setAttribute('href', 'https://twitter.com/intent/tweet?text='+encodeURIComponent(msg+tkgs[slot_collection[0].status.img])+'&url='+encodeURIComponent('http://lab.dskd.jp/tkg-slot/'));

    resetAllChangeCount();
  };

  // そろってない時
  function lose() {
    text[0].textContent = lose_text[Math.floor(Math.random() * lose_text.length)];
    tweet[0].textContent = '';
    tweet[0].setAttribute('href', 'https://twitter.com/intent/tweet?text='+encodeURIComponent('TKGスロットをそろえられませんでした……。 ')+'&url='+encodeURIComponent('http://lab.dskd.jp/tkg-slot/'));
  };

  // インスタンス分のステータスのキーに指定した値があるか調べる
  function status_has_query(key, query) {
    return (slot_collection.map(function(slot){
      return slot.status[key];
    }).indexOf(query) !== -1) ? true : false;
  }

  // 写真の一致判定
  function is_same_img() {
    for (var i=0;i<slot_collection.length;i++) {
      if (slot_collection[0].status.img !== slot_collection[i].status.img) {
        return false;
      }
    };
    return true;
  };

  // TKGがそろってるか判定
  function judgement() {
    // 全てスタート済みでなかったらreturn
    if ( status_has_query('started', false) ) {
      return;
    }

    // 停止してない写真があるか
    if ( status_has_query('pause', false) ) {
      rolling();
      return;
    }

    // 画像が同じか
    if ( is_same_img() ) {
      win();
    } else {
      lose();
    }
  };

  // スロット回した数を取得
  function getTotalChangeCount() {
    var total = 0;
    for (var i=0;i<slot_collection.length;i++) {
      total += slot_collection[i].status.changed;
    };
    return total;
  };

  // スロットが揃ったらクリックカウントを0にもどす
  function resetAllChangeCount() {
    for (var i=0;i<slot_collection.length;i++) {
      slot_collection[i].resetChangeCount();
    };
  }

  // TKG_Slot Class
  var TKG_Slot = (function() {

    function TKG_Slot(el, idx) {
      this.idx = idx;
      this.el = el;
      this.timer = null;
      this.status = {
        pause: null,
        img: null,
        started: null,
        changed: null
      };
    };

    // 初期化
    TKG_Slot.prototype.init = function() {
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
    TKG_Slot.prototype.attachClick = function() {
      var self = this;
      self.el.addEventListener(toggleEv, self.switch.bind(self), false);
    };

    // 「クリックしてSTART!」画像を表示する
    TKG_Slot.prototype.setStartImg = function() {
      var self = this;
      self.el.setAttribute('style', 'background-image: url("http://lab.dskd.jp/tkg-slot/img/start.png")');
    };

    // background-imageでTKG写真をランダムに指定する
    TKG_Slot.prototype.changeTKG = function() {
      var self = this;
      self.status.img = Math.floor(Math.random() * tkgs.length);
      self.el.setAttribute('style', 'background-image: url("'+tkgs[self.status.img]+'")');
    };

    // slotを開始する
    TKG_Slot.prototype.start = function() {
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
    TKG_Slot.prototype.stop = function() {
      var self = this;
      clearInterval(self.timer);
      self.setPause(true);
      self.addChangeCount();
      self.updateStatus();
      judgement();
    };

    // slot開始か停止かの振り分け
    TKG_Slot.prototype.switch = function() {
      var self = this;
      (self.status.pause) ? self.start() : self.stop();
    };

    // pauseをトグルする
    TKG_Slot.prototype.setStarted = function() {
      var self = this;
      self.status.started = true;
    };

    // pauseをトグルする
    TKG_Slot.prototype.setPause = function(value) {
      var self = this;
      self.status.pause = value;
    };

    // カウント数を増加する
    TKG_Slot.prototype.addChangeCount = function() {
      var self = this;
      self.status.changed++;
    };

    // カウント数を増加する
    TKG_Slot.prototype.resetChangeCount = function() {
      var self = this;
      self.status.changed = 0;
    };

    // ステータスの更新
    TKG_Slot.prototype.updateStatus = function() {
      var self = this;
      slot_collection[self.idx].status = self.status;
    };

    return TKG_Slot;
  })();

  // 実行
  function app() {
    for (var i=0;i<reel.length;i++) {
      var tkg_slot = new TKG_Slot(reel[i], i);

      // インスタンスを初期化
      tkg_slot.init();

      // インスタンスをコレクションに追加
      slot_collection[i] = tkg_slot;
    };
  }
})();
