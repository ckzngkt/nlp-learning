// BERT supplement: extends chapter 10 without changing chapter IDs or saved progress.
const BERT_LESSON_INDEX=9;
Object.assign(SOURCES,{
 bertPaper:['Devlin et al. · BERT（原論文）','https://aclanthology.org/N19-1423/'],
 bertOriginal:['Google Research · BERT（公式解説・実装）','https://github.com/google-research/bert'],
 bertDocs:['Hugging Face · BERT（入力・出力・タスク別の利用）','https://huggingface.co/docs/transformers/model_doc/bert'],
 sbertPaper:['Reimers & Gurevych · Sentence-BERT','https://arxiv.org/abs/1908.10084']
});

function bertContextView(mode='both',scene='drink'){
 const both=mode==='both';
 const ending=scene==='drink'?'飲んだ':'読んだ';
 const clues=both?`「彼は」と「を ${ending}」の両方`:'左側の「彼は」だけ';
 const candidates=both?(scene==='drink'?'水・お茶など、飲むもの':'本・雑誌など、読むもの'):'水・本・手紙など、多くの候補が残る';
 return `<div class="bert-tokens" aria-label="${both?'前後の文脈を参照':'左の文脈だけを参照'}"><span class="bert-token">彼は<small>参照できる</small></span><span class="bert-token bert-target">［MASK］<small>予測する位置</small></span><span class="bert-token ${both?'':'bert-unavailable'}">を<small>${both?'参照できる':'参照しない'}</small></span><span class="bert-token ${both?'':'bert-unavailable'}">${ending}<small>${both?'参照できる':'参照しない'}</small></span></div><p><b>使える手掛かり：</b>${clues}</p><p><b>人が考える候補：</b>${candidates}</p><p>${both?'後ろを「飲んだ」から「読んだ」へ変えると、空欄に入るものの種類も変わります。前後の文脈を使う意義がここにあります。':'後ろの文を変えても、左側しか参照しないこの比較では手掛かりが増えません。実際のGPT型モデルは、この空欄を埋めるのではなく、接頭辞から次のトークンを予測します。'}</p>`;
}
const BERT_CHECKS=[
 ['BERTの「双方向」が意味するのは？',['前から読んだ後に、逆順で読み直す','各トークンの表現に、前後の文脈を使う','未来の出来事を予言する'],1,'入力内の前後をSelf-Attentionで参照することです。左右へ一語ずつ走査することとは違います。'],
 ['穴埋めの事前学習済みBERTへレビューを入れるだけで、感情分類器になる？',['必ずそのまま肯定・否定を返す','［MASK］を全語に付ければ分類できる','通常は分類用の出力層と、タスクに合わせた学習が必要'],2,'穴埋めと感情分類は出力も学習の正解も違います。分類用に調整済みのモデルを使う方法もあります。'],
 ['普通のBERTの［CLS］ベクトルを、そのまま検索に使うと？',['文の意味の近さが必ず測れるわけではない','全モデルで最適な検索表現になる','単語数しか表せない'],0,'文章の代表として使える位置であることと、類似度検索に適した表現であることは別です。検索向けの文埋め込みモデルなどを検討します。']
];
const bertChecksMarkup=()=>`<div class="bert-checks">${BERT_CHECKS.map(([q,options,answer,why],i)=>`<div class="bert-check" data-bert-q="${i}"><h3>Q${i+1}. ${q}</h3><div class="bert-options">${options.map((x,j)=>`<button type="button" data-bert-answer="${j}">${String.fromCharCode(65+j)}. ${x}</button>`).join('')}</div><p class="bert-feedback" role="status" aria-live="polite">選ぶと説明が表示されます。</p><div class="print-only">正解：${options[answer]}。${why}</div></div>`).join('')}</div>`;

