from fastapi import APIRouter, UploadFile, File
import face_recognition
import pytesseract
import numpy as np
from io import BytesIO
from PIL import Image
import re

router = APIRouter()

def load_image(file: UploadFile):
    img = Image.open(BytesIO(file.file.read()))
    return np.array(img)

@router.post("/ekyc/login")
async def ekyc_login(
    ic_image: UploadFile = File(...),
    selfie_image: UploadFile = File(...)
):
    try:
        # Load images
        ic_img = load_image(ic_image)
        selfie_img = load_image(selfie_image)

        # --- OCR IC TEXT ---
        text = pytesseract.image_to_string(ic_img)

        ic_number = ""
        name = ""

        ic_match = re.search(r"\b\d{12}\b", text)
        if ic_match:
            ic_number = ic_match.group(0)

        for line in text.split("\n"):
            if line.strip().isupper() and len(line.strip()) > 5:
                name = line.strip()
                break

        # --- FACE MATCH ---
        ic_face = face_recognition.face_encodings(ic_img)
        selfie_face = face_recognition.face_encodings(selfie_img)

        if not ic_face or not selfie_face:
            return { "verified": False, "reason": "Face not detected" }

        distance = face_recognition.face_distance([ic_face[0]], selfie_face[0])[0]
        confidence = 1 - float(distance)

        verified = confidence > 0.55  # threshold

        return {
            "verified": verified,
            "ic_number": ic_number,
            "full_name": name,
            "confidence": round(confidence, 2)
        }

    except Exception as e:
        return { "verified": False, "error": str(e) }
