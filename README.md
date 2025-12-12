MyCredentials — AI-Powered Document Vault with eKYC Verification

Secure • Intelligent • Automated

MyCredentials is a cross-platform mobile app built with Expo + React Native that allows users to:

Securely log in using mock eKYC (IC OCR + Face Match)

Upload personal documents (IC, Education, Insurance, Work, etc.)

Automatically classify documents using Tesseract OCR + ML model

Store files in Firebase Storage

View extracted information + download or delete documents

Automatically organize files inside a Smart Vault

This project includes:

Expo App (Frontend)

FastAPI Server (Backend)

Machine Learning Document Classifier

Tesseract OCR Engine

Firebase Authentication, Firestore, & Storage

🚀 Technologies Used
Frontend (Expo App)

React Native (Expo)

React Navigation

Expo Image Picker & Camera

Firebase Authentication (OTP + Anonymous Login)

Firebase Firestore

Firebase Storage

PDF & Image Previews

OCR Metadata Viewer

Backend (ai_server)

FastAPI

Tesseract OCR (pytesseract)

scikit-learn ML classifier

OpenCV face matching (for mock eKYC)

CORS for Expo mobile requests

📂 Project Structure
MyCredentials/
│
├── app/                     
│   ├── screens/             # Login, Dashboard, Vault, eKYC, Viewer
│   ├── components/          # UI components
│   └── firebaseConfig.js    # Firebase init
│
├── ai_server/               
│   ├── main.py              # API routes (/classify, /ekyc)
│   ├── doc_classifier.joblib # ML model
│   └── requirements.txt     # Backend dependencies
│
└── README.md 

🧠 App Features Overview
🔐 1. eKYC Login (IC OCR + Face Match)

Users log in using:

12-digit IC Number

IC Photo (front)

Selfie

Backend verifies by performing:

1️⃣ OCR text extraction from IC
2️⃣ IC number + name matching
3️⃣ Face match (IC portrait vs selfie)
4️⃣ Returns a verified identity

On success → a new Firebase user profile is created → Dashboard loads.

📤 2. Document Upload + AI Classification

Upload flow:

User selects or captures JPG

Image sent to FastAPI

Tesseract extracts raw text

ML model predicts category

Firestore saves metadata

Firebase Storage uploads file

Dashboard displays preview

📁 3. Smart Vault Organization

Documents automatically organized into:

Identification

Education

Health

Insurance

Work

Government

Property

Unsorted

Each item includes:

Category badge

Thumbnail preview (PDF or image)

OCR text snippet

Upload timestamp

Delete / Download actions

🛠 Setup Instructions
Frontend Setup (Expo App)
1. Install dependencies
npm install

2. Start the Expo app
npx expo start


You may open the app in:

Android Emulator

iOS Simulator

Expo Go

Web Browser

This project uses file-based routing, supported by Expo.

Backend Setup (FastAPI + OCR)
1. Install Python dependencies
pip install -r ai_server/requirements.txt

2. Install Tesseract OCR

Download from:
https://github.com/tesseract-ocr/tesseract

Then configure the path inside main.py:

pytesseract.pytesseract.tesseract_cmd = 
r"C:\Program Files\Tesseract-OCR\tesseract.exe"

3. Start the backend server
uvicorn main:app --reload --port 8000

Expo should connect to:

Android Emulator: http://10.0.2.2:8000

iOS / Web: http://localhost:8000

📡 API Endpoints
POST /classify

OCR extraction + ML document category prediction.

Response Example:

{
  "label": "education",
  "confidence": 0.93,
  "text_snippet": "Universiti Putra Malaysia..."
}

POST /ekyc

Mock eKYC identity verification.

Response Example:

{
  "match": true,
  "name": "Muhammad Danial",
  "ic_number": "030112080011"
}

🧪 Testing the System
eKYC Demo Flow

Enter IC number

Upload IC photo

Take a selfie

Backend verifies identity

App logs in → Dashboard

Document Upload Demo

Choose JPG

AI classifies it

View OCR text

Download / delete document

📘 Additional Expo Documentation

This project was created using create-expo-app.

Useful Commands

Install dependencies:

npm install


Start the app:

npx expo start


Reset Expo project:

npm run reset-project

Learn More

Expo Docs: https://docs.expo.dev

React Native Navigation: https://reactnavigation.org

FastAPI Docs: https://fastapi.tiangolo.com

🤝 Join the Expo Community

GitHub: https://github.com/expo/expo

Discord: https://chat.expo.dev

🛑 Disclaimer

This eKYC system is a mock implementation for academic purposes.
It should NOT be used in production environments that require real identity verification.
