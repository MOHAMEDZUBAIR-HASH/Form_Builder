# Dynamic Form Builder & Scalable Form Submission System

 platform built with **React.js, Redux Toolkit, Node.js, Express.js, MongoDB Atlas / Local MongoDB, and Tailwind CSS**.

This project provides a complete dynamic form studio for administrators to construct, publish, and inspect forms, as well as an accessible, login-free portal for public respondents with human-readable URL slugs and real-time file/image uploads.

---


## 🚀 Key Features & Highlights

### 1. Admin Form Builder Studio
- **Streamlined Setup:** Minimal metadata configuration (Form Title and Form Description).
- **Auto-Generated URL Slugs:** Creating a form automatically generates a URL-friendly slug (e.g., `Job Application 2026` ➔ `/forms/job-application-2026`).
- **Comprehensive Field Types Supported:**
  - `TEXT` (Single Line Text)
  - `EMAIL` (Format validated email)
  - `NUMBER` (Numeric values, age, quantities)
  - `PHONE` (International & local phone format)
  - `TEXTAREA` (Multi-line text responses)
  - `DATE` (Date picker)
  - `SELECT` (Dropdown menu)
  - `RADIO` (Single select choice list with dynamic option generator)
  - `CHECKBOX` (Multi-select options)
  - `FILE / IMAGE` (Uploaded straight to disk storage with live image preview)
- **Interactive Options Builder:** Dedicated `+ Add Option` button for radio, dropdown, and checkbox fields with instant reordering and deletion.
- **Workflow Control:** Save as `Draft` or `Published`.

### 2. Public Visitor Experience (Zero Login Required)
- **Public Directory (`/`):** Any visitor can view available published forms without an account or login.
- **Human-Readable Form Route (/forms/:slug):** Clean URL access with dynamic field rendering driven strictly by database definitions.
- **Zero Frontend Hardcoding:** Adding or updating fields in the database instantly updates the form without requiring code changes to the React client.

### 3. File & Image Upload System
- Dedicated `POST /api/upload` endpoint powered by `multer`.
- Stores files in `backend/uploads/` with sanitized, collision-resistant unique timestamps (e.g., `resume-179549-3819.pdf`).
- Statically served via `http://localhost:5000/uploads/...`.
- In submissions, images render with live thumbnail previews and direct download links.

### 4. Admin Submission Management (Strictly Read-Only)
- **Paginated Stream:** Admin inspection of all user submissions with pagination controls.
- **Read-Only Audit Trail:** Form responses cannot be edited or altered by any user or administrator, preserving data integrity.
- **Metadata Auditing:** Captures client `ipAddress`, `userAgent`, and exact `submittedAt` timestamps.
- **JSON Export:** One-click export of submissions to formatted JSON.

### 5. Enterprise Security
- **Bcrypt (10 Salt Rounds):** Passwords hashed with salt rounds before database persistence.
- **JWT Stored in HttpOnly Secure Cookie:** Named `form_builder_admin_token`, immune to JavaScript XSS theft.
- **Independent Backend Validation:** Validates required constraints, regex patterns, email formats, and allowed option values server-side.
- **Rate Limiting:** Protects the API with `express-rate-limit`.
- **Security Headers:** Hardened with `helmet` and custom `crossOriginResourcePolicy`.

---

## 📁 file structure

