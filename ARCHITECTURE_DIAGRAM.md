# Architecture Diagram: Manual Creation Flow

## Component Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         App.jsx                              │
│                    (Route Configuration)                     │
└──────────────┬──────────────────────────────┬────────────────┘
               │                              │
               │                              │
    ┌──────────▼──────────┐        ┌─────────▼──────────┐
    │                     │        │                     │
    │    feeds.jsx        │        │  createmanual.jsx   │
    │                     │        │                     │
    │  - Display manuals  │        │  - Form for create  │
    │  - Filter/Sort      │        │  - Validation       │
    │  - "Create" button  │        │  - Submit logic     │
    │                     │        │  - Success message  │
    └──────────┬──────────┘        └─────────┬──────────┘
               │                              │
               │  navigate('/create-manual')  │
               └──────────────────────────────┘
                              │
                              │
                    ┌─────────▼─────────┐
                    │                   │
                    │  manualdata.jsx   │
                    │                   │
                    │  - addManual()    │
                    │  - getApproved()  │
                    │  - getPending()   │
                    │                   │
                    └─────────┬─────────┘
                              │
                              │
                    ┌─────────▼─────────┐
                    │                   │
                    │   localStorage    │
                    │                   │
                    │  "manuals" key    │
                    │                   │
                    └───────────────────┘
```

## User Flow Diagram

```
┌──────────────┐
│   User on    │
│  Feeds Page  │
└──────┬───────┘
       │
       │ Clicks "Create Manual"
       │
       ▼
┌──────────────┐           ┌──────────────┐
│ Authenticated│   NO      │ Login Page   │
│     User?    ├──────────►│              │
└──────┬───────┘           └──────────────┘
       │ YES
       │
       ▼
┌──────────────┐
│ Create Manual│
│     Page     │
│              │
│ - Fill form  │
│ - Validate   │
│ - Submit     │
└──────┬───────┘
       │
       ├─────────────────┬─────────────────┐
       │                 │                 │
       ▼                 ▼                 ▼
┌──────────┐      ┌──────────┐     ┌──────────┐
│  Admin   │      │ Regular  │     │ Validation│
│  User?   │      │  User?   │     │  Error?  │
└────┬─────┘      └────┬─────┘     └────┬─────┘
     │ YES             │ YES             │ YES
     │                 │                 │
     ▼                 ▼                 ▼
┌────────────┐   ┌────────────┐   ┌──────────┐
│   Status:  │   │   Status:  │   │  Show    │
│ "approved" │   │ "pending"  │   │  Error   │
└─────┬──────┘   └─────┬──────┘   └──────────┘
      │                │
      │                │
      ▼                ▼
┌────────────────────────────────┐
│   Manual saved to localStorage │
└────────────┬───────────────────┘
             │
             ▼
┌────────────────────────────────┐
│     Success Message Display    │
└────────────┬───────────────────┘
             │
             │ After 2 seconds
             ▼
┌────────────────────────────────┐
│   Navigate back to Feeds       │
└────────────────────────────────┘
```

## Admin Approval Flow

```
┌──────────────┐
│  Regular     │
│  User        │
│  Submits     │
└──────┬───────┘
       │
       ▼
┌────────────────┐
│  Manual saved  │
│  status:       │
│  "pending"     │
└──────┬─────────┘
       │
       ▼
┌────────────────┐
│  Admin logs    │
│  into          │
│  Dashboard     │
└──────┬─────────┘
       │
       ▼
┌────────────────┐
│  "Pending      │
│  Manuals"      │
│  section       │
│  visible       │
└──────┬─────────┘
       │
       ├──────────────┬───────────────┐
       │              │               │
       ▼              ▼               ▼
┌──────────┐   ┌──────────┐    ┌──────────┐
│  Admin   │   │  Admin   │    │  Admin   │
│  Approves│   │  Rejects │    │  Views   │
└────┬─────┘   └────┬─────┘    └──────────┘
     │              │
     ▼              ▼
┌──────────┐   ┌──────────┐
│  Status: │   │  Status: │
│"approved"│   │"rejected"│
└────┬─────┘   └────┬─────┘
     │              │
     ▼              ▼
┌──────────┐   ┌──────────┐
│ Appears  │   │  Hidden  │
│ in Feeds │   │  from    │
│          │   │  Feeds   │
└──────────┘   └──────────┘
```

## File Dependencies

```
createmanual.jsx
    │
    ├─► manualdata.jsx (import addManual)
    │
    ├─► createmanual.css (import styles)
    │
    ├─► react-router-dom (useNavigate)
    │
    └─► react-bootstrap (Container, Row, Col, Card, Form, Button, Alert)


feeds.jsx
    │
    ├─► manualdata.jsx (import getApprovedManuals)
    │
    ├─► feeds.css (import styles)
    │
    ├─► react-router-dom (useNavigate)
    │
    └─► react-bootstrap (Button, Dropdown)


dashboard.jsx
    │
    ├─► manualdata.jsx (import getPendingManuals, approveManual, rejectManual)
    │
    ├─► dashboard.css (import styles)
    │
    └─► react-bootstrap (Container, Row, Col, Card, Table, Button, Modal, Form, Alert, Badge)
```

## Route Structure

```
App.jsx Routes:
    /
    ├─ /home
    ├─ /feeds ──────────┐
    ├─ /feedback        │
    ├─ /login           │
    ├─ /manual/:id      │
    ├─ /create-manual ◄─┘ (NEW ROUTE)
    ├─ /dashboard
    ├─ /profile
    └─ /* (redirect to /home)
```

## State Management Flow

```
createmanual.jsx State:
    ┌─────────────────┐
    │ currentUser     │ ◄── localStorage.getItem("currentUser")
    ├─────────────────┤
    │ newManual       │ ◄── Form inputs
    │  - title        │
    │  - description  │
    │  - category     │
    │  - tags         │
    │  - fileSize     │
    │  - pages        │
    ├─────────────────┤
    │ alertMessage    │ ◄── Validation/Success messages
    └─────────────────┘
             │
             │ On Submit
             ▼
    ┌─────────────────┐
    │ addManual()     │ ──► localStorage.setItem("manuals", ...)
    └─────────────────┘
```

## CSS Architecture

```
createmanual.css
    │
    ├─ Layout
    │   ├─ .create-manual-container
    │   ├─ .create-manual-card
    │   └─ .form-actions
    │
    ├─ Form Elements
    │   ├─ .form-input
    │   ├─ .form-label
    │   └─ .required
    │
    ├─ Buttons
    │   ├─ .cancel-btn
    │   └─ .submit-btn
    │
    ├─ Alerts
    │   ├─ .alert-danger
    │   ├─ .alert-success
    │   └─ .alert-info
    │
    └─ Responsive
        ├─ @media (max-width: 768px)
        └─ @media (max-width: 576px)
```

## Key Features

### ✅ Authentication

- Checks localStorage for currentUser
- Redirects to /login if not authenticated

### ✅ Role-Based Behavior

- Admin: status = "approved" (published immediately)
- User: status = "pending" (awaits approval)

### ✅ Form Validation

- Title required
- Description required
- Shows error alert if validation fails

### ✅ Success Flow

- Shows success message
- Auto-redirects to /feeds after 2 seconds
- Resets form after submission

### ✅ Responsive Design

- Mobile-first approach
- Breakpoints at 768px and 576px
- Stacked buttons on mobile
- Full-width inputs on mobile
