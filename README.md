MyCredentials — AI-Powered Document Vault with eKYC Verification

Secure • Intelligent • Automated

MyCredentials is a cross-platform mobile application built using Expo + React Native that enables users to:

Securely log in using mock eKYC (IC OCR + Face Match)

Upload personal documents (IC, Education, Insurance, Work, etc.)

Automatically classify documents using Tesseract OCR + Machine Learning

Store files in Firebase Storage

View extracted OCR info, download files, or delete documents

Automatically organize files inside an intelligent Smart Vault

This project contains:

Expo App (Frontend)

FastAPI Server (Backend for OCR + eKYC)

ML Document Classifier (scikit-learn)

Tesseract OCR Integration

Firebase Authentication, Firestore, & Storage

🚀 Technologies Used
Frontend

React Native (Expo)

React Navigation

Expo Image Picker & Camera

Firebase Authentication (OTP + Anonymous Login)

Firebase Firestore

Firebase Storage

Document Viewer + PDF/Image Preview

Backend (ai_server)

FastAPI

Tesseract OCR (pytesseract)

scikit-learn ML classifier

OpenCV face-detection (for mock eKYC)

CORS-enabled API

📂 Project Structure
MyCredentials/
│
├── app/                     
│   ├── screens/             # Login, Dashboard, Vault, eKYC, Viewer
│   ├── components/          # Shared UI components
│   └── firebaseConfig.js    # Firebase initialization
│
├── ai_server/               
│   ├── main.py              # FastAPI OCR & EKYC routes
│   ├── doc_classifier.joblib # ML model for classification
│   └── requirements.txt     # Backend dependencies
│
└── README.md
🧠 App Features Overview
🔐 1. eKYC Login (IC OCR + Face Match)

Users log in using:

IC Number

IC Photo (front)

Selfie

Backend performs:

1️⃣ OCR text extraction on IC
2️⃣ Identifies IC number + name
3️⃣ Face comparison (very simplified demo logic)
4️⃣ On success → Firebase anonymous user is created

After successful verification → user enters Dashboard.

📤 2. Document Upload + AI Classification

Upload workflow:

User picks or captures a JPG

Expo app sends image → FastAPI

OCR extracts raw text

ML classifier predicts the category

Firestore stores metadata

Firebase Storage stores the image

Dashboard shows preview + category badge

📁 3. Smart Vault Organization

Documents automatically sorted into:

Identification

Education

Health

Insurance

Work

Government

Property

Unsorted

Each card displays:

Category badge

Thumbnail preview (image or PDF pseudo-thumbnail)

Timestamp

OCR snippet

Delete / Download actions

🛠 Setup Instructions
Frontend Setup (Expo App)
1. Install dependencies
npm install
2. Start the app
npx expo start


You may open the app via:

Android Emulator

iOS Simulator

Expo Go

Web

This project uses file-based routing inside the /app folder.

Backend Setup (FastAPI + OCR + eKYC)
1. Install Python dependencies
pip install -r ai_server/requirements.txt

2. Install Tesseract OCR

Download from:
https://github.com/tesseract-ocr/tesseract

Configure the Tesseract path in main.py:

pytesseract.pytesseract.tesseract_cmd = 
r"C:\Program Files\Tesseract-OCR\tesseract.exe"

3. Start backend server
uvicorn main:app --reload --port 8000

Expo → Backend URLs
Platform	FastAPI URL
Android Emulator	http://10.0.2.2:8000
iOS / Web	http://localhost:8000
📡 API Endpoints
POST /classify

OCR + ML document category detection.

Example Response

{
  "label": "education",
  "confidence": 0.93,
  "text_snippet": "Universiti Putra Malaysia..."
}

POST /ekyc

Mock identity verification (IC OCR + face comparison).

Example Response

{
  "match": true,
  "name": "Muhammad Danial",
  "ic_number": "030112080011"
}

🧪 Testing the System
eKYC Demo Flow

Enter IC number

Upload IC photo

Take selfie

Backend verifies identity

User logs in → Dashboard

Document Upload Demo

Choose JPG

AI classifies category

View OCR snippet

View, download, or delete document

📘 Expo Documentation

(From original template)

This project was created with create-expo-app.

Get started

Install dependencies:

npm install


Start development server:

npx expo start

Reset project
npm run reset-project

Helpful Links

Expo Docs: https://docs.expo.dev

Expo Tutorial: https://docs.expo.dev/tutorial/introduction

React Navigation Docs: https://reactnavigation.org

FastAPI Docs: https://fastapi.tiangolo.com

🤝 Community

Expo GitHub: https://github.com/expo/expo

Expo Discord: https://chat.expo.dev

🛑 Disclaimer

This eKYC system is a mock academic prototype.
It must not be used for real identity verification or any production system requiring security compliance.
