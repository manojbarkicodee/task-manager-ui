# Task Manager

## Overview

Task Manager is a web application that allows users to manage their tasks efficiently. It includes user authentication, task categorization, drag-and-drop functionality, file attachments, and an activity log. Users can view tasks in board or list views and perform batch actions for better productivity.

## Features

### 1. User Authentication

* Implemented using **Firebase Authentication** with  **Google Sign-In** .
* Users can manage their profiles securely.

### 2. Task Management

* Create, edit, and delete tasks.
* Categorize tasks (e.g., work, personal) and add tags for better organization.
* Set due dates for tasks.
* Drag-and-drop functionality for rearranging tasks.
* Sort tasks based on due dates (ascending/descending).

### 3. Batch Actions

* Perform bulk actions on tasks (e.g., delete multiple tasks, mark multiple tasks as complete).

### 4. Task History and Activity Log

* Tracks all changes made to tasks (creation, edits, deletions).
* Displays an **activity log** for each task.

### 5. Filter Options

* Filtering by tags, category, and date range.
* Search functionality by task title.

### 6. Board/List View

* Users can switch between a **Kanban board view** and a **list view** for their tasks.

### 7. Responsive Design

* Fully responsive, adapting to mobile, tablet, and desktop screens.
* Mobile-first design approach for a seamless experience on all devices.

## **Technical Stack**

```plaintext
- Frontend: React with TypeScript
- Backend: Firebase Firestore for data storage
- Authentication: Firebase Authentication (Google Sign-In)
- State Management: React Query (or similar library)
- UI Framework: Material-UI (MUI)
- Deployment: Vercel (or Netlify/Firebase Hosting)
```

## **Installation & Setup**

### **Prerequisites**

Ensure you have the following installed:

```plaintext
- Node.js (>= 18.x)
- npm
- Firebase account with Firestore enabled
```

### **Steps to Run Locally**

1. **Clone the repository:**

   ```sh
   git clone https://github.com/manojbarkicodee/task-manager-ui
   cd task-manager-ui
   ```
2. **Install dependencies:**

   ```sh
   npm install  # or yarn install
   ```
3. **Set up Firebase:**

   * Create a `.env` file and add your Firebase config:

   ```env
   REACT_APP_FIREBASE_API_KEY=your_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   ```
4. **Start the development server:**

   ```sh
   npm run dev  # or yarn dev
   ```

   The app will be available at `http://localhost:5173`.

## **Deployment**

The application is deployed using  **Vercel** . You can access it at:

🔗 **Live Demo:** https://task-manager-ui-rho.vercel.app

## **Challenges Faced & Solutions**

```plaintext
1. Handling Firebase Authentication Redirects:
   - Issue: Firebase authentication required domain authorization.
   - Solution: Added the deployed domain to Firebase Authentication settings.

2. Persisting User Authentication State:
   - Solution: Used `onAuthStateChanged` from Firebase to maintain session persistence.

3. Drag-and-Drop on Mobile:
   - Issue: Mobile users needed click events instead of drag.
   - Solution: Disabled drag using `useMediaQuery` and added `onClick` handlers for mobile devices.

4. Routing Issues in Vercel Deployment:
   - Issue: Page refresh resulted in a "Not Found" error.
   - Solution: Configured Vercel’s `vercel.json` file for proper route handling.
```

## **Contributing**

Contributions are welcome! Please fork the repository and create a pull request with your improvements.

## **License**

This project is licensed under the MIT License.
