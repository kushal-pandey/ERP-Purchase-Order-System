# 🧾 ERP Purchase Order System

A full-stack web application to manage **Purchase Orders, Vendors, and Products** with Google Authentication.

---

## 🚀 Features

* Create Purchase Orders
* Manage Vendors & Products
* Dynamic total calculation (with tax)
* Google Sign-In authentication
* Order Dashboard
* PostgreSQL database integration
* REST API using FastAPI

---

## 🛠 Tech Stack

### Frontend

* HTML
* CSS (Bootstrap)
* JavaScript

### Backend

* FastAPI (Python)

### Database

* PostgreSQL

### Authentication

* Google OAuth + JWT

---

## 📦 Project Structure

```
project-root/
│
├── app/
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   ├── routes/
│   │   ├── vendors.py
│   │   ├── products.py
│   │   ├── orders.py
│   │   └── auth.py
│
├── frontend/
│   ├── index.html
│   ├── dashboard.html
│   ├── script.js
│   └── style.css
│
├── .env
├── .gitignore
└── README.md
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/kushal-pandey/ERP-Purchase-Order-System.git
cd ERP-Purchase-Order-System
```

---

### 2️⃣ Create Virtual Environment

```bash
python -m venv venv
```

Activate it:

**Windows (CMD / PowerShell):**

```bash
venv\Scripts\activate
```

**Git Bash:**

```bash
source venv/Scripts/activate
```

---

### 3️⃣ Install Dependencies

```bash
pip install fastapi uvicorn sqlalchemy psycopg2-binary python-dotenv python-jose google-auth
```

---

### 4️⃣ Setup PostgreSQL

* Install PostgreSQL
* Create a database:

```sql
erp_db
```

---

### 5️⃣ Configure Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/erp_db
SECRET_KEY=your_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
```

---

### 6️⃣ Run Backend Server

```bash
uvicorn app.main:app --reload
```

Server runs at:

```
http://127.0.0.1:8000
```

API Docs:

```
http://127.0.0.1:8000/docs
```

---

### 7️⃣ Run Frontend

Open directly:

```
frontend/index.html
```

Or use Live Server:

```
http://127.0.0.1:5500/frontend/index.html
```

---

## 🔐 Google Authentication Setup

1. Go to Google Cloud Console
2. Create an OAuth Client ID
3. Add authorized origins:

```
http://127.0.0.1:5500
http://localhost:5500
http://localhost
```

### ⚠️ Common Error

If you see this error in the browser console:

```
[GSI_LOGGER]: The given origin is not allowed for the given client ID.
```

**Fix:**

* Open VS Code Settings
* Go to **Live Server Config → Host**
* Change it from default to:

```
localhost
```

4. Add your Client ID to `.env`

---

## 📊 Database Tables

* Vendors
* Products
* Purchase Orders
* PO Items (junction table)

---

## 🧠 How it Works

* Vendors & Products are fetched from backend
* User creates a Purchase Order
* Items are stored in `po_items`
* Total is calculated with 5% tax
* Orders are displayed in the dashboard

---

## 📌 Future Improvements

* JWT-based route protection
* Vendor/Product UI management
* Order status update feature
* Deployment (Render / Vercel / Railway)

---

## 👨‍💻 Author

**Kushal Pandey**

---

## ⭐ If you like this project

Give it a star on GitHub ⭐
