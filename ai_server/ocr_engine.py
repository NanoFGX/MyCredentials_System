import requests
import pytesseract
from PIL import Image
from io import BytesIO

def extract_text_from_url(url: str) -> str:
    """
    Downloads an image from Firebase Storage URL and extracts text using Tesseract OCR.
    """
    try:
        print(f"Downloading: {url}")
        response = requests.get(url)

        if response.status_code != 200:
            print("Error downloading file:", response.status_code)
            return ""

        img = Image.open(BytesIO(response.content))

        text = pytesseract.image_to_string(img)

        return text.strip()

    except Exception as e:
        print("OCR error:", e)
        return ""