const BERT_SECTIONS=[
 ['BERTとは：文章を文脈付きの表現にする',`<p><b>BERT</b>は、Bidirectional Encoder Representations from Transformersの略です。TransformerのEncoderを積み重ね、文章中の各トークンを、周囲の文脈を反映したベクトルへ変換します。2018年にプレプリントが公開され、2019年に論文として発表されました。</p>${flow(['入力の文章','対応するトークナイザ','BERTのEncoder','トークンごとの文脈表現','タスク用の出力層'])}<p>例えば「眼鏡をかける」と「電話をかける」の「かける」は同じ表記でも、周囲が違えば出力の表現も変わります。第6章で学んだ文脈に応じた埋め込みを、Transformerで作る代表例です。</p>${note('ここでいう「理解」は、分類や抽出などに役立つ表現を学ぶという意味です。人間と同じ理解や、事実の正しさを保証するものではありません。')}`],
 ['双方向と穴埋め学習：前後が手掛かりになる',`<p>「彼は［MASK］を飲んだ」なら、後ろの「飲んだ」が、空欄には飲み物が入りそうだという手掛かりになります。BERTの<b>双方向</b>は、入力の前後を各層で参照することです。前から読んで、逆順に読み直すという意味ではありません。</p><p>正解の語をそのまま見せると写すだけで済むため、事前学習では一部のトークンを隠すなどして、元のトークンを予測する<b>Masked Language Modeling（MLM）</b>を行います。正解は元の文章から作れるので、人が全例へ分類ラベルを付ける必要はありません。</p>${flow(['元の文章<small>彼はお茶を飲んだ</small>','一部を隠す<small>彼は［MASK］を飲んだ</small>','元のトークンを予測','正解と比べて重みを更新'])}<p>「水」も自然に見えても、この訓練例の正解は元の「お茶」です。文としてもっともらしい候補と、学習に用意した正解は区別します。図の日本語の区切りは説明用で、実際のトークン分割とは限りません。</p><details><summary>原版BERTの学習をもう少し知る</summary><p>原版では一部のトークンを予測対象に選びますが、選んだ位置が全部［MASK］になるわけではありません。通常の入力にも対応しやすいよう、別のトークンへの置換や、元のままにする場合も含みます。また、二つの文が元の文章で続いていたかを判定するNext Sentence Prediction（NSP）も使います。派生モデルの学習方法は同じとは限りません。</p></details>`],
 ['実験：後ろの文脈が見えると何が変わる？',`<div class="lab bert-demo"><span class="lab-heading">TRY IT YOURSELF · BERT</span><h3>参照範囲と、文の後半を切り替える</h3><p>これは参照範囲を学ぶ概念デモです。BERTやGPTの推論・Attentionの重み・確率は計算していません。</p><label for="bert-mode">参照する文脈</label><select id="bert-mode" data-bert-mode><option value="both">BERT型：前後の文脈</option><option value="left">左の文脈のみ（参照範囲の比較）</option></select><label for="bert-scene">文の後半</label><select id="bert-scene" data-bert-scene><option value="drink">を飲んだ</option><option value="read">を読んだ</option></select><div class="labresult" data-bert-result aria-live="polite">${bertContextView()}</div></div><p>第9章の「全位置」と「causal mask」の違いを、ことばの手掛かりに置き換えて確かめる実験です。</p>`],
 ['入力と出力：［CLS］から分類、各位置から抽出へ',`<p>原版BERTでは、先頭に<b>［CLS］</b>、文の区切りなどに<b>［SEP］</b>を置きます。入力は、対応するトークナイザで作ったIDと位置などの情報です。［CLS］にも、通常のトークンにも出力ベクトルができます。</p>${table(['使い方','どの表現から答える？','出力の例'],[['文章分類','［CLS］位置などの表現＋分類用の層','レビュー → 肯定 / 否定'],['固有表現抽出','トークンごとの表現＋ラベル用の層','人名や組織名の範囲'],['抽出型の質問応答','質問と本文を入力し、本文の位置を予測','本文内の答えの開始・終了位置']])}<p>分類用に<b>ファインチューニング</b>するときは、レビューと肯定・否定の正解で、出力層やBERTの重みを調整します。推論は、調整済みのモデルに新しいレビューを入れて予測する段階です。通常の分類入力に［MASK］を付ける必要はありません。</p>${flow(['穴埋めで事前学習','分類用の層を付ける','ラベル付きレビューで追加学習','新しいレビューを分類'])}${note('［CLS］は、最初からあらゆる用途に最適な「文の要約」ではありません。どう学習し、どの出力層につなぐかで役割が決まります。')}`],
 ['GPTとの違いと、検索での注意',`${table(['観点','通常のBERT','GPT型の自己回帰モデル'],[['構造','Encoder-only','Decoder-only'],['表現を作る参照範囲','入力の前後','各位置の自分と過去（causal）'],['代表的な事前学習','隠したトークンの予測','次のトークンの予測'],['典型的な利用','分類・抽出・文の関係の判定','文章生成・対話']])}<p>これは構造と学習目的の比較です。GPT型でも分類を行えますし、BERTでも予測用の層を付けて穴埋めができます。「BERTは理解、GPTは生成」とだけ分けると、できることを狭く捉えてしまいます。</p><p>検索では、普通のBERTの［CLS］や単純平均をそのまま使えば、意味の近い文が必ず近くなるわけではありません。<b>Sentence-BERT</b>など、文の類似度に適した表現を学習したモデルを使う考え方があります。第11章の検索とつなげて考えましょう。</p><p>モデルを使う際は、対応する日本語トークナイザ、入力長の上限と切り捨て、専門分野の違いを確認します。「悪くない」の否定が切り落とされたり、長い文章の重要部分が入力に入らなかったりすれば、文脈を使えるモデルでも誤ります。</p>`],
 ['BERTの理解チェックと演習',bertChecksMarkup()+`<div class="exercise"><h3>自分の言葉で説明する</h3><ol><li>「彼は［MASK］を飲んだ」と「彼は［MASK］を読んだ」で、後ろの文脈がなぜ役立つか説明してください。</li><li>レビュー分類器を作る場合の、事前学習・追加学習・推論を分けて説明してください。</li></ol><details><summary>解答の例を見る</summary><p>「飲んだ」は飲み物、「読んだ」は本や文章を示す手掛かりになります。事前学習は元の文章から正解を作る穴埋め、追加学習はレビューと感情ラベルで分類用に調整、推論は新しいレビューの分類です。</p></details></div><div class="note"><b>まとめ：</b>BERTは前後の文脈からトークンの表現を作る。穴埋めの学習と、分類用の追加学習は別。分類・抽出・検索では、目的に合った出力層やモデルを選ぶ。</div>`]
];
const bertLesson=LESSONS[BERT_LESSON_INDEX];
// The working copy may already contain a short BERT introduction; replace that section only at render time.
bertLesson.sections=bertLesson.sections.filter(([title])=>!title.startsWith('BERT'));
bertLesson.sections.splice(1,0,...BERT_SECTIONS);
bertLesson.subtitle='BERTの文脈表現から、LLMの指示追従まで';
bertLesson.time=Math.max(bertLesson.time,85);
if(!bertLesson.tags.includes('BERT'))bertLesson.tags.push('BERT');
bertLesson.goal='BERTの双方向の表現・穴埋め学習・タスクへの追加学習を説明し、GPT型の生成との違いを区別できる。';
bertLesson.sources=[...new Set([...bertLesson.sources,'bertPaper','bertOriginal','bertDocs','sbertPaper'])];
NLP_FIELDS.forEach(group=>group.items.forEach(item=>{if(item[0]==='BERT'){item[4]=10;item[5]='BERT・事前学習とLLM';}}));

document.addEventListener('change',event=>{
 if(!event.target.matches('[data-bert-mode],[data-bert-scene]'))return;
 const demo=event.target.closest('.bert-demo');
 demo.querySelector('[data-bert-result]').innerHTML=bertContextView(demo.querySelector('[data-bert-mode]').value,demo.querySelector('[data-bert-scene]').value);
});
document.addEventListener('click',event=>{
 const button=event.target.closest('[data-bert-answer]');if(!button)return;
 const check=button.closest('[data-bert-q]');const [,options,answer,why]=BERT_CHECKS[Number(check.dataset.bertQ)];
 const correct=Number(button.dataset.bertAnswer)===answer;
 check.querySelectorAll('[data-bert-answer]').forEach(b=>b.classList.remove('correct','wrong'));
 button.classList.add(correct?'correct':'wrong');
 check.querySelector('.bert-feedback').textContent=(correct?'正解です。':'もう一度考えてみましょう。')+' '+why;
});