```
├── backend/
│   ├── src/
│   │   ├── config/              # MongoDB connection & server configuration
│   │   │   └── db.js
│   │   ├── controllers/         # Business logic layer
│   │   │   ├── authController.js       # Admin authentication & cookie issuance
│   │   │   ├── formController.js       # Form schema CRUD & slug resolver
│   │   │   └── submissionController.js # Read-only submission stream
│   │   ├── middlewares/         # Middlewares (Auth, Error handling, Multer)
│   │   │   ├── auth.js                 # HttpOnly cookie JWT validation & RBAC
│   │   │   ├── errorHandler.js         # Centralized error handler
│   │   │   └── upload.js               # Multer file/image storage configuration
│   │   ├── models/              # Indexed Mongoose schemas
│   │   │   ├── Form.js                 # Form definition, fields & auto-slug
│   │   │   ├── Submission.js           # Submissions with metadata & compound index
│   │   │   └── User.js                 # User schema with bcrypt pre-save hook
│   │   ├── routes/              # Modular Express routing
│   │   │   ├── authRoutes.js           # /api/auth
│   │   │   ├── formRoutes.js           # /api/forms
│   │   │   ├── submissionRoutes.js     # /api/submissions
│   │   │   └── uploadRoutes.js         # /api/upload
│   │   ├── scripts/             # CLI & maintenance scripts
│   │   │   └── seedAdmin.js            # Default admin seeder
│   │   ├── validations/         # Dynamic validation engine
│   │   │   └── dynamicValidator.js     # Strict independent validation
│   │   ├── app.js               # Express application config & static routes
│   │   └── server.js            # Server entrypoint with unhandledRejection catch
│   ├── uploads/                 # Local uploaded files storage directory
│   ├── .env                     # Local/Atlas environment variables
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/          # Reusable UI primitives (Button, Input, Modal)
│   │   │   ├── formBuilder/     # Builder components (AddFieldMenu, FormFieldsList, EditFieldPanel)
│   │   │   ├── formRenderer/    # Dynamic field dispatcher (DynamicField)
│   │   │   ├── Navbar.jsx       # Universal responsive navbar
│   │   │   └── ProtectedRoute.jsx # Client-side route guard
│   │   ├── pages/               # Top-level view routes
│   │   │   ├── FormBuilderPage.jsx     # Modern 3-column Form Studio
│   │   │   ├── FormListPage.jsx        # Admin dashboard table with pagination
│   │   │   ├── LoginPage.jsx           # Admin login & registration portal
│   │   │   ├── PublicFormPage.jsx      # Public respondent view (/forms/:slug)
│   │   │   ├── SubmissionsPage.jsx     # Read-only audit viewer
│   │   │   └── UserPortalPage.jsx      # Public directory homepage (/)
│   │   ├── redux/               # Redux Toolkit application state
│   │   │   ├── slices/
│   │   │   │   ├── authSlice.js        # Authentication & session tracking
│   │   │   │   ├── formBuilderSlice.js # Active builder form schema state
│   │   │   │   ├── formsSlice.js       # Admin forms list & pagination
│   │   │   │   └── submissionsSlice.js # Submission fetching & audit viewer
│   │   │   └── store.js         # Configured Redux store
│   │   ├── services/            # Axios API layer with withCredentials: true
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   └── formService.js
│   │   ├── App.jsx              # Client routing table
│   │   ├── main.jsx             # React DOM root with Provider & Router
│   │   └── index.css            # Tailwind CSS styling
│   ├── .env.example
│   ├── .env                     # Frontend environment variables
│   ├── vite.config.js
│   └── package.json
│
├── postman_collection.json      # Comprehensive Postman test collection
└── README.md                    # Project documentation
```

---

## ⚙️ Environment Variables & Configuration

### Backend: `backend/.env`
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://mohamedzubair001_db_user:Zubair12345@cluster0.jyywvhp.mongodb.net/dynamic_form_builder?retryWrites=true&w=majority
JWT_SECRET=666fa2a3635245d675e8130db2cf1168bb5b9da3ac26dccc879980feacb73a32b11347a99a275a5e1b4483463852802abcb469ae66d688f97ecc252b45b9dbba
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=500
```

> **Note on MongoDB URI:** Supports MongoDB Atlas or local MongoDB (`mongodb://127.0.0.1:27017/dynamic_form_builder`). Ensure Atlas has `0.0.0.0/0` whitelisted under **Network Access** for cloud connectivity.

### Frontend: `frontend/.env`
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 🏃 Getting Started (Step-by-Step)

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account or local MongoDB instance

### 1. Clone & Install Dependencies

