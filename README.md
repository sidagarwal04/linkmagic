# LinkMagic - URL Shortener & QR Code Generator

LinkMagic is a simple web application built with Next.js and Firebase that allows you to shorten long URLs and generate QR codes for them.

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
*   A Firebase project (for deployment)

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

### Running Locally

1.  **Set up environment variables (optional but recommended for Genkit features if added later):**
    Create a `.env.local` file in the root directory and add any necessary API keys (e.g., for Google AI if you use Genkit).
    ```
    GOOGLE_GENAI_API_KEY=YOUR_API_KEY
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

### Setup

1.  **Create a Firebase Project:** If you don't have one, create a project at the [Firebase Console](https://console.firebase.google.com/).
2.  **Enable Firebase Hosting:** In your Firebase project settings, enable the Hosting service.
3.  **Generate a Firebase Service Account Key:**
    *   Go to Project settings > Service accounts.
    *   Select "Node.js" and click "Generate new private key".
    *   Save the downloaded JSON file securely.
4.  **Configure GitHub Secrets:** In your GitHub repository settings (Settings > Secrets and variables > Actions), add the following secrets:
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
*   [Firebase Hosting](https://firebase.google.com/docs/hosting) - Deployment Platform
*   [GitHub Actions](https://github.com/features/actions) - CI/CD

## Contributing

Contributions are welcome! Please feel free to open an issue or submit a pull request.
