
# LinkMagic - URL Shortener & QR Code Generator

LinkMagic is a simple web application built with Next.js that allows users to shorten long URLs and generate QR codes for them.

## Features

*   **URL Shortening:** Create short, memorable links for your long URLs.
*   **QR Code Generation:**
    *   Generate QR codes directly for any URL.
    *   Optionally generate a QR code for the shortened URL during the shortening process.
*   **Clean UI:** Simple and intuitive interface built with Shadcn UI and Tailwind CSS.
*   **Server Actions:** Utilizes Next.js Server Actions for backend logic without dedicated API routes.
*   **GitHub Actions Deployment:** Includes a workflow for easy deployment to Firebase Hosting via GitHub Actions.

## Getting Started

### Prerequisites

*   Node.js (v20 or later recommended)
*   npm or yarn or pnpm
*   A Firebase project (required only for deployment to Firebase Hosting)

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

### Firebase Setup (Optional - For Deployment Only)

If you plan to deploy using the included GitHub Actions workflow for Firebase Hosting:

1.  **Create a Firebase Project:** If you don't have one, create a project at the [Firebase Console](https://console.firebase.google.com/).
2.  **Add a Web App (if needed):** While authentication is not used, you might still need a web app configuration if you plan to use other Firebase services later. Copy the Firebase configuration object if you create one.
3.  **Enable Firebase Hosting:** In your Firebase project settings, enable the Hosting service.

### Running Locally

1.  **Set up environment variables (Optional - if using Firebase config):**
    Create a `.env.local` file in the root directory. If you have Firebase configuration details (even if not using auth), you can add them here.
    ```
    # .env.local (Example - Add only if needed for other Firebase services)
    # NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY
    # NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_PROJECT_ID.firebaseapp.com
    # NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
    # NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_PROJECT_ID.appspot.com
    # NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
    # NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_APP_ID

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
    The application will be available at `http://localhost:9002` (or the port specified in `package.json`).

## Deployment

This project includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) for deploying to **Firebase Hosting**.

### Setup (GitHub Actions)

1.  **Generate a Firebase Service Account Key:**
    *   Go to Project settings > Service accounts in the Firebase Console.
    *   Select "Node.js" and click "Generate new private key".
    *   Save the downloaded JSON file securely.
2.  **Configure GitHub Secrets:** In your GitHub repository settings (Settings > Secrets and variables > Actions), add the following secrets:
    *   `FIREBASE_PROJECT_ID`: Your Firebase Project ID.
    *   `FIREBASE_SERVICE_ACCOUNT`: The **entire content** of the JSON service account key file you downloaded. Copy and paste the full JSON object. *Note: The workflow file might reference a different secret name like `FIREBASE_SERVICE_ACCOUNT_LINKMAGIC`. Ensure the name here matches the name used in your `.github/workflows/deploy.yml` file.*

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
*   [Firebase Hosting](https://firebase.google.com/docs/hosting) - Deployment Platform
*   [GitHub Actions](https://github.com/features/actions) - CI/CD

## Contributing

Contributions are welcome! Please feel free to open an issue or submit a pull request.

Developed by <a href="http://meetsid.dev/" target="_blank" rel="noopener noreferrer">Sid</a> using Firebase Studio
