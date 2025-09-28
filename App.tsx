
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from './components/Header';
import { FileUploader } from './components/FileUploader';
import { DataPreview } from './components/DataPreview';
import { Dashboard } from './components/Dashboard';
import { Loader } from './components/Loader';
import { suggestCharts } from './services/geminiService';
import type { TableRow, DashboardConfig, ChartConfig } from './types';

const App: React.FC = () => {
    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        const savedTheme = localStorage.getItem('dashboard-theme') as 'light' | 'dark';
        if (savedTheme) return savedTheme;
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    });

    const [data, setData] = useState<TableRow[]>([]);
    const [fileName, setFileName] = useState<string>('');
    const [dashboardConfig, setDashboardConfig] = useState<DashboardConfig>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);

    const dashboardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('dashboard-theme', theme);
    }, [theme]);

    useEffect(() => {
        try {
            const savedConfig = localStorage.getItem('dashboard-config');
            const savedData = localStorage.getItem('dashboard-data');
            const savedFileName = localStorage.getItem('dashboard-filename');
            if (savedConfig && savedData && savedFileName) {
                setDashboardConfig(JSON.parse(savedConfig));
                setData(JSON.parse(savedData));
                setFileName(savedFileName);
            }
        } catch (e) {
            console.error("Failed to load from localStorage", e);
            localStorage.removeItem('dashboard-config');
            localStorage.removeItem('dashboard-data');
            localStorage.removeItem('dashboard-filename');
        }
        setIsInitialLoad(false);
    }, []);

    const handleDataUpload = useCallback(async (parsedData: TableRow[], name: string) => {
        setError(null);
        setIsLoading(true);
        setData(parsedData);
        setFileName(name);
        setDashboardConfig([]);

        try {
            const suggestions = await suggestCharts(parsedData);
            setDashboardConfig(suggestions);
            localStorage.setItem('dashboard-config', JSON.stringify(suggestions));
            localStorage.setItem('dashboard-data', JSON.stringify(parsedData));
            localStorage.setItem('dashboard-filename', name);
        } catch (err) {
            console.error(err);
            setError('Failed to get chart suggestions from AI. Please try again.');
            setData([]);
            setFileName('');
        } finally {
            setIsLoading(false);
        }
    }, []);
    
    const handleConfigChange = useCallback((newConfig: ChartConfig, index: number) => {
        const updatedDashboardConfig = [...dashboardConfig];
        updatedDashboardConfig[index] = newConfig;
        setDashboardConfig(updatedDashboardConfig);
        localStorage.setItem('dashboard-config', JSON.stringify(updatedDashboardConfig));
    }, [dashboardConfig]);

    const handleChartDelete = useCallback((index: number) => {
        const updatedDashboardConfig = dashboardConfig.filter((_, i) => i !== index);
        setDashboardConfig(updatedDashboardConfig);
         localStorage.setItem('dashboard-config', JSON.stringify(updatedDashboardConfig));
    }, [dashboardConfig]);
    
    const handleReset = useCallback(() => {
        setData([]);
        setFileName('');
        setDashboardConfig([]);
        setError(null);
        localStorage.removeItem('dashboard-config');
        localStorage.removeItem('dashboard-data');
        localStorage.removeItem('dashboard-filename');
    }, []);

    const exportDashboard = async (format: 'png' | 'pdf') => {
        if (!dashboardRef.current) return;

        if (typeof window.html2canvas === 'undefined' || typeof window.jspdf === 'undefined') {
            setError("Export functionality is not available. Required libraries could not be loaded. Please check your connection and refresh.");
            return;
        }

        setIsLoading(true);
        try {
            const canvas = await window.html2canvas(dashboardRef.current, {
                backgroundColor: theme === 'dark' ? '#111827' : '#f9fafb',
                scale: 2,
            });
            const imgData = canvas.toDataURL('image/png');

            if (format === 'png') {
                const link = document.createElement('a');
                link.download = `${fileName}-dashboard.png`;
                link.href = imgData;
                link.click();
            } else {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                const { jsPDF } = window.jspdf;
                const pdf = new jsPDF({
                    orientation: 'landscape',
                    unit: 'px',
                    format: [canvas.width, canvas.height]
                });
                pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
                pdf.save(`${fileName}-dashboard.pdf`);
            }
        } catch (err) {
            console.error("Export failed:", err);
            setError("Failed to export dashboard.");
        } finally {
            setIsLoading(false);
        }
    };
    
    if (isInitialLoad) {
        return <Loader message="Loading application..." />;
    }

    return (
        <div className="min-h-screen text-gray-800 dark:text-gray-200 transition-colors duration-300">
            <Header
                theme={theme}
                setTheme={setTheme}
                onExportPNG={() => exportDashboard('png')}
                onExportPDF={() => exportDashboard('pdf')}
                hasData={data.length > 0}
                onReset={handleReset}
            />
            <main className="p-4 sm:p-6 lg:p-8">
                {isLoading && <Loader message="Analyzing data and building dashboard..." />}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                        <strong className="font-bold">Error: </strong>
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}
                
                {data.length === 0 && !isLoading && (
                    <div className="text-center py-16">
                         <div className="max-w-2xl mx-auto">
                           <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">AI-Powered Dashboard Converter</h1>
                            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
                                Instantly transform your CSV, Excel, or JSON files into beautiful, interactive dashboards. Let our AI analyze your data and suggest the best visualizations for your insights.
                            </p>
                         </div>
                        <FileUploader onFileUpload={handleDataUpload} setIsLoading={setIsLoading} setError={setError} />
                    </div>
                )}
                
                {data.length > 0 && !isLoading && (
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Dashboard for: <span className="text-primary-600 dark:text-primary-400">{fileName}</span></h2>
                           <Dashboard 
                                ref={dashboardRef}
                                config={dashboardConfig} 
                                data={data} 
                                onConfigChange={handleConfigChange}
                                onChartDelete={handleChartDelete}
                            />
                        </div>
                        <DataPreview data={data} />
                    </div>
                )}
            </main>
        </div>
    );
};

export default App;