// カードクラス
class Card {
  //クラス呼び出し時に実行される初期化関数
  //初期設定したいものを入れておくと便利？
  //引数は数値型で指定する
  //suitNum:スート指定用(0~3)
  //cardNum: トランプの数値指定用(1~13)
  constructor(suitNum, cardNum) {
    let suitList = [
      '♠',//スペード
      '♥',//ハート
      '♦',//ダイヤ
      '♣',//クラブ
    ];
    //「.suitNum」:suitListで部屋を指定する数値(0~3)
    this.suitNum = suitNum;
    //「.suit」:カードに表示されるスート
    this.suit = suitList[suitNum];
    //「.num」:実際に使用される数字(内部数値)
    this.num = cardNum;

    //1→A,11→J,12→Q,13→Kに表示用数値を変更
    //1→Aは内部数値も14に変更
    switch (cardNum) {
      case 1:
        //「.cardNum」:カードに表示される数値
        this.cardNum = 'A';
        this.num = 14;
        break;
      case 11:
        this.cardNum = 'J';
        break;
      case 12:
        this.cardNum = 'Q';
        break;
      case 13:
        this.cardNum = 'K';
        break;
      default:
        this.cardNum = cardNum;
        break;
    }
  }

  //カードの情報(数値、マークetc)をHTML記述形式で返す
  getCode() {
    //idは「スート番号」_「カード番号」で付ける
    //例)♠4なら「0_4」 ♣Aなら「3_14」
    let code = '<div id="' + this.suitNum + '_' + this.num + '" class="Card">';
    code += '<div class="Card_content">';

    code += '<span class="Card_suitNum' + this.suitNum + '">'
      + this.suit + this.cardNum + '</span>';

    code += '</div>\n';
    code += '</div>\n';
    return code;
  }

  //カードのidを取得
  getCardId() {
    return this.suitNum + '_' + this.num;
  }

}

// カードデッキクラス
class Deck {
  constructor() {
    this.deck = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 1; j <= 13; j++) {
        this.deck.push(new Card(i, j));
      }
    }
  }

  //デッキをシャッフルする
  shuffle() {
    console.log('\n shuffle関数実行できた');
    //Fisher–Yates shuffleアルゴリズム
    for (let i = this.deck.length - 1; i >= 0; i--) {
      //0~51のランダムな数値を作成し、randNumに代入(数値の重複はある)
      let randNum = Math.floor(Math.random() * (i + 1));
      //分割代入、変数の入れ替え
      //this.deck[i], this.deck[randNum]の要素を入れ替える
      [this.deck[i], this.deck[randNum]] = [this.deck[randNum], this.deck[i]];
    }
  }

  //デッキからカードをドロー
  drawCard() {
    console.log('drawCard関数実行できた');
    //デッキの先頭配列を削除し、変数drawに代入
    let draw = this.deck.shift();
    console.log('ドローカード！');
    //引いたカード(デッキの元先頭配列)を返す
    return draw;
  }

  //現在のデッキ配列の長さ(デッキの残り枚数)を返す
  getDeckLength() {
    console.log('getDeckLength関数実行できた');
    return this.deck.length;
  }

  //デッキのカードを全部表示
  allCardDisp() {
    console.log('allCardDisp関数実行できた');
    let code = '';
    //デッキの枚数だけ、以下の処理を繰り返す
    for (let i = 0; i < this.getDeckLength(); i++) {
      //ドローしたカードのHTML記述文をcodeに代入
      code += this.deck[i].getCode();
    }
    //表示領域にカードを表示
    document.getElementById('disp').innerHTML = code;
  }

}

// プレイヤーorディーラー用クラス
class Player {
  #hand;
  #code;
  #player;
  // 引数で「プレイヤー」または「ディーラー」を指定
  constructor(player) {
    this.#hand = [];
    this.#player = player;
  }

  //引数に指定したデッキからカードを引き、プレイヤーのhandプロパティに加える
  drawHand(deck) {
    console.log('\n drawHand関数実行できた');
    this.#hand.push(deck.drawCard());
  }

