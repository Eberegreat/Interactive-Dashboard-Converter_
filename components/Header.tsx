
import React from 'react';
import { SunIcon, MoonIcon, DownloadIcon, RefreshIcon, ChartPieIcon } from './icons';

interface HeaderProps {
    theme: 'light' | 'dark';
    setTheme: (theme: 'light' | 'dark') => void;
    onExportPNG: () => void;
    onExportPDF: () => void;
    hasData: boolean;
    onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({ theme, setTheme, onExportPNG, onExportPDF, hasData, onReset }) => {
    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    return (
        <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-3">
                        <ChartPieIcon className="h-8 w-8 text-primary-600" />
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                           Dashboard Converter
                        </h1>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-4">
                        {hasData && (
                            <>
                                <button
                                    onClick={onReset}
                                    className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                    title="Start New Dashboard"
                                >
                                    <RefreshIcon className="h-6 w-6" />
                                </button>
                                <button
                                    onClick={onExportPNG}
                                    className="hidden sm:flex items-center space-x-2 px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                    title="Export as PNG"
                                >
                                    <DownloadIcon className="h-5 w-5" />
                                    <span>PNG</span>
                                </button>
                                <button
                                    onClick={onExportPDF}
                                    className="hidden sm:flex items-center space-x-2 px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    title="Export as PDF"
                                >
                                    <DownloadIcon className="h-5 w-5" />
                                     <span>PDF</span>
                                </button>
                            </>
                        )}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                        >
                            {theme === 'light' ? <MoonIcon className="h-6 w-6" /> : <SunIcon className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};
