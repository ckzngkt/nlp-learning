// 学習の入口としての分類。研究分野の排他的な分類ではありません。
const NLP_FIELDS = [
  {
    "name": "ルールベース・言語解析",
    "idea": "ことばの形と構造を捉える",
    "description": "明示的な規則・辞書から入り、単語・品詞・文の構造を知ります。言語解析のタスク自体は統計モデルや深層学習でも解けます。",
    "items": [
      [
        "正規表現",
        "ルール",
        "文字列のパターンで一致箇所を見つけます。日付・記号の検出や簡単な整形に向いています。",
        "例：2026/10/11を「数字4桁 / 2桁 / 2桁」で抽出します。パターン一致だけでは日付の妥当性は保証されません。",
        3,
        "前処理の入口"
      ],
      [
        "形態素解析",
        "解析タスク",
        "文章を形態素などの単位に分け、品詞等の情報を付けます。日本語の単語境界を扱うための基礎です。",
        "例：「猫が好き」→ 猫 / が / 好き。辞書や解析器によって分割は変わります。",
        3,
        "前処理"
      ],
      [
        "品詞タグ付け",
        "解析タスク",
        "各トークンに名詞・動詞などの品詞ラベルを付けます。前後の文脈を使って曖昧さを解きます。",
        "例：「猫が走る」→ 猫=名詞、が=助詞、走る=動詞。HMMやニューラルモデルでも扱えます。",
        null,
        "発展：系列ラベリング"
      ],
      [
        "構文解析",
        "解析タスク",
        "文の句構造や、語同士の係り受けを求めます。誰が何をしたかを捉える手掛かりになります。",
        "例：「猫が魚を食べる」で、猫と魚が「食べる」にどう結び付くかを解析します。",
        null,
        "発展：係り受け・句構造"
      ],
      [
        "辞書・文法ルール",
        "知識・ルール",
        "用語辞書、活用規則、文法など、人が記述した知識を利用します。対象を限定できる場合に有効です。",
        "例：製品名辞書で名称を見つけます。未知の名称や表記揺れには追加の工夫が必要です。",
        3,
        "前処理の関連章"
      ]
    ]
  },
  {
    "name": "統計的自然言語処理",
    "idea": "頻度と確率から規則性をつかむ",
    "description": "コーパス内の出現頻度や共起、確率を利用します。BoWとTF-IDFは文章の表現方法、Naive BayesとHMMは予測に使うモデルです。N-gramは特徴量にも言語モデルにも利用できます。",
    "items": [
      [
        "Bag of Words（BoW）",
        "表現",
        "語の出現回数で文書を表します。語順は捨てますが、軽量で解釈しやすい表現です。",
        "例：「猫 猫 好き」→ 語彙［猫, 犬, 好き］に対して［2, 0, 1］。",
        4,
        "BoWとTF-IDF"
      ],
      [
        "TF-IDF",
        "表現",
        "文書内の頻度と、他の文書での珍しさを組み合わせて語に重みを付けます。",
        "例：多数の文書に出る一般語より、少数の文書に出る専門語を区別の手掛かりにします。",
        4,
        "BoWとTF-IDF"
      ],
      [
        "N-gram",
        "特徴量・モデル",
        "連続するn個のトークンを扱います。特徴量にも使え、言語モデルでは直前のn−1個を条件に次を予測します。",
        "例：bigramなら「猫」の後に「が」が来る確率を、出現回数から推定します。",
        7,
        "系列と言語モデル"
      ],
      [
        "Naive Bayes",
        "分類モデル",
        "クラスを条件とした特徴の独立性を仮定して分類します。単語の頻度を使う文書分類の基本手法です。",
        "例：「無料」「当選」の出現傾向から迷惑メールのクラスを予測します。語が現実に独立だと主張する方法ではありません。",
        null,
        "発展：確率的な文書分類"
      ],
      [
        "隠れマルコフモデル（HMM）",
        "系列モデル",
        "観測できる語の列の背後に、隠れた状態の列を仮定します。状態遷移と観測の確率を利用します。",
        "例：語を観測し、名詞→助詞→動詞といった品詞の状態列を推定します。",
        null,
        "発展：確率的な系列モデル"
      ]
    ]
  },
  {
    "name": "機械学習による自然言語処理",
    "idea": "特徴から予測の境界を学ぶ",
    "description": "ここでは主に従来の教師あり学習をまとめています。統計的NLPとの区分は明確ではなく、深層学習も機械学習の一部です。",
    "items": [
      [
        "テキストの特徴量化",
        "表現・前処理",
        "文章を学習器が使える数値に変換します。語頻度、文字n-gram、長さ、埋め込みなどを利用できます。",
        "例：TF-IDFベクトルを線形分類器の入力にします。表現と予測器を分けて考えます。",
        4,
        "数値表現"
      ],
      [
        "ロジスティック回帰",
        "分類モデル",
        "特徴の重み付き和を確率に変換して分類します。TF-IDFとの組み合わせはよいベースラインになります。",
        "例：「最高」の重みが肯定方向、「退屈」の重みが否定方向に学習されます。",
        5,
        "分類と評価"
      ],
      [
        "SVM",
        "分類モデル",
        "クラスを分ける境界のマージンを大きくするように学習します。線形SVMは高次元のテキスト特徴によく使われます。",
        "例：TF-IDFで表した肯定レビューと否定レビューの間に分類境界を作ります。",
        null,
        "発展：線形分類器"
      ],
      [
        "文書分類・感情分析",
        "応用タスク",
        "文書にカテゴリや感情のラベルを付けます。ルール・統計モデル・ニューラルモデルのどれでも取り組めます。",
        "例：ニュース→スポーツ / 経済、レビュー→肯定 / 否定。手法とは別の「何を解くか」の分類です。",
        5,
        "分類と評価"
      ]
    ]
  },
  {
    "name": "深層学習による自然言語処理",
    "idea": "表現と文脈をデータから学ぶ",
    "description": "ニューラルネットワークによる表現学習から、系列の処理へ進みます。Word2VecやGloVeはよくこの入口で学びますが、どちらも深いネットワークそのものではありません。",
    "items": [
      [
        "Word2Vec",
        "単語表現",
        "周囲の語を予測するなどの学習で、単語ベクトルを得ます。CBOWとSkip-gramが代表的です。",
        "例：「猫」と「犬」が似た文脈に現れることをベクトルの近さへ反映します。基本形は静的な単語表現です。",
        6,
        "単語・文の埋め込み"
      ],
      [
        "GloVe",
        "単語表現",
        "コーパス全体の単語共起統計を利用して単語ベクトルを学びます。基本形は静的な表現です。",
        "例：どの語と共起しやすいかという情報を低次元のベクトルへ写します。Word2Vecとは学習目的が異なります。",
        null,
        "発展：共起からの表現学習"
      ],
      [
        "RNN",
        "系列モデル",
        "前の隠れ状態と現在の入力から次の状態を計算し、系列の履歴を取り込みます。",
        "例：語を1つずつ読み、状態を更新して次の語の確率を出します。",
        7,
        "系列と言語モデル"
      ],
      [
        "LSTM",
        "系列モデル",
        "RNNの一種です。ゲートを使って情報を残す・忘れることを制御し、長期依存の学習を助けます。",
        "例：前に出た情報を必要な位置まで保持します。長期依存の問題を完全に解消するわけではありません。",
        7,
        "系列と言語モデル"
      ],
      [
        "Seq2Seq",
        "構成・枠組み",
        "入力系列を出力系列へ変換する枠組みです。EncoderとDecoderを組み合わせます。",
        "例：日本語の文章→英語の文章。RNNでもTransformerでも実装できます。",
        9,
        "Encoder-decoderの関連章"
      ]
    ]
  },
  {
    "name": "Transformer・LLM",
    "idea": "大きな文脈を使い、応用へつなぐ",
    "description": "Transformerは深層学習の一種です。この枝には、計算機構・モデル系列・学習方法・応用システムが含まれるので、種類も合わせて見てください。",
    "items": [
      [
        "Attention",
        "計算機構",
        "QueryとKeyで重みを求め、その重みでValueを混ぜます。系列の必要な位置から情報を取り込みます。",
        "例：代名詞の表現を作るとき、関連する名詞の位置の情報を取り込みます。RNNと組み合わせることもできます。",
        8,
        "Attention"
      ],
      [
        "Transformer",
        "モデル構造",
        "Attention、位置情報、FFNなどを組み合わせた構造です。Encoder-only、Decoder-only、両者を持つ形態があります。",
        "例：位置ごとの表現をSelf-Attentionで更新し、それを複数層で繰り返します。",
        9,
        "Transformer"
      ],
      [
        "BERT",
        "モデル系列",
        "双方向の文脈を使うEncoder型の代表例です。マスクしたトークンを予測する事前学習を用います。",
        "例：事前学習で得た表現を利用し、分類や固有表現抽出のタスクに合わせて追加学習します。通常の次トークン生成モデルとは学習目的が異なります。",
        9,
        "Encoder型の関連章"
      ],
      [
        "GPT",
        "モデル系列",
        "自己回帰的に次トークンを予測するDecoder型の代表的な系列です。通常は過去の位置を参照して生成します。",
        "例：「猫が」の後に続くトークンを予測し、選んだトークンを足して繰り返します。",
        10,
        "事前学習とLLM"
      ],
      [
        "事前学習・ファインチューニング",
        "学習方法",
        "大規模なデータから共通の表現を学び、必要に応じてタスクや振る舞いに合わせて追加学習します。",
        "例：次トークン予測の事前学習後、指示と応答のデータでSFT（教師ありファインチューニング）を行います。プロンプトの追加とは異なります。",
        10,
        "事前学習とLLM"
      ],
      [
        "埋め込みモデル",
        "表現モデル",
        "単語・文・文書をベクトルに写します。文埋め込みモデルは意味検索やクラスタリングに使えます。",
        "例：「参加費はいくら？」と、料金の説明文との類似度を測ります。Transformer以外の方法でも表現は作れます。",
        6,
        "埋め込みの基礎"
      ],
      [
        "RAG",
        "応用システム",
        "検索した根拠を生成モデルの入力に加えます。検索と回答生成を分けて評価します。",
        "例：社内規程を検索し、その根拠に基づいた回答を作ります。モデル構造そのものの名前ではありません。",
        11,
        "検索とRAG"
      ],
      [
        "LLMの評価・運用",
        "横断領域",
        "正解性・回答と根拠の一致・速度・コストなどを測り、実データでの変化や失敗を管理します。",
        "例：同じ評価セットでモデルやプロンプトを比較し、検索漏れ・誤回答・遅延を別々に分析します。",
        12,
        "実験と評価の入口"
      ]
    ]
  }
];
const NLP_TASKS = [
  [
    "分類・感情分析",
    "文書 → カテゴリ・感情",
    "レビューの肯定 / 否定を分類する",
    "ルール、Naive Bayes、線形分類器、BERTなど",
    5
  ],
  [
    "抽出・系列ラベリング",
    "文章 → 対象の範囲・ラベル",
    "人名・組織名、関係・出来事を取り出す",
    "辞書、HMM、ニューラル系列モデルなど",
    1
  ],
  [
    "構文・意味・談話の解析",
    "文章 → 構造・意味関係",
    "係り受け、誰が何をしたか、代名詞の参照先を求める",
    "文法、統計的解析、ニューラルモデルなど",
    null
  ],
  [
    "情報検索・質問応答",
    "質問 → 文書 / 回答",
    "根拠を探して答える",
    "TF-IDF、密なベクトル表現を使う検索（ベクトル検索）、reranking、RAGなど",
    11
  ],
  [
    "翻訳・要約・文章生成",
    "文章・条件 → 新しい文章",
    "別言語へ訳す、要点を短くまとめる",
    "Seq2Seq、Transformer、LLMなど",
    9
  ],
  [
    "対話・会話システム",
    "会話履歴 → 応答・対話行動",
    "問い合わせに答える、必要事項を聞き返す",
    "ルール、検索、生成、対話管理の組み合わせ",
    10
  ],
  [
    "音声・言語の接続",
    "音声 ↔ 文字列",
    "音声認識・音声合成",
    "音声処理とNLPの接点。音の表現も学ぶ",
    null
  ],
  [
    "多言語・専門分野への適応",
    "言語・分野をまたぐ処理",
    "日本語と英語、一般文と医療文の違いに対応する",
    "翻訳、表現学習、転移学習などを横断する",
    null
  ]
];
function fieldItem(item){const [name,type,desc,example,chapter,label]=item;return `<details class="topic" data-search="${esc(item.join(' ').toLowerCase())}"><summary><span class="topic-name">${name}</span><span class="type-tag">${type}</span><span class="topic-plus" aria-hidden="true">＋</span></summary><div class="topic-body"><p>${desc}</p><p class="topic-example">${example}</p>${chapter?`<a href="#chapter-${chapter}">第${chapter}章 · ${label} →</a>`:`<span class="topic-future">${label} · 現在の12章では詳説していません</span>`}</div></details>`;}
function fieldsPage(){return `<article class="field-page"><p class="eyebrow">EXPLORE THE FIELD / NLP AT A GLANCE</p><h1>NLPの<em>全体像</em></h1><p class="summary">手法の違いと、解く問題の違い。<br>2つの軸で見ると、今どこを学んでいるかがわかります。</p><div class="axis-intro"><div><span>AXIS 01</span><b>どう解くか</b><p>ルール、確率、学習、ニューラルネットワーク。以下の5つの枝で手法を見渡します。</p></div><div><span>AXIS 02</span><b>何を解くか</b><p>分類、抽出、翻訳、検索、対話。1つのタスクを複数の手法で解けます。</p></div></div><div class="note">この5分類は学習の入口としての整理です。統計的NLPと機械学習は重なり、深層学習は機械学習の一部、Transformerは深層学習の一種です。形態素解析や構文解析も、ルールだけで解くとは限りません。</div><div class="map-tools"><label for="field-search">分野・用語を探す<input type="search" id="field-search" placeholder="例：HMM、構文、翻訳"></label><button id="expand-fields">説明をすべて開く</button><button id="collapse-fields">説明をすべて閉じる</button></div><p id="field-status" role="status" aria-live="polite">27項目 · 項目を開くと説明・例・関連章を表示</p><div class="tree-root"><span class="logo">n.</span><div><b>自然言語処理（NLP）</b><small>ことばを処理するための手法と応用</small></div></div><div class="field-tree">${NLP_FIELDS.map((g,i)=>`<section class="field-branch"><div class="branch-header"><span class="branch-number">0${i+1}</span><div><h2>${g.name}</h2><p>${g.idea}</p></div></div><p class="branch-description">${g.description}</p><div class="branch-items">${g.items.map(fieldItem).join('')}</div></section>`).join('')}</div><p class="field-empty" hidden>該当する項目がありません。検索語を変えてください。</p><section class="task-section"><p class="eyebrow">AXIS 02 / WHAT PROBLEM DO WE SOLVE?</p><h2>「何を解くか」で見る分野</h2><p>上の枝が方法の地図なら、こちらは問題の地図です。タスクと手法を1対1に固定しないことがポイントです。</p><div class="task-grid">${NLP_TASKS.map(([name,io,example,methods,chapter])=>`<div class="task-card"><h3>${name}</h3><div class="task-io">${io}</div><p>${example}。</p><small>手法の例：${methods}</small>${chapter?`<a href="#chapter-${chapter}">関連する第${chapter}章 →</a>`:'<span class="topic-future">発展分野 · 現在の12章では詳説していません</span>'}</div>`).join('')}</div></section><section class="guide"><h3>2つの軸をつなぐ例：感情分析</h3><div class="approaches"><div><b>ルール</b>肯定語・否定語の辞書</div><div><b>統計・線形モデル</b>TF-IDF＋分類器</div><div><b>ニューラルモデル</b>文脈表現＋分類器</div></div><p>解く問題は同じです。必要なデータ、表現、計算量、誤りの傾向が変わります。新しい手法が、すべての用途で古い手法を置き換えるわけではありません。</p></section><section class="guide"><h3>この地図から、どう学ぶ？</h3><p><b>最初の一周：</b> 第1〜5章で、前処理・表現・分類・評価をつなげます。</p><p><b>文脈を理解する：</b> 第6〜9章で、埋め込み・系列・Attention・Transformerを学びます。</p><p><b>応用を作る：</b> 第10〜12章で、LLM・RAG・実験をつなげます。</p><p><b>二周目：</b> 地図で気になった品詞タグ付け、構文解析、Naive Bayes、HMMなどを掘り下げます。</p><a class="primary" href="#home">12章の学習マップへ →</a></section><div class="sources"><b>参考：分野ごとの詳細を調べる</b><a href="https://web.stanford.edu/~jurafsky/slp3/" target="_blank" rel="noopener">Speech and Language Processing · 系列ラベリング・構文解析・検索・音声など ↗</a><p>分類と短い説明は、この教材の学習用に独自に整理しています。</p></div></article>`;}
function initFields(){const topics=[...document.querySelectorAll('.topic')];$('#field-search').oninput=()=>{const q=$('#field-search').value.trim().toLowerCase();let count=0;document.querySelectorAll('.field-branch').forEach(branch=>{let visible=0;branch.querySelectorAll('.topic').forEach(t=>{const matches=t.dataset.search.includes(q)||branch.querySelector('h2').textContent.toLowerCase().includes(q);t.hidden=!matches;if(matches){visible++;count++;}});branch.hidden=visible===0;});$('#field-status').textContent=`${count} / 27項目${q?' · 検索結果':' · 項目を開くと説明・例・関連章を表示'}`;$('.field-empty').hidden=count>0;};$('#expand-fields').onclick=()=>topics.filter(t=>!t.hidden).forEach(t=>t.open=true);$('#collapse-fields').onclick=()=>topics.forEach(t=>t.open=false);}
