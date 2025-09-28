
import React, { forwardRef } from 'react';
import type { DashboardConfig, TableRow, ChartConfig } from '../types';
import { ChartCard } from './ChartCard';

interface DashboardProps {
    config: DashboardConfig;
    data: TableRow[];
    onConfigChange: (newConfig: ChartConfig, index: number) => void;
    onChartDelete: (index: number) => void;
}

export const Dashboard = forwardRef<HTMLDivElement, DashboardProps>(({ config, data, onConfigChange, onChartDelete }, ref) => {
    if (!config || config.length === 0) {
        return (
            <div className="text-center py-12 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                <p className="text-gray-500">Your generated dashboard will appear here.</p>
            </div>
        );
    }
    
    return (
        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
            {config.map((chartConfig, index) => (
                <ChartCard 
                    key={index} 
                    chartConfig={chartConfig}
                    data={data}
                    onConfigChange={(newConfig) => onConfigChange(newConfig, index)}
                    onDelete={() => onChartDelete(index)}
                />
            ))}
        </div>
    );
});

Dashboard.displayName = "Dashboard";
