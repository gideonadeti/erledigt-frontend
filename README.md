# Erledigt Frontend

Frontend application for Erledigt, a modern todo application built with Angular, .NET, and SQL Server. This responsive web application provides an intuitive interface for managing tasks with a beautiful UI and seamless user experience and connects to the [Erledigt Backend](https://github.com/gideonadeti/erledigt-backend) .NET API.

## Table of Contents

- [Erledigt Frontend](#erledigt-frontend)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
    - [Authentication](#authentication)
    - [Task Management](#task-management)
    - [User Experience](#user-experience)
  - [Technologies Used](#technologies-used)
    - [Core Framework](#core-framework)
    - [State Management \& Data Fetching](#state-management--data-fetching)
    - [UI Components \& Styling](#ui-components--styling)
    - [Forms \& Validation](#forms--validation)
    - [Date Handling](#date-handling)
    - [Notifications](#notifications)
    - [Development Tools](#development-tools)
  - [Running Locally](#running-locally)
    - [Prerequisites](#prerequisites)
    - [Installation Steps](#installation-steps)
    - [Running the Application](#running-the-application)
  - [Support](#support)

## Features

### Authentication

- **User Registration** - Create a new account with email and password
- **User Login** - Secure authentication with cookie-based sessions
- **User Logout** - Sign out and clear session
- **Protected Routes** - Automatic redirection for authenticated/unauthenticated users
- **Session Management** - Persistent login state across page refreshes

### Task Management

- **Create Tasks** - Add new tasks with title, description, priority, and due date
- **View Tasks** - Browse all tasks in a responsive grid layout
- **Edit Tasks** - Update task details including title, description, priority, and due date
- **Delete Tasks** - Remove tasks with confirmation dialog
- **Toggle Completion** - Mark tasks as completed or incomplete
- **Task Properties**:
  - Title (required)
  - Description (optional)
  - Priority levels (Low, Medium, High)
  - Due dates with smart formatting (Today, Tomorrow, Yesterday, or formatted date)
  - Completion status
- **Empty States** - Helpful messages when no tasks exist
- **Loading States** - Skeleton loaders while fetching data
- **Error Handling** - User-friendly error messages with retry options

### User Experience

- **Landing Page** - Attractive landing page for unauthenticated users with feature highlights
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- **Modern UI** - Clean, intuitive interface built with Spartan UI components
- **Toast Notifications** - Beautiful notification system for user feedback
- **Smart Date Display** - Intelligent date formatting (Today, Tomorrow, Yesterday)
- **Priority Badges** - Visual indicators for task priorities
- **Dialog Modals** - Smooth dialog components for creating and editing tasks
- **404 Page** - Custom not found page for invalid routes

## Technologies Used

### Core Framework

- **Angular 21** - Modern, component-based web framework
- **TypeScript** - Type-safe JavaScript
- **RxJS** - Reactive programming library

### State Management & Data Fetching

- **TanStack Query (Angular)** - Powerful data synchronization and caching library
- **Angular Signals** - Reactive state management with signals

### UI Components & Styling

- **Spartan UI** - High-quality Angular component library
- **Tailwind CSS 4** - Utility-first CSS framework
- **ng-icons** - Icon library with Lucide icons
- **class-variance-authority** - Component variant management
- **clsx** - Utility for constructing className strings
- **tailwind-merge** - Merge Tailwind CSS classes

### Forms & Validation

- **Angular Reactive Forms** - Form handling and validation
- **Angular CDK** - Component development kit

### Date Handling

- **date-fns** - Modern JavaScript date utility library

### Notifications

- **ngx-sonner** - Toast notification library

### Development Tools

- **Bun** - Fast JavaScript runtime and package manager
- **Angular CLI** - Command-line interface for Angular
- **Vitest** - Fast unit test framework
- **PostCSS** - CSS processing tool

## Running Locally

### Prerequisites

- [Bun](https://bun.sh) (recommended) or [Node.js](https://nodejs.org/) (v18 or later)
- [Angular CLI](https://angular.dev/tools/cli) (installed globally or via npx)
- The [Erledigt Backend](https://github.com/gideonadeti/erledigt-backend) running locally
- Git

### Installation Steps

1. **Clone the repository**:

   ```bash
   git clone https://github.com/gideonadeti/erledigt-frontend.git
   cd erledigt-frontend
   ```

2. **Install dependencies**:

   Using Bun (recommended):

   ```bash
   bun install
   ```

   Or using npm:

   ```bash
   npm install
   ```

### Running the Application

1. **Start the development server**:

   Using Bun (recommended):

   ```bash
   bun start
   ```

   Or using npm:

   ```bash
   npm start
   ```

   Or using Angular CLI directly:

   ```bash
   ng serve
   ```

2. **Access the application**:

   Open your browser and navigate to `http://localhost:4200`

3. **Watch mode** (automatic rebuild on file changes):

   The development server automatically watches for file changes and rebuilds the application. No additional command needed.

**Note:** Make sure the backend API is running on `http://localhost:5211` (or update the API base URL in `src/app/auth/auth.service.ts` and `src/app/tasks/tasks.service.ts` if using a different port).

## Support

If you find this project helpful or interesting, consider supporting me:

[☕ Buy me a coffee](https://buymeacoffee.com/gideonadeti)
