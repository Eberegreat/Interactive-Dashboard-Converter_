# AI-Powered Interactive Dashboard Converter

Instantly transform your raw data files (CSV, Excel, JSON) into beautiful, interactive dashboards using the power of the Google Gemini API. This tool analyzes your data, suggests the best visualizations, and builds a customizable dashboard in seconds.

![Dashboard Screenshot](https://storage.googleapis.com/aistudio-hosting/project-assets/readme_images/dashboard-converter-screenshot.png)

## ✨ Key Features

- **🤖 AI-Powered Chart Suggestions**: Leverages the Gemini API to analyze your dataset's structure and content to automatically propose a variety of relevant and insightful charts.
- **📁 Multi-File Support**: Simply drag-and-drop or upload your CSV, Excel (.xlsx), or JSON files to get started.
- **🎨 Interactive & Customizable Dashboard**: 
    - View data through a range of chart types including Bar, Line, Area, Pie, and Scatter plots.
    - Dynamically edit chart titles and switch between different chart types on the fly.
    - Easily remove any charts that you don't need.
- **📊 Data Preview & Sorting**: Inspect your complete dataset in a clean, paginated table. Click on any column header to sort the data.
- **🚀 Export to PNG & PDF**: Export your entire dashboard as a high-resolution PNG image or a multi-page PDF document, perfect for reports and presentations.
- **🌙 Dark Mode**: Switch between light and dark themes for your viewing comfort.
- **💾 Persistent State**: Your data, file name, and dashboard configuration are automatically saved to your browser's local storage, allowing you to pick up right where you left off.
- **📱 Responsive Design**: A fluid user interface that works seamlessly on both desktop and mobile devices.

## 🛠️ How It Works (Technical Breakdown)

This application is a modern web app built with a focus on client-side processing and AI integration.

1.  **Frontend**: Built with **React** and **TypeScript** for a robust and type-safe component-based architecture. Styled with **Tailwind CSS** for a clean, responsive, and modern look.
2.  **Data Parsing**: All file parsing happens directly in the browser for privacy and speed.
    -   **PapaParse**: Used for parsing CSV files.
    -   **SheetJS (XLSX)**: Used for parsing Excel (.xlsx) files.
    -   Native `JSON.parse` for JSON files.
3.  **AI Integration (Gemini API)**:
    -   When a file is uploaded, the application sends a small sample of the data (the first 5 rows), along with column headers and inferred data types, to the **`gemini-2.5-flash`** model.
    -   A carefully designed prompt instructs the model to act as a data analyst and suggest up to 6 diverse and meaningful chart configurations.
    -   The Gemini API's `responseSchema` feature is used to enforce a strict JSON output, ensuring the AI's response is always in the correct format for the application to render.
4.  **Chart Rendering**: The powerful **Recharts** library is used to render the interactive and visually appealing charts.
5.  **Dashboard Export**:
    -   **html2canvas**: This library captures a high-quality screenshot of the dashboard component.
    -   **jsPDF**: This library takes the captured image and embeds it into a PDF document for easy saving and sharing.

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or later recommended)
-   A package manager like `npm` or `yarn`
-   A **Google Gemini API Key**. You can get one from [Google AI Studio](https://aistudio.google.com/app/apikey).

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/interactive-dashboard-converter.git
    cd interactive-dashboard-converter
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up your environment variables:**
    -   Create a new file named `.env` in the root of your project directory.
    -   Add your Gemini API key to this file:
    ```
    API_KEY=your_gemini_api_key_here
    ```
    *This project uses Vite, which automatically loads environment variables from `.env` files and exposes them via `import.meta.env`. The code is set up to use `process.env` as a standard, which is compatible with many hosting platforms.*

4.  **Run the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```

5.  Open your browser and navigate to `http://localhost:5173` (or the port specified in your terminal).

## USAGE

1.  **Upload Data**: On the main screen, drag and drop your data file (CSV, XLSX, or JSON) onto the upload area, or click to select a file from your computer.
2.  **AI Analysis**: The application will show a loader while it sends your data sample to the Gemini API and waits for chart suggestions.
3.  **Explore Your Dashboard**: Your new dashboard will appear, populated with the AI-generated charts.
4.  **Customize**:
    -   Click on any chart's title to edit it.
    -   Use the dropdown menu on a chart card to change its type (e.g., from Bar to Line).
    -   Click the trash icon to remove a chart.
5.  **Export**:
    -   Click the "PNG" or "PDF" buttons in the header to save a snapshot of your dashboard.
6.  **Reset**:
    -   Click the refresh icon in the header to clear the current dashboard and start over with a new file.

---

This project was built as a demonstration of the powerful capabilities of the Gemini API for data analysis and visualization tasks.
