# AI-Powered Interactive Dashboard Converter

Instantly transform raw data files (CSV, Excel, JSON) into beautiful, interactive dashboards. This tool leverages a powerful AI engine to analyze your data and automatically generate insightful, customizable visualizations in seconds.

![Dashboard Screenshot](https://storage.googleapis.com/aistudio-hosting/project-assets/readme_images/dashboard-converter-screenshot.png)

## ✨ Key Features

- **🤖 Intelligent Chart Generation**: Utilizes a sophisticated AI model to analyze your dataset and propose a variety of relevant and insightful charts.
- **📁 Multi-File Support**: Seamlessly accepts CSV, Excel (.xlsx), and JSON files via a simple drag-and-drop interface.
- **🎨 Interactive & Customizable**:
    - Visualize data through Bar, Line, Area, Pie, and Scatter plots.
    - Dynamically edit chart titles and switch between different chart types on the fly.
    - Easily curate your dashboard by removing unwanted charts.
- **🔒 Secure & Private**: All file parsing and data processing happen directly in your browser. Your data never leaves your computer.
- **📊 Data Preview & Sorting**: Inspect your complete dataset in a clean, paginated table and sort data by any column.
- **🚀 High-Quality Exports**: Export your entire dashboard as a high-resolution PNG image or a print-ready PDF, perfect for reports and presentations.
- **🌙 Light & Dark Modes**: A sleek interface with themes for your viewing comfort.
- **💾 Session Persistence**: Your dashboard configuration is automatically saved, allowing you to pick up right where you left off.
- **📱 Fully Responsive**: A fluid user experience that works flawlessly on desktop, tablet, and mobile devices.

## 🎯 Use Cases

This tool is perfect for anyone who needs to quickly understand and present data without the complexity of traditional business intelligence software.

- **Business Analysts**: Rapidly visualize sales figures, customer demographics, or operational metrics from raw data exports.
- **Students & Researchers**: Explore datasets for academic projects and generate charts for papers and presentations without writing any code.
- **Marketers**: Analyze campaign performance data from ad platforms or analytics tools to quickly identify trends.
- **Developers**: A handy utility to inspect and visualize data from JSON API responses during development and testing.
- **Product Managers**: Quickly mock up a dashboard to communicate key product metrics to stakeholders.

## 🛠️ Technology Stack

This application is built with a modern, robust, and scalable technology stack, emphasizing client-side performance and a seamless user experience.

- **Frontend**: A dynamic and responsive user interface built with **React** and **TypeScript**.
- **Styling**: Utility-first styling implemented with **Tailwind CSS** for a clean and consistent design.
- **AI Engine**: At its core, the application uses the **Google Gemini API** for advanced data analysis. A proprietary prompting strategy analyzes the data's structure and semantics to generate structured, relevant visualization suggestions.
- **Data Visualization**: Interactive and beautiful charts are rendered using the **Recharts** library.
- **Client-Side Processing**: Data files are parsed securely in the browser using battle-tested libraries for CSV, Excel, and JSON formats.
- **Export Functionality**: Dashboard exports are powered by **html2canvas** for image capture and **jsPDF** for PDF generation.

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- A package manager like `npm` or `yarn`
- A **Google Gemini API Key**. You can get one from [Google AI Studio](https://aistudio.google.com/app/apikey).

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/interactive-dashboard-converter.git
    cd interactive-dashboard-converter
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up your environment variables:**
    - Create a new file named `.env` in the root of your project directory.
    - Add your Gemini API key to this file:
      ```
      API_KEY=your_gemini_api_key_here
      ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

5.  Open your browser and navigate to the local URL provided in your terminal (usually `http://localhost:5173`).

## 📋 Usage

1.  **Upload Data**: On the home screen, drag and drop your data file (CSV, XLSX, or JSON) onto the upload area, or click to select a file from your computer.
2.  **AI Analysis**: The application will show a loader while the AI analyzes your data to generate chart suggestions.
3.  **Explore Your Dashboard**: Your new dashboard will appear, populated with AI-generated charts.
4.  **Customize**:
    - Click on any chart's title to edit it.
    - Use the dropdown menu on a chart card to change its type.
    - Click the trash icon to remove a chart.
5.  **Export**: Click the "PNG" or "PDF" buttons in the header to save a snapshot of your dashboard.
6.  **Reset**: Click the refresh icon in the header to clear the current dashboard and start over with a new file.
