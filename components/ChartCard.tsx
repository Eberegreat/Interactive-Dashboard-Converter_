
import React, { useState, useMemo } from 'react';
import { ResponsiveContainer, BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import type { ChartConfig, TableRow } from '../types';
import { ChartType } from '../types';
import { TrashIcon } from './icons';

interface ChartCardProps {
    chartConfig: ChartConfig;
    data: TableRow[];
    onConfigChange: (newConfig: ChartConfig) => void;
    onDelete: () => void;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white dark:bg-gray-800 p-2 border border-gray-200 dark:border-gray-600 rounded shadow-lg">
                <p className="label font-bold text-gray-800 dark:text-gray-200">{`${label}`}</p>
                {payload.map((pld: any, index: number) => (
                    <p key={index} style={{ color: pld.color }} className="text-sm">{`${pld.name} : ${pld.value}`}</p>
                ))}
            </div>
        );
    }
    return null;
};

export const ChartCard: React.FC<ChartCardProps> = ({ chartConfig, data, onConfigChange, onDelete }) => {
    const [title, setTitle] = useState(chartConfig.title);
    
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    };

    const handleTitleBlur = () => {
        onConfigChange({ ...chartConfig, title });
    };

    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onConfigChange({ ...chartConfig, type: e.target.value as ChartType });
    };
    
    const chartData = useMemo(() => {
        if (chartConfig.type === ChartType.PIE) {
             const summary = data.reduce((acc, row) => {
                const category = String(row[chartConfig.xKey]);
                const value = Number(row[chartConfig.yKey as string]);
                if (!isNaN(value)) {
                    acc[category] = (acc[category] || 0) + value;
                }
                return acc;
            }, {} as Record<string, number>);
            return Object.entries(summary).map(([name, value]) => ({ name, value }));
        }
        return data;
    }, [data, chartConfig]);


    const renderChart = () => {
        switch (chartConfig.type) {
            case ChartType.BAR:
                return (
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.3)" />
                        <XAxis dataKey={chartConfig.xKey} tick={{ fill: 'currentColor', fontSize: 12 }} />
                        <YAxis tick={{ fill: 'currentColor', fontSize: 12 }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        {Array.isArray(chartConfig.yKey) ? (
                            chartConfig.yKey.map((key, i) => <Bar key={key} dataKey={key} fill={COLORS[i % COLORS.length]} />)
                        ) : (
                            <Bar dataKey={chartConfig.yKey} fill={COLORS[0]} />
                        )}
                    </BarChart>
                );
            case ChartType.LINE:
                return (
                     <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.3)" />
                        <XAxis dataKey={chartConfig.xKey} tick={{ fill: 'currentColor', fontSize: 12 }}/>
                        <YAxis tick={{ fill: 'currentColor', fontSize: 12 }}/>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        {Array.isArray(chartConfig.yKey) ? (
                            chartConfig.yKey.map((key, i) => <Line key={key} type="monotone" dataKey={key} stroke={COLORS[i % COLORS.length]} />)
                        ) : (
                           <Line type="monotone" dataKey={chartConfig.yKey} stroke={COLORS[0]} />
                        )}
                    </LineChart>
                );
             case ChartType.AREA:
                return (
                     <AreaChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.3)" />
                        <XAxis dataKey={chartConfig.xKey} tick={{ fill: 'currentColor', fontSize: 12 }}/>
                        <YAxis tick={{ fill: 'currentColor', fontSize: 12 }}/>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        {Array.isArray(chartConfig.yKey) ? (
                            chartConfig.yKey.map((key, i) => <Area key={key} type="monotone" dataKey={key} stroke={COLORS[i % COLORS.length]} fill={COLORS[i % COLORS.length]} fillOpacity={0.3} />)
                        ) : (
                           <Area type="monotone" dataKey={chartConfig.yKey} stroke={COLORS[0]} fill={COLORS[0]} fillOpacity={0.3}/>
                        )}
                    </AreaChart>
                );
            case ChartType.PIE:
                return (
                    <PieChart>
                        <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
                            {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                    </PieChart>
                );
            case ChartType.SCATTER:
                return (
                    <ScatterChart>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.3)" />
                        <XAxis type="number" dataKey={chartConfig.xKey} name={chartConfig.xKey} tick={{ fill: 'currentColor', fontSize: 12 }} />
                        <YAxis type="number" dataKey={chartConfig.yKey as string} name={chartConfig.yKey as string} tick={{ fill: 'currentColor', fontSize: 12 }} />
                        <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
                        <Legend />
                        <Scatter name={chartConfig.title} data={data} fill={COLORS[0]} />
                    </ScatterChart>
                );
            default:
                return <div className="text-center p-4">Unsupported chart type.</div>;
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 flex flex-col h-96">
            <div className="flex justify-between items-start mb-2">
                 <input
                    type="text"
                    value={title}
                    onChange={handleTitleChange}
                    onBlur={handleTitleBlur}
                    className="text-lg font-bold bg-transparent border-b-2 border-transparent focus:border-primary-500 outline-none w-full mr-2 text-gray-900 dark:text-white"
                />
                <div className="flex items-center space-x-2 flex-shrink-0">
                    <select value={chartConfig.type} onChange={handleTypeChange} className="text-sm rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:ring-primary-500 focus:border-primary-500">
                        {Object.values(ChartType).filter(t => t !== 'table').map(type => (
                            <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                        ))}
                    </select>
                    <button onClick={onDelete} className="p-1 text-gray-400 hover:text-red-500">
                        <TrashIcon className="h-5 w-5" />
                    </button>
                </div>
            </div>
            <div className="flex-grow">
                <ResponsiveContainer width="100%" height="100%">
                    {renderChart()}
                </ResponsiveContainer>
            </div>
        </div>
    );
};
