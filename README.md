# 🐠 AQUAZONE - Premium Aquatic Store (Fullstack Web App)

Aplikasi Web E-Commerce Akuatik & Ikan Hias modern dengan tema gelap glassmorphism ultra-elegan.

---

## 🛠️ Struktur Folder

```
d:\UD.Sumber rezeki\
├── backend/                    # BACKEND (Node.js + Express API & Database)
│   ├── index.js                # Server REST API
│   ├── db.js                   # Database manager persisten
│   ├── middleware/auth.js      # JWT Auth & Admin Role
│   └── data/database.json      # Database file
│
├── fronted/                    # FRONTED (React 19 + Vite + Tailwind CSS)
│   ├── vite.config.js          # Konfigurasi Vite & Proxy API
│   └── src/
│       ├── App.jsx             # Aplikasi web utama
│       ├── api.js              # Client API Fetch
│       ├── context/            # AuthContext & CartContext
│       └── components/         # Modals & UI Components
│
├── start.js                    # Script runner otomatis (menjalankan backend + fronted)
├── start.bat                   # File starter Windows
└── package.json                # Root package config
```

---

## 🚀 Cara Menjalankan

Cukup jalankan dari folder utama:
```bash
node start.js
```
*(Atau ketik `npm start`)*

Aplikasi akan otomatis berjalan pada:
- **Fronted Web**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000/api](http://localhost:5000/api)
