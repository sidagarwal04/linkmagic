
# LinkMagic - URL Shortener & QR Code Generator

LinkMagic is a simple web application built with Next.js that allows users to shorten long URLs and generate QR codes for them.

## Features

*   **URL Shortening:** Create short, memorable links for your long URLs. Links are stored in Firestore.
*   **QR Code Generation:**
    *   Generate QR codes directly for any URL.
    *   Optionally generate a QR code for the shortened URL during the shortening process.
*   **Redirection:** Shortened URLs automatically redirect to the original long URL.
*   **Clean UI:** Simple and intuitive interface built with Shadcn UI and Tailwind CSS.
*   **Server Actions:** Utilizes Next.js Server Actions for backend logic (URL shortening).
*   **Firebase Admin SDK:** Uses Firebase Admin for server-side database interactions.
*   **GitHub Actions Deployment:** Includes a workflow for easy deployment to Firebase Hosting via GitHub Actions.

## Getting Started

### Prerequisites

*   Node.js (v20 or later recommended)
*   npm or yarn or pnpm
*   A Firebase project (required for storing links and deployment)

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
2.  **Add a Web App:** In your Firebase project settings, go to "Project settings" > "General" and under "Your apps", click the Web icon (`</>`) to add a web app configuration. Copy the Firebase configuration object provided.
3.  **Enable Firestore:** In the Firebase console, go to "Build" > "Firestore Database". Click "Create database", choose "Start in production mode", select a location, and click "Enable". You'll need Firestore to store the URL mappings.
4.  **Enable Firebase Hosting:** In your Firebase project settings, enable the Hosting service. Note your Hosting site URL (e.g., `your-project-id.web.app`).

### Running Locally

1.  **Set up environment variables:**
    Create a `.env.local` file in the root directory.
    ```dotenv
    # .env.local

    # --- Client-side Firebase Config (from Step 2 above) ---
    NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_WEB_API_KEY
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_PROJECT_ID.firebaseapp.com
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_PROJECT_ID.appspot.com
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
    NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_WEB_APP_ID

    # --- Base URL for constructing Short Links ---
    # Use your Firebase Hosting URL or custom domain (without trailing slash)
    # For local dev, use http://localhost:9002 (or your port)
    NEXT_PUBLIC_BASE_URL=http://localhost:9002

    # --- Server-side Firebase Admin Config (Required for Server Actions) ---
    # Generate this key (see Deployment section below) and paste the *entire JSON content* here.
    # Alternatively, set GOOGLE_APPLICATION_CREDENTIALS to the path of the key file.
    # For security, avoid committing the key directly if the repo is public. Use GOOGLE_APPLICATION_CREDENTIALS locally if preferred.
    FIREBASE_SERVICE_ACCOUNT='{"type": "service_account", "project_id": "...", ...}'

    # --- Genkit API Key (Only if using Genkit features) ---
    # GOOGLE_GENAI_API_KEY=YOUR_API_KEY
    ```
2.  **Generate Server-side Key (if not done yet):**
    *   Follow steps 1-3 in the "Generate a Firebase Service Account Key" section under **Deployment Setup** below.
    *   Either paste the full JSON content into the `FIREBASE_SERVICE_ACCOUNT` variable in `.env.local` OR set the `GOOGLE_APPLICATION_CREDENTIALS` environment variable in your terminal to the *path* of the downloaded JSON file before running `npm run dev`.
    ```bash
    # Example using GOOGLE_APPLICATION_CREDENTIALS (replace path)
    export GOOGLE_APPLICATION_CREDENTIALS="/path/to/your/serviceAccountKey.json"
    npm run dev
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    # or
    # yarn dev
    # or
    # pnpm dev
    ```
    The application will be available at `http://localhost:9002` (or the port specified).

## Deployment

This project includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) for deploying to **Firebase Hosting**.

### Deployment Setup (GitHub Actions)

1.  **Generate a Firebase Service Account Key:**
    *   Go to Project settings > Service accounts in the Firebase Console.
    *   Select "Node.js" and click "Generate new private key".
    *   Save the downloaded JSON file securely. **Do not commit this file to your repository if it's public.**
2.  **Configure GitHub Secrets:** In your GitHub repository settings (Settings > Secrets and variables > Actions), add the following secrets:
    *   `FIREBASE_PROJECT_ID`: Your Firebase Project ID.
    *   `FIREBASE_SERVICE_ACCOUNT_LINKMAGIC`: The **entire content** of the JSON service account key file you downloaded. Copy and paste the full JSON object. This secret name (`FIREBASE_SERVICE_ACCOUNT_LINKMAGIC`) must exactly match the one used in the `deploy.yml` workflow file.
    *   `NEXT_PUBLIC_BASE_URL`: The **production URL** of your deployed Firebase Hosting site (e.g., `https://your-project-id.web.app` or your custom domain). Make sure it does **not** have a trailing slash.

### Deployment Process

*   Pushing changes to the `main` branch will automatically trigger the GitHub Actions workflow.
*   The workflow will install dependencies, build the Next.js app (using production environment variables from secrets), and deploy it to your Firebase Hosting site's `live` channel.
*   The `FIREBASE_SERVICE_ACCOUNT_LINKMAGIC` secret is used by the deployment step to authenticate with Firebase and also passed as the `FIREBASE_SERVICE_ACCOUNT` environment variable to the running application for the Admin SDK.

## Built With

*   [Next.js](https://nextjs.org/) (App Router) - React Framework
*   [React](https://reactjs.org/) - JavaScript Library
*   [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript
*   [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS Framework
*   [Shadcn UI](https://ui.shadcn.com/) - Component Library
*   [Lucide React](https://lucide.dev/) - Icons
*   [React Hook Form](https://react-hook-form.com/) - Form Handling
*   [Zod](https://zod.dev/) - Schema Validation
*   [Firebase Hosting](https://firebase.google.com/docs/hosting) - Deployment Platform
*   [Firebase Firestore](https://firebase.google.com/docs/firestore) - Database for URL Mappings
*   [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup) - Server-side Firebase Access
*   [GitHub Actions](https://github.com/features/actions) - CI/CD

## Contributing

Contributions are welcome! Please feel free to open an issue or submit a pull request.

Developed by <a href="http://meetsid.dev/" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">Sid</a> using Firebase Studio
