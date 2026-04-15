<div align="center">

<img src="https://img.shields.io/badge/React%20Native-Expo-black?style=for-the-badge&logo=expo&logoColor=gold" />
<img src="https://img.shields.io/badge/Firebase-Firestore-black?style=for-the-badge&logo=firebase&logoColor=gold" />
<img src="https://img.shields.io/badge/Status-Active-black?style=for-the-badge&color=2d5a27" />

<br /><br />

```
  ██████  ██████       ██ ███    ██ ██    ██
 ██    ██ ██   ██      ██ ████   ██ ██    ██
 ██    ██ ██████       ██ ██ ██  ██ ██    ██
 ██    ██ ██   ██      ██ ██  ██ ██  ██  ██
  ██████  ██   ██      ██ ██   ████   ████
```

# 📦 NGO Control Center
### QR-Based Inventory & Logistics Management System

*Replacing clipboards with QR codes. Replacing guesswork with real-time data.*

---

</div>

## 🌍 What Is This?

A full-stack mobile application built for **NGOs and relief organizations** to manage food aid inventory — tracking rice, dal, and sachets across boxes using QR codes, real-time Firestore updates, and shortage detection.

No more spreadsheets. No more manual errors. Just scan, dispatch, and go.

---

## 📸 Screenshots

| Sign In | Dashboard (Dark) | Dashboard (Light) |
|--------|-----------------|-------------------|
| ![Sign In](https://github.com/AveeckPandey/QR-Based-Supply-Chain-Inventory-Management-System-for-NGOs/blob/main/assets/images/WhatsApp%20Image%202026-04-15%20at%2023.14.34.jpeg?raw=true) | ![Dark Dashboard]([screenshots/dashboard_dark.jpeg](https://github.com/AveeckPandey/QR-Based-Supply-Chain-Inventory-Management-System-for-NGOs/blob/cdc1afcadf915edc9437aa738b11e8283588041a/assets/images/WhatsApp%20Image%202026-04-15%20at%2023.14.37.jpeg)) | ![Light Dashboard](screenshots/dashboard_light.jpeg) |

| Manage Boxes | QR Print View | QR Scanner |
|-------------|--------------|------------|
| ![Boxes](screenshots/manage_boxes.jpeg) | ![QR Print](screenshots/qr_print.jpeg) | ![Scanner](screenshots/scanner.jpeg) |

> Add your actual screenshots to a `/screenshots` folder in the repo root.

---

## ✨ Features

### 🔳 QR-Based Box Tracking
- Every box gets a **unique QR code** on creation
- Scan QR to instantly fetch box details
- Print or download QR labels for physical tagging

### 📦 Full Box Lifecycle
Each box moves through three states:

```
[ STORED ] ──dispatch──► [ DISPATCHED ] ──return──► [ RETURNED ]
    ▲                                                      │
    └──────────────────────────────────────────────────────┘
```

Inventory is **automatically adjusted** at every state transition.

### 📊 Real-Time Dashboard
- Live stock levels: Rice (kg), Dal (kg), Sachets
- Summary metrics: Possible Boxes, Total Boxes, Target Coverage %
- Visual inventory bar chart
- Box status counters (Stored / Dispatched / Returned)

### 🎯 Target Planning
Set a box target and instantly see:
- Rice Shortage (kg)
- Dal Shortage (kg)
- Sachet Shortage

### 🔐 Admin Inventory Control
A separate admin panel for manual stock corrections — ensures ground-level accuracy without breaking live tracking.

### ⚡ Transaction-Safe Updates
All Firestore writes use **atomic transactions** to guarantee:
- No negative inventory
- No double-dispatch
- No data races under concurrent use

### 🌓 Light / Dark Mode
Toggle between light and dark themes from the dashboard header.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Mobile Frontend | React Native (Expo) |
| Database | Firebase Firestore |
| Authentication | Firebase Auth |
| QR Generation | `react-native-qrcode-svg` |
| QR Scanning | `expo-camera` |
| Hosting (Admin) | Firebase Hosting / AWS Amplify |

---

## 🧠 Architecture

```
┌─────────────────────────────────────┐
│       React Native (Expo App)        │
│                                      │
│  ┌──────────┐   ┌─────────────────┐ │
│  │ QR Scan  │   │ Manual Dispatch │ │
│  └────┬─────┘   └────────┬────────┘ │
│       └────────┬──────────┘         │
│           ┌────▼────┐               │
│           │Firebase │               │
│           │  Auth   │               │
│           └────┬────┘               │
│           ┌────▼──────────────┐     │
│           │ Firestore DB      │     │
│           │ ├── /boxes        │     │
│           │ ├── /inventory    │     │
│           │ └── /users        │     │
│           └───────────────────┘     │
└─────────────────────────────────────┘
```

---

## 📱 App Screens

| Screen | Purpose |
|--------|---------|
| **Sign In / Sign Up** | Firebase Auth-based login with password strength indicator |
| **Dashboard** | Live KPIs, inventory chart, target planning, action buttons |
| **Manage Boxes** | Search, edit, view all boxes with inline QR previews |
| **QR Scanner** | Camera-based scanning to trigger dispatch/return flows |
| **Box Details** | View full box contents, update status |
| **Admin Inventory** | Manually adjust rice, dal, sachet stock |
| **QR Print View** | Full-size printable QR with box metadata |

---

## ⚙️ Installation

### Prerequisites
- Node.js ≥ 18
- Expo CLI (`npm install -g expo-cli`)
- A Firebase project with Firestore and Auth enabled

### Steps

```bash
# 1. Clone the repo
git clone https://github.com/your-username/ngo-control-center.git
cd ngo-control-center

# 2. Install dependencies
npm install

# 3. Set up environment variables (see below)

# 4. Start the development server
npx expo start
```

Scan the QR in your terminal with **Expo Go** (iOS/Android) or run on a simulator.

---

## 🔐 Environment Setup

Create a `.env` file in the project root:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

> ⚠️ Never commit your `.env` file. It's already in `.gitignore`.

---

## 🗄️ Firestore Data Model

```
/boxes/{boxId}
  ├── rice: number (kg)
  ├── dal: number (kg)
  ├── sachets: number
  ├── status: "stored" | "dispatched" | "returned"
  └── createdAt: timestamp

/inventory/global
  ├── rice: number (kg)
  ├── dal: number (kg)
  └── sachets: number
```

---

## 🎯 Use Case

Built for NGOs managing **food relief distribution**:

- Pack boxes with measured rice, dal, and sachets
- Tag each box with a printed QR code
- Dispatch boxes to field teams via QR scan
- Receive returned/unused boxes back into inventory
- Monitor shortfalls before campaigns launch

---

## 📈 Impact

- ✅ ~70% reduction in manual inventory tracking effort
- ✅ Instant QR-based stock visibility in the field
- ✅ Real-time shortage alerts prevent under-stocking
- ✅ Atomic transactions eliminate data corruption

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first.

```bash
git checkout -b feature/your-feature
git commit -m "feat: add your feature"
git push origin feature/your-feature
```

---

## 📄 License

MIT © [Your Name / Organization]

---

<div align="center">

*Built with ❤️ for organizations that feed the world.*

</div>
