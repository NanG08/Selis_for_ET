# Selis - Smart Financial Management Platform

AI-powered personal and business finance workspace with plan-aware dashboards, budgeting, transactions, goals, subscriptions, and assistant-guided insights powered by Google Gemini.

##  Project Overview

Selis is a comprehensive financial management platform designed to serve multiple user segments from individuals to enterprises. The platform adapts its interface, features, and AI assistance based on the selected plan, providing tailored financial insights and management tools.

##  Key Features

### Core Capabilities
- **Multi-Plan Architecture**: Supports 5 distinct user plans (Personal, Family, Freelancer, Small Business, Enterprise)
- **AI-Powered Assistant**: Gemini-based financial advisor with plan-specific guidance
- **Real-time Financial Tracking**: Transactions, budgets, goals, and subscriptions
- **Smart Insights**: Automated spending analysis, budget alerts, and goal tracking
- **Responsive Design**: Mobile-first UI with smooth animations and transitions

### Plan-Specific Features
- **Personal**: Spending discipline score, emergency fund tracker, subscription management
- **Family**: Kid allowance tracking, joint expense splitting, shared goals
- **Freelancer**: Cash flow gap detection, tax estimation, retirement planning, invoice management
- **Small Business**: Cash flow runway, GST tracking, vendor management, payroll
- **Enterprise**: Department budgets, policy enforcement, approval workflows, audit trails

##  Documentation Hub

Comprehensive documentation available in the [docs/](docs/) directory:

- **[Software Requirements Specification (SRS)](SRS.md)** - Complete system requirements and specifications
- **[Architecture Guide](docs/architecture.md)** - System design and technical architecture
- **[API Reference](docs/api-reference.md)** - Complete REST API documentation
- **[Workflow Guide](docs/workflows.md)** - User flows and feature workflows
- **[Design System](docs/design.md)** - UI/UX design principles and patterns
- **[Integration Guide](docs/integration-guide.md)** - Third-party integrations and setup
- **[Deployment Guide](docs/deployment-guide.md)** - Production deployment instructions

##  Tech Stack

### Frontend
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS 4 with custom design system
- **Charts**: Recharts for data visualization
- **Animation**: Motion (Framer Motion) for smooth transitions
- **Routing**: React Router DOM 7
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js with Express 4
- **Language**: TypeScript (ESM modules)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with bcryptjs password hashing
- **Security**: CORS, environment-based configuration

### AI & External Services
- **AI Model**: Google Gemini 3 Flash Preview via `@google/genai`
- **Geolocation**: Browser Geolocation API
- **Geocoding**: Nominatim (OpenStreetMap) reverse geocoding

## Project Layout

```text
Selis_for_ET/
  backend/
    server.ts
    lib/models.ts
  frontend/
    src/
      App.tsx
      components/
      lib/
  docs/
    README.md
    architecture.md
    design.md
    workflows.md
    api-reference.md
    integration-guide.md
    deployment-guide.md
```

##  Quick Start

### Prerequisites
- Node.js 22+ and npm 10+
- MongoDB instance (local or cloud)
- Google Gemini API key

### 1. Clone and Install

```bash
# Clone repository
git clone <repository-url>
cd Selis_for_ET

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Environment Configuration

Create `.env` file in project root:

```env
# Backend Configuration
BACKEND_PORT=3000
JWT_SECRET=your-secure-jwt-secret-key
MONGODB_URI=mongodb://localhost:27017/selis

# Frontend Configuration
VITE_API_URL=http://localhost:3000
VITE_GEMINI_API_KEY=your-gemini-api-key
```

### 3. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npx tsc -p tsconfig.json
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 4. Access Application

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3000/api`
- Health Check: `http://localhost:3000/api/health`

##  Project Structure

```
Selis_for_ET/
 backend/                 # Express backend server
    lib/
       models.ts       # Mongoose schemas
    server.ts           # Main server file
    package.json        # Backend dependencies
    tsconfig.json       # TypeScript config
 frontend/               # React frontend application
    src/
       components/     # React components
       lib/           # Utilities and API clients
       App.tsx        # Main app component
       main.tsx       # Entry point
    public/            # Static assets
    package.json       # Frontend dependencies
    vite.config.ts     # Vite configuration
 docs/                  # Documentation
 .env                   # Environment variables
 SRS.md                 # Software Requirements Specification
 README.md              # This file
```

##  Key Components

### Backend
- **server.ts**: Express server with REST API endpoints
- **models.ts**: MongoDB schemas for User, Transaction, Budget, Goal, Subscription

### Frontend
- **App.tsx**: Main routing and authentication logic
- **Layout.tsx**: Plan-aware navigation and layout
- **Dashboard.tsx**: Multi-plan dashboard with widgets
- **AIChat.tsx**: Gemini-powered financial assistant
- **TransactionList.tsx**: Transaction management with AI suggestions
- **BudgetBuilder.tsx**: Budget creation and tracking
- **GoalTracker.tsx**: Financial goal management
- **PlanFeature.tsx**: Plan-specific feature pages

##  Known Limitations

- Transaction delete endpoint not fully implemented (UI-only deletion)
- Invoice manager uses mock data (backend endpoints pending)
- No dedicated build script in backend package.json
- Geolocation requires user permission
- AI features require valid Gemini API key

##  Testing

Currently, the project does not include automated tests. Manual testing checklist:

- [ ] User registration and login
- [ ] Transaction CRUD operations
- [ ] Budget creation and tracking
- [ ] Goal management
- [ ] Subscription tracking
- [ ] AI assistant responses
- [ ] Plan-specific features
- [ ] CSV export functionality

##  Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow existing code style and patterns
- Update documentation for new features
- Test across different plan types
- Ensure responsive design works on mobile

##  License

Licensed under Apache 2.0. See [LICENSE](LICENSE) for details.

##  Authors

Developed as part of a hackathon project.

##  Acknowledgments

- Google Gemini for AI capabilities
- OpenStreetMap for geocoding services
- React and Express communities