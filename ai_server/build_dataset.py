from pathlib import Path
from PIL import Image
import pytesseract
import pandas as pd
import os

# 1. Point pytesseract to your Tesseract install (Windows)
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

BASE_DIR = Path("samples")
rows = []

# 2. Loop through category folders
for category_dir in BASE_DIR.iterdir():
    if not category_dir.is_dir():
        continue

    label = category_dir.name  # folder name = label (education, property, ...)

    for img_path in category_dir.iterdir():
        if img_path.suffix.lower() not in [".jpg", ".jpeg", ".png", ".tif", ".tiff"]:
            continue

        print(f"OCR {img_path} as label '{label}'")

        try:
            # 3. OCR
            text = pytesseract.image_to_string(Image.open(img_path), lang="eng")
            text = text.replace("\n", " ").strip()

            rows.append({
                "filename": str(img_path),
                "label": label,
                "text": text
            })
        except Exception as e:
            print(f"Error on {img_path}: {e}")

# 4. Save to CSV
df = pd.DataFrame(rows)
out_path = "dataset.csv"
df.to_csv(out_path, index=False, encoding="utf-8")

print(f"\n✅ Saved {len(df)} rows to {out_path}")