  //引いたカード(ハンド)を公開
  handDisp() {
    //表示内容の初期化
    document.getElementById(`${this.#player}Display`).innerHTML = '';

    this.#code = '';
    //配列this.#handに入っているカードオブジェクトのgetCode()を実行
    //HTML記述形式のカード情報をthis.#codeに格納。ハンドが複数あれば繰り返す
    this.#hand.forEach(element => {
      this.#code += element.getCode();
    });
    document.getElementById(`${this.#player}Display`).innerHTML += this.#code;
  }

  //現在の引いたカード(ハンド)の情報を取得
  getHand() {
    return this.#hand;
  }

  //現在のハンドをリセット
  resetHand() {
    this.#hand = [];
  }

  // カードを裏側で表示
  turnCard() {
    //表示内容の初期化
    document.getElementById(`${this.#player}Display`).innerHTML = '';

    this.#code = '<div class="Card">';
    this.#code += '<div class="Card_content turnOver">';

    this.#code += '<span>dummy</span>';

    this.#code += '</div>\n';
    this.#code += '</div>\n';
    document.getElementById(`${this.#player}Display`).innerHTML += this.#code;
  }

}


// ゲーム進行用クラス
class Master {
  #deck = new Deck;
  #dealer = new Player('dealer');
  #player = new Player('player');
  #clickCount = 0;
  #playerCount = 0;
  #dealerCount = 0;
  #text = '';
  #highLowBtn = [];
  constructor() {
    this.#deck.shuffle();
  }

  //ゲームのセットアップ
  initGame() {
    console.log('\n initGame関数実行できた');
    // 初回の勝負のみ実行
    if (this.#clickCount === 0) {
      //id:gameBtn部分にボタン「HIGH」「LOW」を表示
      this.setHighLowBtn();
    }

    // 初回以外の勝負のみ実行
    if (this.#clickCount !== 0) {
      this.toggleHighLowBtn()
    }

    //勝負ボタンのON/OFF
    this.toggleStartBtn();
    //勝負回数の表示
    this.count();

    //ディーラーがカードを一枚引く
    this.#dealer.drawHand(this.#deck);
    //ディーラーのハンド(全1枚)を公開
    this.#dealer.handDisp();

    //プレイヤーがカードを一枚引く
    this.#player.drawHand(this.#deck);
    //プレイヤー表示領域にカードの裏側を表示
    this.#player.turnCard();

    //勝敗結果表示部分の初期化
    document.getElementById('result').innerHTML = '結果';
    document.getElementById('result').style.color = 'black';
  }

  //HIGH/LOWボタンの作成
  setHighLowBtn() {
    let code = '';
    code += '<input type="button" class="highLow_btn" value = "HIGH"'
    code += 'onclick = "judge(1)" > '
    code += '<input type="button" class="highLow_btn" value="LOW"'
    code += 'onclick = "judge(0)" > '
    document.getElementById('gameBtn').innerHTML = code;
  }

  //勝負ボタンのON/OFF
  toggleStartBtn() {
    //勝負ボタンに(半透明化用)クラス「disable」を付与
    document.getElementById('start_btn').classList.toggle("disable");

    //勝負ボタンがクリック可なら不可に、不可なら可にする
    // document.getElementById('start_btn').disabled = true;
    let x = document.getElementById('start_btn').disabled ? false : true;
    document.getElementById('start_btn').disabled = x;
  }
  //勝負ボタンのOFF
  offStartBtn() {
    // 勝負ボタンをクリック不可に
    document.getElementById('start_btn').disabled = true;
    //勝負ボタンに(半透明化用)クラス「disable」を付与
    document.getElementById('start_btn').classList.add("disable");
  }

  //HIGH/LOWボタンのON/OFF
  toggleHighLowBtn() {
    this.#highLowBtn = document.getElementsByClassName('highLow_btn');

    //HIGH/LOWボタンに(半透明化用)クラス「disable」を付与
    this.#highLowBtn[0].classList.toggle("disable");
    this.#highLowBtn[1].classList.toggle("disable");
  }

