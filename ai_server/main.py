from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import pytesseract
import tempfile
import os
import re
import imagehash

# ----------------------------------
# TESSERACT PATH
# ----------------------------------
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

# ----------------------------------
# FastAPI Setup
# ----------------------------------
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------------------------
# Helper: Save uploaded file to temp
# ----------------------------------
async def save_temp_file(upload: UploadFile):
    suffix = os.path.splitext(upload.filename)[1] or ".jpg"
    fd, tmp_path = tempfile.mkstemp(suffix=suffix)
    data = await upload.read()
    with open(tmp_path, "wb") as f:
        f.write(data)
    os.close(fd)
    return tmp_path

# ----------------------------------
# Helper: Extract IC number using OCR
# ----------------------------------
IC_PATTERN = re.compile(r"(\d{12}|\d{6}-\d{2}-\d{4})")

def extract_ic_from_text(text: str):
    clean = text.replace("\n", " ")
    match = IC_PATTERN.search(clean)
    if not match:
        return None
    return re.sub(r"\D", "", match.group())  # return numeric version

# ----------------------------------
# Helper: cheap face similarity using imagehash
# ----------------------------------
def compare_faces(img1_path, img2_path):
    try:
        img1 = Image.open(img1_path).convert("RGB")
        img2 = Image.open(img2_path).convert("RGB")

        hash1 = imagehash.phash(img1)
        hash2 = imagehash.phash(img2)

        diff = hash1 - hash2  # Hamming distance
        return diff <= 12, int(diff)
    except Exception:
        return False, None

# ----------------------------------
# eKYC ENDPOINT
# ----------------------------------
@app.post("/ekyc")
async def ekyc_verify(
    ic_number: str = Form(...),
    ic_image: UploadFile = File(...),
    selfie: UploadFile = File(...)
):
    tmp_files = []

    try:
        # Save files
        ic_path = await save_temp_file(ic_image); tmp_files.append(ic_path)
        selfie_path = await save_temp_file(selfie); tmp_files.append(selfie_path)

        # OCR the IC image
        raw_text = pytesseract.image_to_string(Image.open(ic_path))
        extracted_ic = extract_ic_from_text(raw_text)

        if not extracted_ic:
            return {
                "match": False,
                "reason": "IC not detected by OCR",
                "extracted_ic": None
            }

        typed_ic = re.sub(r"\D", "", ic_number)
        text_match = (typed_ic == extracted_ic)

        # Compare faces (lightweight hash comparison)
        face_match, face_score = compare_faces(ic_path, selfie_path)

        final_match = text_match and face_match

        return {
            "match": final_match,
            "typed_ic": typed_ic,
            "extracted_ic": extracted_ic,
            "text_match": text_match,
            "face_match": face_match,
            "face_score": face_score,
            "ocr_text_snippet": raw_text[:200]
        }

    finally:
        # Cleanup files
        for f in tmp_files:
            try: os.remove(f)
            except: pass


# ----------------------------------
# EXISTING CLASSIFIER ENDPOINT
# ----------------------------------
@app.post("/classify")
async def classify(file: UploadFile = File(...)):
    import joblib
    MODEL_PATH = "doc_classifier.joblib"
    model = joblib.load(MODEL_PATH)

    with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp:
        tmp.write(await file.read())
        tmp_path = tmp.name

    text = pytesseract.image_to_string(Image.open(tmp_path))
    os.remove(tmp_path)

    pred = model.predict([text])[0]
    probas = model.predict_proba([text])[0]

    return {
        "label": pred,
        "confidence": float(max(probas)),
        "text_snippet": text[:200]
    }


@app.get("/")
async def root():
    return {"message": "EKYC + Document Classifier API running"}
