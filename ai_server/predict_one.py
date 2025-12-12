from PIL import Image
import pytesseract
import joblib
import os

# Path to tesseract.exe
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

# 1. Load trained model
model = joblib.load("doc_classifier.joblib")

# 2. Choose an image to test
image_path = "test_doc.jpg"  # change to your actual image filename

if not os.path.exists(image_path):
    print(f"❌ Image not found: {image_path}")
    exit(1)

print(f"✅ Found image: {image_path}")

# 3. OCR the image
text = pytesseract.image_to_string(Image.open(image_path), lang="eng")
text = text.replace("\n", " ").strip()

if not text:
    print("❌ No text found in image.")
    exit(1)

# 4. Predict label and probabilities
pred_label = model.predict([text])[0]
probas = model.predict_proba([text])[0]
classes = model.classes_

print("\n🧾 Extracted text (first 300 chars):")
print("-" * 40)
print(text[:300])
print("-" * 40)

print(f"\n📂 Predicted document type: **{pred_label}**")
print("\n🔢 Class probabilities:")
for cls, p in zip(classes, probas):
    print(f"  {cls:10s}: {p:.3f}")