  //HIGH/LOWボタンのOFF
  offHighLowBtn() {
    this.#highLowBtn = document.getElementsByClassName('highLow_btn');
    // HIGH/LOWをクリック不可に
    this.#highLowBtn[0].disabled = true;
    this.#highLowBtn[1].disabled = true;

    //HIGH/LOWボタンに(半透明化用)クラス「disable」を付与
    this.#highLowBtn[0].classList.add("disable");
    this.#highLowBtn[1].classList.add("disable");
  }
  //勝負回数表示用変数
  count() {
    console.log('\n count関数実行できた');
    this.#clickCount++;

    // 勝負が五回目以降なら最後の勝負と表示
    this.#text = this.#clickCount >= 5 ?
      '最後の勝負' : this.#clickCount + '回目の勝負';

    document.getElementById('count').innerHTML = this.#text;
  }

  // 勝敗判定用
  // 引数HighLowNumは1ならHIGH,0ならLOW
  gameJudge(HighLowNum) {
    console.log('\n gameJudge関数実行できた');
    //プレイヤーのハンド(全1枚)を公開
    this.#player.handDisp();

    // 両者の場に出ているカード情報を取得
    //変数「player/dealer HandNum」にそれぞれの現在の手札1枚の数値を格納
    let playerHandNum = this.#player.getHand()[0].num
    let dealerHandNum = this.#dealer.getHand()[0].num

    // 結果部分に勝敗を表示
    document.getElementById('result').innerHTML =
      this.judgeResult(playerHandNum, dealerHandNum, HighLowNum);

    // 勝敗に応じて勝利回数の表示を更新
    let wordPlayer = 'プレイヤーの勝利回数' + this.#playerCount;
    let wordDealer = 'ディーラーの勝利回数' + this.#dealerCount;
    document.getElementsByClassName('player')[0].innerHTML = wordPlayer;
    document.getElementsByClassName('dealer')[0].innerHTML = wordDealer;

    //勝負ボタンのON/OFF
    this.toggleStartBtn();

    //HIGH/LOWボタンのON/OFF
    this.toggleHighLowBtn();

    // 手札のリセット
    this.#player.resetHand();
    this.#dealer.resetHand();

    // ゲーム終了を判断し、処理を行う
    this.gameEnd();
  }

  // player/dealerのカード数字とhigh/lowどっちのボタンを押したかを
  // 引数に渡すと勝敗の文字列を返すjudgeResult関数
  judgeResult(playerHandNum, dealerHandNum, HighLowNum) {
    //「HIGHボタン」を押したとき(HighLowNum=1)
    let result = '結果を代入する変数';
    if (HighLowNum) {
      console.log('HIGHボタンを押した!');
      if (playerHandNum > dealerHandNum) {
        result = 'WIN';
        this.#playerCount++;
      } else if (playerHandNum === dealerHandNum) {
        result = 'DRAW';
      } else {
        result = 'LOSE';
        this.#dealerCount++;
      }
    }
    //「LOWボタン」を押したとき(HighLowNum=0)
    else {
      console.log('LOWボタンを押した!');
      if (playerHandNum < dealerHandNum) {
        result = 'WIN';
        this.#playerCount++;
      } else if (playerHandNum === dealerHandNum) {
        result = 'DRAW';
      } else {
        result = 'LOSE';
        this.#dealerCount++;
      }
    }

    // 「WIN」「DRAW」「LOSE」の色付け
    if (result === 'WIN') {
      document.getElementById('result').style.color = 'red';
    } else if (result === 'DRAW') {
      document.getElementById('result').style.color = 'green';
    } else if (result === 'LOSE') {
      document.getElementById('result').style.color = 'blue';
    }



    return result;
  }

  // ゲームが終了かどうかを判断するgameEnd関数
  gameEnd() {
    if (this.#playerCount === 3) {
      this.offHighLowBtn();
      this.offStartBtn();
      document.getElementById('result').innerHTML = 'おめでとう！あなたの勝ち';
      document.getElementById('result').style.color = 'red';
    } else if (this.#dealerCount === 3) {
      this.offHighLowBtn();
      this.offStartBtn();
      document.getElementById('result').innerHTML = '残念！あなたの負け';
      document.getElementById('result').style.color = 'blue';
    }
  }

}

////////////////////////////////////////////////////////
let master = new Master;
//勝負するボタン押下時の関数
function start() {
  console.log('\n start関数実行できた');
  //ゲームのセットアップ
  master.initGame();
}

// High,Lowボタン押下時の関数
function judge(HighLow) {
  master.gameJudge(HighLow);
}
