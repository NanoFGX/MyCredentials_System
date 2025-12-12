import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.metrics import classification_report
import joblib

# 1. Load dataset
df = pd.read_csv("dataset.csv")

# Drop rows with empty text (if any)
df["text"] = df["text"].fillna("")
df = df[df["text"].str.strip() != ""]

X = df["text"]
y = df["label"]

# 2. Train/test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

# 3. Build pipeline: TF‑IDF + Logistic Regression
model = Pipeline([
    ("tfidf", TfidfVectorizer(
        max_features=5000,
        ngram_range=(1, 2),
        stop_words="english"
    )),
    ("clf", LogisticRegression(max_iter=500))
])

print("🚀 Training classifier...")
model.fit(X_train, y_train)

# 4. Evaluate
print("\n📊 Evaluation on test set:")
y_pred = model.predict(X_test)
print(classification_report(y_test, y_pred))

# 5. Save model to file
joblib.dump(model, "doc_classifier.joblib")
print("\n✅ Saved model to doc_classifier.joblib")