```bash
# Clone the repository
git clone <your-repo-url>
cd <repo-folder>

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Seed Default Admin User
```bash
cd backend
npm run seed:admin
```

### 3. Run Development Servers

**Terminal 1 (Backend API):**
```bash
cd backend
npm run dev
# Server running at http://localhost:5000
```

**Terminal 2 (Frontend Client):**
```bash
cd frontend
npm run dev
# Vite client running at http://localhost:5173
```

---

## 🔑 Default Admin Credentials

> [!IMPORTANT]
> **Use the following pre-seeded credentials to log in as Administrator:**
> - **Username / Email:** `admin@dynamicforms.com`
> - **Password:** `password123`
> - **Role:** `admin`
> - **Cookie Name:** `form_builder_admin_token` (HttpOnly Secure Cookie)
>
> **Login URL:** [http://localhost:5173/admin/login](http://localhost:5173/admin/login)  
> *(Note: The frontend login form is already pre-filled with these credentials for 1-click sign in. You can also register a new admin account on the same page).*

| Credential Field | Value | Notes |
| :--- | :--- | :--- |
| **Email / Username** | `admin@dynamicforms.com` | Primary administrator account |
| **Password** | `password123` | Encrypted with BCrypt (10 salt rounds) |
| **Role** | `admin` | Full admin privileges (Create, Publish, Edit, View, Delete) |
| **Session Cookie** | `form_builder_admin_token` | Secure HttpOnly JWT session cookie (7 days expiry) |

---

## 🌐 Application Route Sitemap

| URL Path | Access Level | Description |
| :--- | :--- | :--- |
| `/` | **Public (No Login)** | Public Forms Directory showing all published forms |
| `/forms/:slug` | **Public (No Login)** | Dynamic form rendering & submission by clean slug |
| `/forms/:formId` | **Public (No Login)** | Backward-compatible access by database ID |
| `/admin/login` | **Public** | Admin authentication (sets HttpOnly cookie) |
| `/admin/forms` | **Admin Only** | Form management dashboard with search and pagination |
| `/admin/forms/new` | **Admin Only** | Interactive Form Studio workspace |
| `/admin/forms/:id/edit` | **Admin Only** | Form schema editor |
| `/admin/forms/:id/submissions` | **Admin Only** | Read-only submission inspection and JSON export |

---

## 📡 API Specification & Endpoints

### Authentication (`/api/auth`)
| Method | Endpoint | Access | Purpose |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new admin, set `form_builder_admin_token` cookie |
| `POST` | `/api/auth/login` | Public | Authenticate admin, set `form_builder_admin_token` cookie |
| `POST` | `/api/auth/logout` | Public | Clear admin session cookie |
| `GET` | `/api/auth/me` | Protected | Get current authenticated admin profile |

### Forms (`/api/forms`)
| Method | Endpoint | Access | Purpose |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/forms` | Protected | Create new form definition and generate unique slug |
| `GET` | `/api/forms` | Public | List forms with search, filter (`draft`/`published`), pagination |
| `GET` | `/api/forms/analytics/stats` | Protected | Aggregated form analytics via MongoDB Aggregation Pipeline (`$lookup`) |
| `GET` | `/api/forms/:identifier` | Public | Get form by either database `_id` or `slug` |
| `PUT` | `/api/forms/:id` | Protected | Update form title, description, or field schema |
| `DELETE` | `/api/forms/:id` | Protected | Delete form and cascade-delete its submissions |

### Submissions & Uploads (`/api/forms/:formId/submissions`, `/api/upload`)
| Method | Endpoint | Access | Purpose |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/upload` | Public | Upload file/image, saves to `uploads/` and returns URL path |
| `POST` | `/api/forms/:formId/submissions` | Public | Submit dynamic form data with strict backend validation |
| `GET` | `/api/forms/:formId/submissions` | Protected | Get paginated submissions for a specific form |
| `GET` | `/api/submissions/:id` | Protected | View single submission record with joined form schema via `$lookup` |
| `DELETE` | `/api/submissions/:id` | Protected | Delete single submission and decrement form counter |

---

## 🛡️ Validation Engine & Security Implementation

### Independent Backend Validation
The backend does **not** rely on frontend checks. All validation occurs in `backend/src/validations/dynamicValidator.js`:
- **Required Fields:** Ensures non-empty strings, numbers, or populated selection arrays.
- **Email Validation:** RFC-compliant regex checks.
- **Phone Validation:** Format validation allowing international formatting.
- **Numbers:** Type-casting with optional `min` and `max` constraints.
- **Option Constraints:** Confirms submitted options exist within the form's allowed choices.
- **File Validation:** Verifies storage path validity (`uploads/...`).

Failure produces a clean `422 Unprocessable Entity` response:
```json
{
  "success": false,
  "message": "Validation failed for one or more fields.",
  "errors": {
    "email": "Please provide a valid email address.",
    "experience": "Selected value is not a valid option."
  }
}
```
