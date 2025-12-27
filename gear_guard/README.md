# 🛠️ GearGuard - Ultimate Maintenance Tracker

<div align="center">

![GearGuard Logo](https://img.shields.io/badge/GearGuard-Maintenance%20Tracker-714B67?style=for-the-badge&logo=tools&logoColor=white)

**An enterprise-grade maintenance management system built with Next.js, Prisma, and PostgreSQL**

[![Next.js](https://img.shields.io/badge/Next.js-16.1-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-NeonDB-336791?style=flat-square&logo=postgresql)](https://neon.tech/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [Architecture](#-architecture) • [Screenshots](#-screenshots)

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Database Schema](#-database-schema)
- [Request Lifecycle](#-request-lifecycle)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Usage](#-usage)
- [API Reference](#-api-reference)
- [Project Structure](#-project-structure)
- [Role-Based Access Control](#-role-based-access-control)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

**GearGuard** is a comprehensive maintenance management system designed for companies to track assets (machines, vehicles, computers) and coordinate maintenance requests across specialized teams. Built with modern web technologies, it provides an **Odoo-inspired** interface with robust RBAC (Role-Based Access Control).

### Key Objectives

- 🏢 Centralized equipment database with detailed tracking
- 👥 Team-based maintenance coordination
- 📋 Complete request lifecycle management (New → In Progress → Repaired/Scrap)
- 📅 Calendar view for preventive maintenance scheduling
- 📊 Real-time dashboards and analytics
- 🔐 Secure role-based access control

### System Overview Mindmap

```mermaid
mindmap
  root((GearGuard))
    Equipment
      Asset Database
      Search & Filter
      Smart Buttons
      Status Tracking
    Teams
      Specialized Units
      Workload Charts
      Member Management
    Maintenance
      Corrective
      Preventive
      Kanban Workflow
      Calendar Scheduling
    Automation
      Auto-fill Logic
      Scrap Detection
      Email Alerts
      Role Filtering
    Security
      JWT Auth
      RBAC
      Middleware
      Server Validation
```

---

## ✨ Features

### 🔧 Equipment Management
- ✅ Comprehensive asset database (Name, Serial, Department, Location, Warranty)
- ✅ Real-time search and filtering
- ✅ Smart buttons for related maintenance requests
- ✅ Equipment detail pages with maintenance history
- ✅ Status tracking (Active, Under Maintenance, Scrapped)

### 👥 Team Management
- ✅ Specialized maintenance teams (Mechanics, IT Support, Electrical, Facility)
- ✅ Team member assignment
- ✅ Workload distribution visualization
- ✅ Manager-only access control

### 📋 Maintenance Requests
- ✅ **Two Request Types**:
  - 🔴 **Corrective** - Emergency breakdowns
  - 🔵 **Preventive** - Scheduled routine maintenance
- ✅ **Four Stage Lifecycle**: NEW → IN_PROGRESS → REPAIRED → SCRAP
- ✅ Priority levels (Low, Medium, High, Critical)
- ✅ Technician assignment and email notifications
- ✅ Time tracking (duration logging)
- ✅ Overdue indicators
- ✅ Automatic team auto-fill from equipment

### 📊 Views & Dashboards
- ✅ **Kanban Board**: Visual workflow with drag-to-change stage
- ✅ **Calendar View**: Monthly schedule for preventive maintenance
- ✅ **Dashboard**: Team workload and request type charts
- ✅ **Equipment Detail**: Smart button with filtered request list

### 🚀 Smart Automation
- ✅ **Auto-Fill**: Equipment selection auto-populates maintenance team
- ✅ **Scrap Logic**: Moving request to SCRAP automatically marks equipment as SCRAPPED
- ✅ **Email Notifications**: Instant alerts when technicians are assigned
- ✅ **Smart Filtering**: Technicians only see their team's requests

### Team Workflow Diagram

```mermaid
flowchart LR
    subgraph Manager
        M1[Create Equipment]
        M2[Assign to Team]
        M3[Create Request]
        M4[Assign Technician]
    end
    
    subgraph Team
        T1[Receive Assignment]
        T2[View Team Requests]
        T3[Pick Up Work]
    end
    
    subgraph Technician
        Tech1[See Assigned Work]
        Tech2[Move to In Progress]
        Tech3[Log Time]
        Tech4[Complete Repair]
    end
    
    M1 --> M2
    M2 --> M3
    M3 --> M4
    M4 --> T1
    T1 --> T2
    T2 --> T3
    T3 --> Tech1
    Tech1 --> Tech2
    Tech2 --> Tech3
    Tech3 --> Tech4
    
    style M1 fill:#714B67,color:#fff
    style M2 fill:#714B67,color:#fff
    style T3 fill:#8B5A7D,color:#fff
    style Tech2 fill:#9370DB,color:#fff
```

### 🔐 Security
- ✅ JWT-based authentication (httpOnly cookies)
- ✅ Role-based access control (Manager, Technician, Employee)
- ✅ Protected routes via Next.js middleware
- ✅ Server-side permission validation

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16.1.1 (App Router + Turbopack)
- **Styling**: Tailwind CSS 4.0 (Odoo-inspired purple theme)
- **Icons**: Lucide React
- **Charts**: Recharts
- **Forms**: React Hook Form (implicit via server actions)
- **Date Handling**: date-fns
- **Utilities**: clsx, tailwind-merge

### Backend
- **Runtime**: Next.js Server Actions
- **Database**: PostgreSQL (NeonDB serverless)
- **ORM**: Prisma 5.22
- **Authentication**: jose (JWT)
- **Password Hashing**: bcryptjs
- **Email**: nodemailer

### Development
- **Language**: JavaScript (ES6+)
- **Package Manager**: npm
- **Version Control**: Git
- **Linting**: ESLint (Next.js config)

### Technology Stack Visualization

```mermaid
graph LR
    subgraph Frontend
        A[Next.js 16] --> B[React Components]
        B --> C[Tailwind CSS]
        B --> D[Lucide Icons]
        B --> E[Recharts]
    end
    
    subgraph Backend
        F[Server Actions] --> G[Prisma ORM]
        F --> H[NextAuth/jose]
        F --> I[Nodemailer]
        G --> J[(PostgreSQL)]
    end
    
    subgraph DevTools
        K[ESLint]
        L[Turbopack]
        M[Git]
    end
    
    B --> F
    
    style A fill:#000,color:#fff
    style C fill:#38B2AC,color:#fff
    style G fill:#2D3748,color:#fff
    style J fill:#336791,color:#fff
```

### Authentication Flow

```mermaid
sequenceDiagram
    participant U as User
    participant L as Login Page
    participant SA as Server Action
    participant DB as Database
    participant M as Middleware
    
    U->>L: Enter credentials
    L->>SA: Call login()
    SA->>DB: Verify email/password
    DB-->>SA: User found
    SA->>SA: Generate JWT token
    SA-->>L: Set httpOnly cookie
    L-->>U: Redirect to dashboard
    
    Note over U,M: Subsequent Requests
    
    U->>M: Navigate to /equipment
    M->>M: Verify JWT cookie
    alt Valid Token
        M-->>U: Allow access
    else Invalid/Expired
        M-->>U: Redirect to /login
    end
```

---

## 🏗️ System Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        UI[Next.js App Router]
        Components[React Components]
        Layouts[Layouts & Sidebar]
    end

    subgraph "Server Layer"
        SA[Server Actions]
        Middleware[Auth Middleware]
        API[Implicit API Routes]
    end

    subgraph "Data Layer"
        Prisma[Prisma ORM]
        DB[(PostgreSQL/NeonDB)]
    end

    subgraph "External Services"
        Email[Nodemailer/SMTP]
    end

    UI --> Components
    Components --> Layouts
    Components --> SA
    SA --> Middleware
    Middleware --> Prisma
    Prisma --> DB
    SA --> Email

    style UI fill:#714B67,color:#fff
    style Components fill:#8B5A7D,color:#fff
    style SA fill:#9370DB,color:#fff
    style Prisma fill:#2D3748,color:#fff
    style DB fill:#336791,color:#fff
```

### Request Flow

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant Middleware
    participant ServerAction
    participant Prisma
    participant Database

    User->>Browser: Navigate to /maintenance
    Browser->>Middleware: Check authentication
    Middleware->>Middleware: Verify JWT token
    Middleware-->>Browser: Allow (redirect if unauthorized)
    Browser->>ServerAction: Call getRequests()
    ServerAction->>ServerAction: Check user role
    ServerAction->>Prisma: findMany with filters
    Prisma->>Database: SELECT * FROM MaintenanceRequest WHERE...
    Database-->>Prisma: Return rows
    Prisma-->>ServerAction: Return data
    ServerAction-->>Browser: Return { data, success }
    Browser->>User: Render Kanban Board
```

---

## 🗄️ Database Schema

```mermaid
erDiagram
    User ||--o{ Equipment : "assigned to"
    User ||--o{ MaintenanceRequest : "technician"
    User }o--|| Team : "member of"
    Team ||--o{ Equipment : "maintains"
    Team ||--o{ MaintenanceRequest : "responsible for"
    Equipment ||--o{ MaintenanceRequest : "has requests"

    User {
        string id PK
        string email UK
        string name
        string password
        enum role
        string teamId FK
        timestamp createdAt
        timestamp updatedAt
    }

    Team {
        string id PK
        string name UK
        timestamp createdAt
        timestamp updatedAt
    }

    Equipment {
        string id PK
        string name
        string serialNumber UK
        string department
        string location
        enum status
        date purchaseDate
        date warrantyExpiration
        string maintenanceTeamId FK
        string assignedToUserId FK
        timestamp createdAt
        timestamp updatedAt
    }

    MaintenanceRequest {
        string id PK
        string subject
        string description
        enum type
        enum priority
        enum stage
        string equipmentId FK
        string teamId FK
        string technicianId FK
        datetime scheduledDate
        datetime startedAt
        datetime completedAt
        float durationHours
        timestamp createdAt
        timestamp updatedAt
    }
```

### Enums

| Enum | Values |
|------|--------|
| **Role** | MANAGER, TECHNICIAN, EMPLOYEE |
| **EquipmentStatus** | ACTIVE, UNDER_MAINTENANCE, SCRAPPED |
| **MaintenanceType** | CORRECTIVE, PREVENTIVE |
| **RequestStage** | NEW, IN_PROGRESS, REPAIRED, SCRAP |
| **RequestPriority** | LOW, MEDIUM, HIGH, CRITICAL |

---

## 🔄 Request Lifecycle

```mermaid
stateDiagram-v2
    [*] --> NEW: Request Created
    NEW --> IN_PROGRESS: Technician Assigned
    IN_PROGRESS --> REPAIRED: Work Completed
    IN_PROGRESS --> SCRAP: Irreparable
    REPAIRED --> [*]
    SCRAP --> [*]: Equipment Scrapped

    NEW: 🆕 NEW\n(Awaiting Assignment)
    IN_PROGRESS: ⚙️ IN PROGRESS\n(Active Work)
    REPAIRED: ✅ REPAIRED\n(Job Complete)
    SCRAP: 🗑️ SCRAP\n(Equipment Scrapped)
```

### Workflow Details

1. **NEW**: Request created, awaiting technician assignment
2. **IN_PROGRESS**: Technician working on the issue
   - Time tracking active
   - Can log hours spent
3. **REPAIRED**: Work completed successfully
   - Equipment returns to ACTIVE
   - Request archived
4. **SCRAP**: Equipment beyond repair
   - **Automation**: Equipment status → SCRAPPED
   - Triggers procurement workflow

### Smart Automation Flows

```mermaid
flowchart TD
    A[User Selects Equipment] --> B{Auto-Fill Team}
    B --> C[Equipment.maintenanceTeamId]
    C --> D[Pre-fill Request.teamId]
    
    E[Request Moved to SCRAP] --> F{Scrap Automation}
    F --> G[Update Equipment.status]
    G --> H[Status = SCRAPPED]
    H --> I[Red Badge on Equipment]
    
    J[Request Created with Technician] --> K{Email Notification}
    K --> L[Get Technician Email]
    L --> M[Send via Nodemailer]
    M --> N[Technician Receives Alert]
    
    O[Technician Logs In] --> P{Smart Filtering}
    P --> Q[Check User.teamId]
    Q --> R[Filter Requests]
    R --> S[Show Only Team Requests]
    
    style B fill:#714B67,color:#fff
    style F fill:#714B67,color:#fff
    style K fill:#714B67,color:#fff
    style P fill:#714B67,color:#fff
```

### User Journey Map

```mermaid
journey
    title Equipment Breakdown to Repair Journey
    section Discovery
      Equipment breaks down: 1: Employee
      Create request: 3: Employee
    section Assignment
      Review new requests: 4: Manager
      Assign to technician: 5: Manager
      Receive email alert: 4: Technician
    section Execution
      Login to dashboard: 5: Technician
      View team requests: 5: Technician
      Move to In Progress: 5: Technician
      Perform repair: 3: Technician
      Log time spent: 4: Technician
      Mark as repaired: 5: Technician
    section Completion
      Equipment back online: 5: Employee
      View dashboard stats: 5: Manager
```

---

## 📥 Installation

### Prerequisites

- Node.js 18+ 
- PostgreSQL database (or NeonDB account)
- npm or yarn

### Step 1: Clone Repository

```bash
git clone https://github.com/yourusername/gearguard.git
cd gearguard
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Environment Setup

Create `.env` file in project root:

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"

# Authentication
JWT_SECRET="your-super-secret-jwt-key-change-in-production"

# Email (Optional)
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-specific-password"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Step 4: Database Setup

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed database (optional - adds sample data)
node -r dotenv/config prisma/seed.js
```

### Step 5: Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🚀

---

## 🔐 Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string | ✅ Yes | - |
| `JWT_SECRET` | Secret key for JWT tokens | ✅ Yes | - |
| `EMAIL_USER` | SMTP email address | ❌ No | Mock emails in console |
| `EMAIL_PASS` | SMTP password/app password | ❌ No | Mock emails in console |
| `NEXT_PUBLIC_APP_URL` | Frontend URL (for emails) | ❌ No | `http://localhost:3000` |

---

## 🚀 Usage

### Default Test Accounts

After running the seed script:

| Email | Password | Role | Team |
|-------|----------|------|------|
| `admin@gearguard.com` | `password123` | MANAGER | - |
| `alice@gearguard.com` | `password123` | TECHNICIAN | Mechanics |
| `eve@gearguard.com` | `password123` | TECHNICIAN | IT Support |
| `charlie@gearguard.com` | `password123` | TECHNICIAN | Electrical |

### Quick Start Workflow

```mermaid
flowchart TD
    Start([Start]) --> Login[Login as Manager]
    Login --> CreateEq[Create Equipment]
    CreateEq --> CreateReq[Create Request]
    CreateReq --> AutoFill{Auto-fill Team}
    AutoFill --> AssignTech[Assign Technician]
    AssignTech --> Logout1[Logout]
    Logout1 --> LoginTech[Login as Technician]
    LoginTech --> ViewFiltered[View Filtered Requests]
    ViewFiltered --> MoveStage[Move to IN_PROGRESS]
    MoveStage --> LogTime[Log Time]
    LogTime --> Complete[Mark REPAIRED]
    Complete --> End([Done])
    
    style Login fill:#714B67,color:#fff
    style AutoFill fill:#714B67,color:#fff
    style Complete fill:#22c55e,color:#fff
```

1. **Login** as Manager (`admin@gearguard.com`)
2. **Navigate** to Equipment → Create new equipment
3. **Go to** Maintenance → Create a maintenance request
4. **Select** the equipment → Team auto-fills
5. **Assign** a technician
6. **Logout** and login as the technician
7. **View** the filtered request (only your team's work)
8. **Move** request through stages (NEW → IN_PROGRESS → REPAIRED)
9. **Log time** spent on the repair

---

## 📡 API Reference

### Server Actions

All API interactions use Next.js Server Actions located in `server/actions/`.

#### Equipment Actions

```javascript
// server/actions/equipment.js
getEquipmentList(filters)      // Get all equipment
getEquipmentById(id)           // Get single equipment
createEquipment(data)          // Create new equipment (Manager only)
updateEquipment(id, data)      // Update equipment (Manager only)
```

#### Request Actions

```javascript
// server/actions/requests.js
getRequests(filters)           // Get requests (role-filtered)
createRequest(data)            // Create new request
updateRequestStage(id, stage)  // Change request stage
updateRequestDuration(id, hrs) // Log time spent
getDashboardStats()            // Get analytics data
```

#### Team Actions

```javascript
// server/actions/teams.js
getTeams()                     // Get all teams
getTeamDetails(id)             // Get team with members
```

#### Auth Actions

```javascript
// server/actions/auth.js
login(formData)                // Authenticate user
signup(formData)               // Register new user
logout()                       // Clear session
getSession()                   // Get current user
```

---

## 📁 Project Structure

```
gear_guard/
├── app/
│   ├── (auth)/
│   │   ├── login/              # Login page
│   │   └── signup/             # Registration page
│   ├── (dashboard)/
│   │   ├── page.jsx            # Dashboard (charts)
│   │   ├── equipment/          # Equipment module
│   │   │   ├── page.jsx        # Equipment list
│   │   │   └── [id]/           # Equipment detail
│   │   ├── teams/              # Teams (Manager only)
│   │   ├── maintenance/        # Kanban board
│   │   └── calendar/           # Calendar view
│   ├── layout.tsx              # Root layout
│   └── globals.css             # Tailwind styles
├── components/
│   ├── layout/
│   │   ├── AppSidebar.jsx      # Main navigation
│   │   └── AppHeader.jsx       # Page header
│   ├── equipment/
│   │   ├── EquipmentActions.jsx
│   │   └── EquipmentSearch.jsx
│   ├── maintenance/
│   │   ├── KanbanBoard.jsx
│   │   ├── CreateRequestButton.jsx
│   │   ├── LogTimeModal.jsx
│   │   └── MaintenanceCalendar.jsx
│   └── dashboard/
│       └── DashboardCharts.jsx
├── server/
│   └── actions/
│       ├── auth.js             # Authentication
│       ├── equipment.js        # Equipment CRUD
│       ├── requests.js         # Request management
│       └── teams.js            # Team operations
├── lib/
│   ├── prisma.js               # Prisma client
│   ├── email.js                # Email utility
│   └── utils.js                # Helper functions
├── prisma/
│   ├── schema.prisma           # Database schema
│   ├── seed.js                 # Seed script
│   └── migrations/             # DB migrations
├── middleware.js               # Auth middleware
├── tailwind.config.js          # Tailwind config
└── package.json
```

---

## 🔐 Role-Based Access Control

```mermaid
graph TD
    subgraph "MANAGER (Admin)"
        M1[View All Equipment]
        M2[Create/Edit Equipment]
        M3[View All Teams]
        M4[View All Requests]
        M5[Assign Any Technician]
        M6[Full Dashboard Access]
    end

    subgraph "TECHNICIAN"
        T1[View Equipment Read-Only]
        T2[View Team Requests Only]
        T3[Update Assigned Requests]
        T4[Log Time on Work]
        T5[No Team Management]
    end

    subgraph "EMPLOYEE"
        E1[View Equipment]
        E2[Create Requests]
        E3[View Own Requests]
        E4[Limited Dashboard]
    end

    style M1 fill:#714B67,color:#fff
    style M2 fill:#714B67,color:#fff
    style M3 fill:#714B67,color:#fff
    style T1 fill:#8B5A7D,color:#fff
    style T2 fill:#8B5A7D,color:#fff
    style E1 fill:#9370DB,color:#fff
```

### Permission Matrix

| Feature | Manager | Technician | Employee |
|---------|---------|------------|----------|
| View Equipment | ✅ Full | ✅ Read-Only | ✅ Read-Only |
| Create Equipment | ✅ Yes | ❌ No | ❌ No |
| Edit Equipment | ✅ Yes | ❌ No | ❌ No |
| View Teams | ✅ Yes | ❌ No | ❌ No |
| View Requests | ✅ All Teams | ✅ Own Team Only | ✅ Own Only |
| Create Requests | ✅ Yes | ✅ Yes | ✅ Yes |
| Assign Technician | ✅ Any | ✅ Self Only | ❌ No |
| Update Stage | ✅ Any | ✅ Team Requests | ❌ No |
| Log Time | ✅ Yes | ✅ Yes | ❌ No |
| Dashboard Charts | ✅ Full | ✅ Team Stats | ✅ Basic |

---

## 📸 Screenshots

### Dashboard
![Dashboard](https://via.placeholder.com/800x400/714B67/FFFFFF?text=Dashboard+with+Charts)

### Kanban Board
![Kanban](https://via.placeholder.com/800x400/8B5A7D/FFFFFF?text=Maintenance+Kanban+Board)

### Equipment List
![Equipment](https://via.placeholder.com/800x400/9370DB/FFFFFF?text=Equipment+Management)

### Calendar View
![Calendar](https://via.placeholder.com/800x400/714B67/FFFFFF?text=Preventive+Maintenance+Calendar)

---

## 🚀 Deployment

### Deployment Architecture

```mermaid
graph TB
    subgraph "Production Environment"
        subgraph "Frontend - Vercel"
            V[Vercel Edge Network]
            N[Next.js App]
        end
        
        subgraph "Database - NeonDB"
            NDB[(PostgreSQL)]
            Rep[(Read Replicas)]
        end
        
        subgraph "Email - SMTP"
            SMTP[Gmail/SendGrid]
        end
    end
    
    subgraph "CI/CD"
        GH[GitHub]
        Actions[GitHub Actions]
    end
    
    Users[Users] --> V
    V --> N
    N --> NDB
    N --> Rep
    N --> SMTP
    
    GH --> Actions
    Actions --> V
    Actions --> NDB
    
    style V fill:#000,color:#fff
    style NDB fill:#336791,color:#fff
    style SMTP fill:#EA4335,color:#fff
```

### Deployment Steps

```mermaid
flowchart LR
    A[Push to GitHub] --> B[Run Tests]
    B --> C{Tests Pass?}
    C -->|Yes| D[Build Production]
    C -->|No| E[Notify Developer]
    D --> F[Deploy to Vercel]
    F --> G[Run Migrations]
    G --> H[Health Check]
    H --> I{Healthy?}
    I -->|Yes| J[Go Live]
    I -->|No| K[Rollback]
    
    style J fill:#22c55e,color:#fff
    style K fill:#ef4444,color:#fff
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation for new features
- Test thoroughly before submitting PRs

---

## 🐛 Known Issues & Roadmap

### Known Issues
- Drag-and-drop for Kanban (currently using dropdown - future enhancement)
- Calendar click-to-create (view-only currently)

### Roadmap
- [ ] Real-time updates (WebSockets)
- [ ] Mobile app (React Native)
- [ ] Document attachments for requests
- [ ] Advanced reporting & analytics
- [ ] Multi-language support
- [ ] Barcode/QR code scanner for equipment
- [ ] Integration with IoT sensors

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Next.js** team for the amazing framework
- **Prisma** for the excellent ORM
- **Tailwind CSS** for utility-first styling
- **Odoo** for design inspiration
- **NeonDB** for serverless PostgreSQL

---

## 📞 Support

For issues, questions, or suggestions:

- 📧 Email: support@gearguard.com
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/gearguard/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/yourusername/gearguard/discussions)

---

<div align="center">

**Built with ❤️ using Next.js, Prisma, and Modern Web Technologies**

⭐ **Star this repo if you find it helpful!** ⭐

</div>
