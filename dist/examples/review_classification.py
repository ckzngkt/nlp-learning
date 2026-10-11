"""教材用の架空レビュー40件で、分類実験の流れを一周する。"""
import csv
import platform
from pathlib import Path

import sklearn
from sklearn.dummy import DummyClassifier
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, confusion_matrix, f1_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import make_pipeline


def main():
    with Path(__file__).with_name("reviews.csv").open(encoding="utf-8", newline="") as f:
        rows = list(csv.DictReader(f))
    if len({r["text"] for r in rows}) != len(rows):
        raise ValueError("同じ文章が重複しています。分割前に確認してください。")
    if {r["label"] for r in rows} != {"negative", "positive"}:
        raise ValueError("labelはnegativeまたはpositiveにしてください。")

    # まずテスト20%を確保。残り80%のうち25%を検証用にする。
    train_val, test = train_test_split(
        rows, test_size=0.2, stratify=[r["label"] for r in rows], random_state=42
    )
    train, valid = train_test_split(
        train_val, test_size=0.25,
        stratify=[r["label"] for r in train_val], random_state=42
    )
    x_train, y_train = [r["text"] for r in train], [r["label"] for r in train]
    x_valid, y_valid = [r["text"] for r in valid], [r["label"] for r in valid]
    x_test, y_test = [r["text"] for r in test], [r["label"] for r in test]
    print(f"Python {platform.python_version()} / scikit-learn {sklearn.__version__}")
    print(f"件数: train={len(train)}, valid={len(valid)}, test={len(test)}")
    for name, split in [("train", train), ("valid", valid), ("test", test)]:
        print(name, "IDs:", ", ".join(r["id"] for r in split))

    # 多数派を常に予測する基準。今回は同数なので同数時の選択に従う。
    baseline = DummyClassifier(strategy="most_frequent")
    baseline.fit([[0]] * len(train), y_train)
    print("多数派の検証macro F1:", round(f1_score(
        y_valid, baseline.predict([[0]] * len(valid)), average="macro", zero_division=0
    ), 3))

    # 空白のない日本語を、文字2〜4-gramで数値化する。
    # 語彙とIDFも訓練側だけで学習する。
    best_score, best_c, best_model = -1, None, None
    for c in [0.1, 1.0, 10.0]:
        model = make_pipeline(
            TfidfVectorizer(analyzer="char", ngram_range=(2, 4)),
            LogisticRegression(C=c, max_iter=1000, random_state=42)
        )
        model.fit(x_train, y_train)
        score = f1_score(y_valid, model.predict(x_valid), average="macro", zero_division=0)
        print(f"C={c}: 検証macro F1={score:.3f}")
        if score > best_score:
            best_score, best_c, best_model = score, c, model

    # 検証で選んだ学習済みモデルを、ここで一度だけテスト評価する。
    pred = best_model.predict(x_test)
    print(f"\n採用したC: {best_c}")
    print("多数派のテストmacro F1:", round(f1_score(
        y_test, baseline.predict([[0]] * len(test)), average="macro", zero_division=0
    ), 3))
    print(classification_report(
        y_test, pred, labels=["negative", "positive"], digits=3, zero_division=0
    ))
    print("混同行列: 行=正解、列=予測。順序=negative, positive")
    print(confusion_matrix(y_test, pred, labels=["negative", "positive"]))
    print("\nテストの誤り例:")
    errors = 0
    for row, guess in zip(test, pred):
        if guess != row["label"]:
            errors += 1
            print(f'{row["id"]}: 正解={row["label"]}, 予測={guess}, 本文={row["text"]}')
    if errors == 0:
        print("この分割では誤りなし。実データでの性能を保証する結果ではありません。")
    print("\n架空の少量データによる手順確認です。スコアを一般化しないでください。")


if __name__ == "__main__":
    main()
