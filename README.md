# LinkMagic - URL Shortener & QR Code Generator

LinkMagic is a simple web application built with Next.js and Firebase that allows authenticated users to shorten long URLs and generate QR codes for them.

## Features

*   **URL Shortening:** Create short, memorable links for your long URLs.
*   **QR Code Generation:**
    *   Generate QR codes directly for any URL.
    *   Optionally generate a QR code for the shortened URL during the shortening process.
*   **Firebase Authentication:** Securely sign in users with Google Sign-In. Access to tools is restricted to logged-in users.
*   **Clean UI:** Simple and intuitive interface built with Shadcn UI and Tailwind CSS.
*   **Server Actions:** Utilizes Next.js Server Actions for backend logic without dedicated API routes.
*   **GitHub Actions Deployment:** Includes a workflow for easy deployment to Firebase Hosting via GitHub Actions.

## Getting Started

### Prerequisites

*   Node.js (v20 or later recommended)
*   npm or yarn or pnpm
*   A Firebase project (for authentication and deployment)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd linkmagic # Or your repository name
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    # or
    # yarn install
    # or
    # pnpm install
    ```

### Firebase Setup (Required)

1.  **Create a Firebase Project:** If you don't have one, create a project at the [Firebase Console](https://console.firebase.google.com/).
2.  **Add a Web App:** In your Firebase project settings, add a new Web App. Copy the Firebase configuration object provided.
3.  **Enable Google Sign-In:**
    *   Go to the Authentication section in the Firebase Console.
    *   Click on the "Sign-in method" tab.
    *   Enable the "Google" provider. You might need to provide a project support email.

### Running Locally

1.  **Set up environment variables:**
    Create a `.env.local` file in the root directory. Copy the contents from `.env.local.example` and fill in your **Firebase project configuration details** obtained during the Firebase setup.
    ```
    # .env.local
    NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_PROJECT_ID.firebaseapp.com
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_PROJECT_ID.appspot.com
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
    NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_APP_ID
    # NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=YOUR_MEASUREMENT_ID # Optional

    # GOOGLE_GENAI_API_KEY=YOUR_API_KEY # Only if using Genkit
    ```
2.  **Run the development server:**
    ```bash
    npm run dev
    # or
    # yarn dev
    # or
    # pnpm dev
    ```
    The application will be available at `http://localhost:9002` (or the port specified in `package.json`). You should now be prompted to sign in with Google to use the app.

## Deployment

This project includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) for deploying to **Firebase Hosting**.

### Setup (GitHub Actions)

1.  **Enable Firebase Hosting:** In your Firebase project settings, enable the Hosting service.
2.  **Generate a Firebase Service Account Key:**
    *   Go to Project settings > Service accounts.
    *   Select "Node.js" and click "Generate new private key".
    *   Save the downloaded JSON file securely.
3.  **Configure GitHub Secrets:** In your GitHub repository settings (Settings > Secrets and variables > Actions), add the following secrets:
    *   `FIREBASE_PROJECT_ID`: Your Firebase Project ID.
    *   `FIREBASE_SERVICE_ACCOUNT`: The **entire content** of the JSON service account key file you downloaded. Copy and paste the full JSON object.

### Deployment Process

*   Pushing changes to the `main` branch will automatically trigger the GitHub Actions workflow.
*   The workflow will install dependencies, build the Next.js app, and deploy it to your Firebase Hosting site.

## Built With

*   [Next.js](https://nextjs.org/) - React Framework
*   [React](https://reactjs.org/) - JavaScript Library
*   [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript
*   [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS Framework
*   [Shadcn UI](https://ui.shadcn.com/) - Component Library
*   [Lucide React](https://lucide.dev/) - Icons
*   [React Hook Form](https://react-hook-form.com/) - Form Handling
*   [Zod](https://zod.dev/) - Schema Validation
*   [Firebase Authentication](https://firebase.google.com/docs/auth) - User Authentication
*   [Firebase Hosting](https://firebase.google.com/docs/hosting) - Deployment Platform
*   [GitHub Actions](https://github.com/features/actions) - CI/CD

## Contributing

Contributions are welcome! Please feel free to open an issue or submit a pull request.
