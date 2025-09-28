
import React, { useCallback, useState, useEffect } from 'react';
import type { TableRow } from '../types';
import { UploadIcon } from './icons';

interface FileUploaderProps {
    onFileUpload: (data: TableRow[], fileName: string) => void;
    setIsLoading: (isLoading: boolean) => void;
    setError: (error: string | null) => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onFileUpload, setIsLoading, setError }) => {
    const [libsLoaded, setLibsLoaded] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        let attempts = 0;
        const interval = setInterval(() => {
            if (window.Papa && window.XLSX) {
                setLibsLoaded(true);
                clearInterval(interval);
            } else {
                attempts++;
                if (attempts > 100) { // Wait for 10 seconds
                    setError("Could not load necessary data parsing libraries. Please check your internet connection and refresh the page.");
                    clearInterval(interval);
                }
            }
        }, 100);
        return () => clearInterval(interval);
    }, [setError]);
    
    const parseFile = useCallback((file: File) => {
        const reader = new FileReader();
        const fileExtension = file.name.split('.').pop()?.toLowerCase();
        
        reader.onload = (e) => {
            try {
                const content = e.target?.result;
                if (!content) {
                    throw new Error("File content is empty.");
                }

                if (fileExtension === 'csv') {
                    window.Papa.parse(content as string, {
                        header: true,
                        skipEmptyLines: true,
                        dynamicTyping: true,
                        complete: (results) => {
                            if (results.errors.length) {
                                throw new Error(`CSV parsing error: ${results.errors[0].message}`);
                            }
                            onFileUpload(results.data as TableRow[], file.name);
                        },
                        error: (err) => {
                             throw new Error(`CSV parsing error: ${err.message}`);
                        }
                    });
                } else if (fileExtension === 'xlsx') {
                    const workbook = window.XLSX.read(content, { type: 'array' });
                    const sheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[sheetName];
                    const jsonData = window.XLSX.utils.sheet_to_json(worksheet, { defval: "" });
                    onFileUpload(jsonData as TableRow[], file.name);
                } else if (fileExtension === 'json') {
                    const jsonData = JSON.parse(content as string);
                    if (!Array.isArray(jsonData)) {
                        throw new Error("JSON file must contain an array of objects.");
                    }
                    onFileUpload(jsonData, file.name);
                } else {
                     throw new Error("Unsupported file type. Please upload CSV, XLSX, or JSON.");
                }
            } catch (err: any) {
                setError(err.message || 'An error occurred during file parsing.');
                setIsLoading(false);
            }
        };

        reader.onerror = () => {
            setError("Failed to read the file.");
            setIsLoading(false);
        };
        
        if (fileExtension === 'xlsx') {
            reader.readAsArrayBuffer(file);
        } else {
            reader.readAsText(file);
        }

    }, [onFileUpload, setIsLoading, setError]);

    const handleFile = useCallback((file: File | null | undefined) => {
        if (file) {
            if (!libsLoaded) {
                setError("Parsing libraries are still loading, please try again in a moment.");
                return;
            }
            setError(null);
            setIsLoading(true);
            parseFile(file);
        }
    }, [libsLoaded, parseFile, setError, setIsLoading]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        handleFile(event.target.files?.[0]);
        // Reset file input to allow re-uploading the same file
        event.target.value = '';
    };

    const handleDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (libsLoaded) setIsDragging(true);
    };
    const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };
    const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };
    const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (libsLoaded) {
            handleFile(e.dataTransfer.files?.[0]);
        }
    };

    return (
        <div className="mt-8 flex justify-center">
            <div className="w-full max-w-lg">
                <label 
                    htmlFor="file-upload" 
                    className={`relative rounded-md font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500 dark:focus-within:ring-offset-gray-900 ${!libsLoaded ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                >
                    <div className={`flex justify-center items-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md transition-colors ${isDragging ? 'border-primary-500 bg-primary-50 dark:bg-gray-700' : 'border-gray-300 dark:border-gray-600'}`}>
                        <div className="space-y-1 text-center">
                            <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                            <div className="flex text-sm text-gray-600 dark:text-gray-400">
                                <span className="text-primary-600 dark:text-primary-400">Upload a file</span>
                                <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".csv, .xlsx, .json" disabled={!libsLoaded} />
                                <p className="pl-1">or drag and drop</p>
                            </div>
                            {libsLoaded ? (
                                <p className="text-xs text-gray-500 dark:text-gray-500">
                                    CSV, XLSX, JSON up to 10MB
                                </p>
                             ) : (
                                <p className="text-xs text-yellow-500 dark:text-yellow-400 animate-pulse">
                                    Initializing parsers...
                                </p>
                            )}
                        </div>
                    </div>
                </label>
            </div>
        </div>
    );
};
