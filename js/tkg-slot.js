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

  // 各スロットの停止状態とTKG写真配列のインデックス
  var slot_status = [];

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
    text[0].textContent = win_text[Math.floor(Math.random() * win_text.length)];
    tweet[0].textContent = 'ツイートする';
    tweet[0].setAttribute('href', 'https://twitter.com/intent/tweet?text='+encodeURIComponent('TKGスロットを揃えました！ '+tkgs[slot_status[0].img])+'&url='+encodeURIComponent('http://lab.dskd.jp/tkg-slot/'));
  };

  // そろってない時
  function lose() {
    text[0].textContent = lose_text[Math.floor(Math.random() * lose_text.length)];
    tweet[0].textContent = '';
    tweet[0].setAttribute('href', 'https://twitter.com/intent/tweet?text='+encodeURIComponent('TKGスロットを揃えられませんでした……。 ')+'&url='+encodeURIComponent('http://lab.dskd.jp/tkg-slot/'));
  };

  function status_has_query(key, query) {
    return (slot_status.map(function(status){
      return status[key];
    }).indexOf(query) !== -1) ? true : false;
  }

  // img判定
  function is_same_img() {
    for (var i=0;i<slot_status.length;i++) {
      if (slot_status[0].img !== slot_status[i].img) {
        return false;
      }
    };
    return true;
  };

  // TKGが揃ってるか判定
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

  // TKG_Slot Class
  var TKG_Slot = (function() {

    function TKG_Slot(el, idx) {
      this.idx = idx;
      this.el = el;
      this.timer = null;
      this.status = {
        pause: true,
        img: null
      };
    };

    // 初期化
    TKG_Slot.prototype.init = function() {
      var self = this;
      // バインディング
      self.attachClick();
      // 初期表示
      self.setStartImg();
      // 判定ステータスに初期データを反映
      // self.setStatus();
      // メッセージエリアを表示
      msg[0].classList.remove('hide');
    };

    // clickイベントのバインディング
    TKG_Slot.prototype.attachClick = function() {
      var self = this;
      self.el.addEventListener('click', self.switch.bind(self), false);
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
      self.status.pause = false;
      self.timer = setInterval(function(){
        self.changeTKG(self.el);
      }, 10);
      self.status.started = true;
      self.setStatus();
      judgement();
    };

    // slotを停止する
    TKG_Slot.prototype.stop = function() {
      var self = this;
      self.status.pause = true;
      clearInterval(self.timer);
      self.setStatus();
      judgement();
    };

    // slot開始か停止かの振り分け
    TKG_Slot.prototype.switch = function() {
      var self = this;
      (self.status.pause) ? self.start() : self.stop();
    };

    // 初期化
    TKG_Slot.prototype.setStatus = function() {
      var self = this;
      slot_status[self.idx] = self.status;
    };

    return TKG_Slot;
  })();

  // 実行
  function app() {
    for (var i=0;i<reel.length;i++) {
      slot_status[i] = {
        pause: false,
        img: null,
        started: false
      };

      var tkg_slot = new TKG_Slot(reel[i], i);
      tkg_slot.init();
    };
  }
})();