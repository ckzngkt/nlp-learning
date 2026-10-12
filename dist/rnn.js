// RNN belongs to the general family of sequence models; chapter 7 uses text as its example.
Object.assign(SOURCES,{
 rnnTextbook:['Dive into Deep Learning · RNN','https://d2l.ai/chapter_recurrent-neural-networks/rnn.html'],
 lstmTextbook:['Dive into Deep Learning · LSTM','https://d2l.ai/chapter_recurrent-modern/lstm.html'],
 gruPaper:['Cho et al. · RNN Encoder–DecoderとGRU','https://arxiv.org/abs/1406.1078'],
 bidirectional:['Dive into Deep Learning · 双方向RNN','https://d2l.ai/chapter_recurrent-modern/bi-rnn.html']
});
const RNN_STEPS=[
 ['まだ読んでいない','初期状態から始めます。'],
 ['彼女は','誰かについての話が始まった、という情報を持ち越します。'],
 ['駅で','前の状態と場所の情報を組み合わせます。'],
 ['友人に','誰と関わるかの情報を、これまでの状態に加えます。'],
 ['会った','文の終わりまで読みました。最終状態を分類用の層へ渡す使い方もあります。']
];
function rnnStepMarkup(step=0){
 const tokens=RNN_STEPS.slice(1).map(([word],i)=>`<span class="bert-token ${i+1>step?'bert-unavailable':i+1===step?'bert-target':''}">${word}<small>${i+1>step?'未読':i+1===step?'今回の入力':'読み終えた'}</small></span>`).join('');
 return `<p><b>${step} / 4 段階</b></p><div class="bert-tokens" aria-label="読み終えた位置と、今回の入力">${tokens}</div>${flow([step?'前の状態':'初期状態',step?`今回の入力：${RNN_STEPS[step][0]}`:'まだ入力なし',step?'同じ更新処理を適用':'入力を待つ',step?'新しい状態を次へ':'初期状態'])}<p><b>人の言葉での説明：</b>${RNN_STEPS[step][1]}</p><p>${step>1?'bigramが直接使うのは直前の語だけですが、RNNの状態には、それより前の情報も反映できる仕組みがあります。':'次の段階へ進めると、前の状態と今回の入力を使う流れが見えます。'}</p>`;
}
const RNN_SECTIONS=[
 ['RNNとは：順序のある入力を、状態でつなぐ',`<p><b>RNN（Recurrent Neural Network）</b>は、順に届く入力を処理し、途中の<b>状態</b>を次の段階へ渡すニューラルネットワークです。日本語では再帰型ニューラルネットワークとも呼ばれます。文章だけでなく、音声やセンサーの時系列などにも使える、系列を扱う仕組みです。</p>${flow(['前の状態＋今回の入力','同じ更新処理','新しい状態','次の入力へ'])}<p>文章では、トークンの埋め込みと前の状態から新しい状態を作ります。各位置で別々の処理を用意するのではなく、<b>同じ学習済みの重み</b>を繰り返し使います。処理が同じでも、入力と前の状態が違うので、出てくる状態は変わります。</p>${note('状態は数値のベクトルです。「メモ」というたとえは、文章を丸ごと保存したり、人が読める要約を書いたりするという意味ではありません。必要な情報が必ず残るわけでもありません。')}`],
 ['実験：一つずつ読んで、状態を持ち越す',`<div class="lab rnn-demo" data-rnn-step="0"><span class="lab-heading">TRY IT YOURSELF · RNN</span><h3>「彼女は 駅で 友人に 会った」を順に読む</h3><p>状態の受け渡しを示す概念デモです。実際のRNNの学習・推論や状態ベクトルの計算は行いません。日本語の区切りも説明用です。</p><div class="rnn-actions"><button type="button" data-rnn-action="prev" disabled>一つ戻る</button><button type="button" data-rnn-action="next">次を読む</button><button type="button" data-rnn-action="reset">最初へ戻す</button></div><div class="labresult" data-rnn-result aria-live="polite">${rnnStepMarkup()}</div></div><p>画面の説明は人向けのたとえです。本物の状態に「駅」や「友人」という文字がそのまま書き込まれるわけではありません。</p>`],
 ['何を出力するかで、使い方が変わる',`${table(['タスク','入力と出力の例','状態の使い方'],[['文章分類','レビュー全体 → 肯定 / 否定','最後の状態や複数位置をまとめて分類'],['系列ラベリング','各トークン → 品詞や固有表現のラベル','各位置の状態からラベルを予測'],['言語モデル','ここまでのトークン → 次のトークンの分布','各位置の状態から次を予測']])}<p>RNNは構造の名前で、言語モデルは解く仕事の名前です。RNNを使う言語モデルも、RNNを使う分類器も作れます。第1章の「何を解くか」と「どう解くか」を分けて考えましょう。</p><p>学習では、各段階の予測と正解の違いから重みを調整します。推論では、学習済みの重みを使って状態を更新します。<b>状態が変わること</b>と、<b>重みを学習すること</b>は別です。</p>`],
 ['長い文脈と、LSTM・GRUの工夫',`<p>文章の前半に出た人物や話題が、ずっと後の語に関わることがあります。単純なRNNでは、その情報を何度も状態の更新に通すため、長い関係を学ぶのが難しくなります。学習の信号が小さくなる勾配消失や、大きくなる勾配爆発も関わります。</p><p><b>LSTM</b>と<b>GRU</b>はRNNの仲間です。状態をどう残し、どう更新するかを調整する<b>ゲート</b>を持ちます。ゲートは学習で決まる数値の調整で、人が「この単語を覚える」と指定するスイッチではありません。</p>${table(['方式','状態を扱う考え方','覚えておきたい点'],[['単純なRNN','前の状態と今の入力から新しい状態を作る','長い依存関係の学習が難しい場合がある'],['LSTM','セル状態を持ち、残す・加える・出力する量を調整','隠れ状態とセル状態を区別する'],['GRU','更新・リセットのゲートで状態の混ぜ方を調整','標準的なLSTMより簡潔な構成']])}<p>どちらも長い文脈の扱いを助けますが、無限に正確に覚えられるわけではありません。LSTMとGRUの性能の優劣も、データや用途をそろえて比較します。</p>`],
 ['双方向RNNから、Attention・Transformerへ',`<p>ここまでのデモは前から読む<b>単方向RNN</b>です。文章全体が既にある場合は、前向きと後ろ向きの状態を組み合わせる<b>双方向RNN</b>も使えます。各語の判定に前後の文脈を利用できるため、「双方向はBERTだけの特徴」ではありません。</p><p>一方、次のトークンを予測する言語モデルでは、予測したい未来の正解を見せてはいけません。利用する場面によって参照できる範囲が変わります。</p>${table(['仕組み','情報を渡す道筋','処理上の特徴'],[['RNN・LSTM・GRU','状態を隣の段階へ渡す','次の状態は前の状態を待つ'],['双方向RNN','前向き・後ろ向きの状態を組み合わせる','入力全体が必要で、各方向に順次処理する'],['Self-Attention','各位置が参照できる位置から直接情報を取り込む','系列内の複数位置を並列に計算できる']])}<p>AttentionはRNNと組み合わせることもできます。Transformerは、RNNによる状態の受け渡しを使わず、Attentionを中心に層を組み立てます。ただし、GPT型の通常の文章生成では、まだ決まっていない次のトークンを先に入力できないので、生成は順に進みます。</p><div class="exercise"><h3>理解を確かめる</h3><details><summary>RNNの状態は、文章を丸ごと保存するもの？</summary><p>いいえ。入力と前の状態から作る、固定サイズの数値表現です。全履歴を正確に取り出せる記録ではありません。</p></details><details><summary>LSTMはRNNとは別の分野？</summary><p>いいえ。状態を保つ方法を工夫したRNNの一種です。GRUも同じく、ゲートを使うRNNの仲間です。</p></details><details><summary>RNNとTransformerの違いは「前だけ／前後」？</summary><p>それだけではありません。双方向RNNもあります。重要な違いは、順次更新する状態を介するか、Attentionで参照先から情報を取り込むかです。未来の参照の可否はタスクと構造で決まります。</p></details></div>`]
];
const rnnLesson=LESSONS[6];
rnnLesson.sections=rnnLesson.sections.filter(([title])=>!title.startsWith('RNN'));
rnnLesson.sections.splice(1,0,...RNN_SECTIONS);
rnnLesson.subtitle='n-gramからRNN・LSTM・GRUへ';
rnnLesson.time=Math.max(rnnLesson.time,80);
rnnLesson.goal='RNNの状態の受け渡しと、LSTM・GRU・双方向RNNの役割を説明し、言語モデルというタスクと区別できる。';
rnnLesson.tags=[...new Set([...rnnLesson.tags,'LSTM','GRU','双方向RNN'])];
rnnLesson.sources=[...new Set([...rnnLesson.sources,'rnnTextbook','lstmTextbook','gruPaper','bidirectional'])];
NLP_FIELDS.forEach(group=>group.items.forEach(item=>{if(/^(RNN|LSTM|GRU)/.test(item[0])){item[4]=7;item[5]='RNN・LSTM・GRUの関連章';}}));
document.addEventListener('click',event=>{
 const button=event.target.closest('[data-rnn-action]');if(!button)return;
 const demo=button.closest('.rnn-demo');const old=Number(demo.dataset.rnnStep);
 const step=button.dataset.rnnAction==='reset'?0:Math.max(0,Math.min(4,old+(button.dataset.rnnAction==='next'?1:-1)));
 demo.dataset.rnnStep=String(step);demo.querySelector('[data-rnn-result]').innerHTML=rnnStepMarkup(step);
 demo.querySelector('[data-rnn-action="prev"]').disabled=step===0;
 demo.querySelector('[data-rnn-action="next"]').disabled=step===4;
});
