📜 MyCredentials: AI-Powered Document Vault with eKYC VerificationSecure 
• Intelligent 
• AutomatedMyCredentials is a cross-platform mobile app built with Expo + React Native that provides a secure and intelligent document management system. It integrates a custom backend for advanced features like eKYC verification and automated document classification.
✨ Features Overview🔐
eKYC Login (IC OCR + Face Match): Securely logs users in using a mock eKYC process involving IC text extraction and face matching between the IC photo and a live selfie.
📤 Document Upload + AI Classification: Users can upload personal documents (IC, insurance, education, etc.) which are then automatically classified using Tesseract OCR and a Machine Learning model.
📁 Smart Vault Organization: Automatically sorts and organizes documents into predefined categories such as Identification, Education, Health, Property, Insurance, and more.
Secure Storage: Documents and extracted metadata are stored securely using Firebase Storage and Firestore.Document Viewer: Allows users to view extracted information (OCR snippets) and preview, download, or delete their stored files.
🚀 Technologies Used Category Component Technologies 
Frontend (Mobile App) App & UIReact Native (Expo)
-React NavigationCamera
-MediaExpo Image Picker 
-CameraBackend/DataFirebase Authentication (OTP + Anonymous login)
-Firebase Firestore
-StorageViewerOCR Document Viewer
-Image PreviewsBackend (ai_server)ServerFastAPI
-CORS enabledOCR EngineTesseract OCR (pytesseract)AI/MLMachine Learning classifier (scikit-learn) 
-Face detection (OpenCV)📂 Project StructureMyCredentials/
│
├── app/                     # Expo source code (Frontend)
│   ├── screens/             # Login, Dashboard, Vault, eKYC, Viewer
│   ├── components/          # Reusable UI
│   └── firebaseConfig.js    # Firebase initialization
│
├── ai_server/               # FastAPI OCR + eKYC backend
│   ├── main.py              # API routes (/classify, /ekyc)
│   ├── doc_classifier.joblib # Trained ML model
│   └── requirements.txt     # Backend dependencies
│
└── README.md                # Project documentation

🧠 App Feature Details🔐
1. eKYC Login (IC OCR + Face Match)The login process is secured and automated:User provides IC Number, IC Photo (front), and a Selfie.Backend performs:
1️⃣ OCR text extraction from the IC image.
2️⃣ Name & IC number recognition/verification.
3️⃣ Face match between the IC portrait and the uploaded selfie (using OpenCV).On successful verification, the user is created in Firestore and is logged into the Dashboard.📤 

2. Document Upload + AI ClassificationUser selects or captures a document image.Expo app sends the image to the FastAPI server.Backend processing:Tesseract extracts raw text from the image.ML classifier predicts the document category (e.g., "education", "insurance").The file is stored in Firebase Storage, and its metadata (category, text snippet) is saved in Firestore.The Dashboard displays the classified document preview.📁 

3. Smart Vault OrganizationDocuments are automatically sorted into the following categories, making them easy to find:IdentificationEducationHealthWorkPropertyInsuranceGovernmentUnsorted (for unclassified documents)Each document entry shows badges, timestamps, OCR snippets, and action buttons (View, Download, Delete).

🛠 Setup InstructionsFrontend Setup (Expo App)Install dependencies:

Bashnpm install

Start the app:

Bashnpx expo start

This will open the development server, allowing you to run the app on an:Android emulatoriOS simulatorExpo Go appWeb (optional)You can start developing by editing the files inside the app directory. This project uses file-based routing.

Backend Setup (FastAPI + OCR)Install Python dependencies:Bashpip install -r ai_server/requirements.txt

Ensure Tesseract OCR is installed:Windows Example: 

Install from Tesseract OCR GitHub and then set the path inside ai_server/main.py:Pythonpytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

Run FastAPI server:Bashuvicorn main:app --reload --port 8000

The Expo app should connect to the following addresses (ensure your device/emulator and computer are on the same network for physical devices):http://10.0.2.2:8000 
(Android emulator)http://localhost:8000 (iOS / Web)

📡 API EndpointsEndpointMethodDescriptionReturns/classifyPOSTOCR + ML document classification.
{ "label": "education", "confidence": 0.93, "text_snippet": "Universiti Putra Malaysia..."}/ekycPOSTIC OCR + face match (mock eKYC).
{ "match": true, "name": "Muhammad Danial", "ic_number": "030112080011"}

🧪 Testing the SystemeKYC Demo FlowEnter IC number.
Upload IC image.Take a selfie.
Backend verifies the match and OCR data.
App logs in and navigates to the Dashboard.Document Upload DemoChoose a JPG or PDF file to upload.
Observe the automatic classification result.Open the viewer to see the extracted OCR text snippet.
Test the Delete or Download functionalities.
📚 Learn More about ExpoTo learn more about developing your project with Expo, look at the following resources:Expo documentation: Learn fundamentals, or go into advanced topics with our guides.
Learn Expo tutorial: Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.
💡 Get a Fresh ProjectWhen you're ready to clear the example code and start fresh, run:

Bashnpm run reset-project

This command will move the starter code to the app-example directory and create a blank app directory where you can start developing.

🤝 Join the CommunityJoin our community of developers creating universal apps.
Expo on GitHub: View our open source platform and contribute.
Discord community: Chat with Expo users and ask questions.
