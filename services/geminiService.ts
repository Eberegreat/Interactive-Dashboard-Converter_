import { GoogleGenAI, Type } from "@google/genai";
import type { TableRow, ChartConfig } from '../types';
import { ChartType } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const getColumnInfo = (data: TableRow[]) => {
    if (data.length === 0) return { headers: [], types: {} };
    const headers = Object.keys(data[0]);
    const types: Record<string, 'number' | 'string' | 'date'> = {};

    for (const header of headers) {
        const isNumeric = data.every(row => row[header] === null || row[header] === '' || !isNaN(Number(row[header])));
        if (isNumeric) {
            types[header] = 'number';
            continue;
        }
        
        const isDate = data.some(row => !isNaN(Date.parse(String(row[header]))));
        if(isDate) {
             types[header] = 'date';
             continue;
        }
        
        types[header] = 'string';
    }
    return { headers, types };
};

export const suggestCharts = async (data: TableRow[]): Promise<ChartConfig[]> => {
    const dataSample = data.slice(0, 5);
    const { headers, types } = getColumnInfo(data);

    // Fix: Updated prompt to be more explicit about yKey format and to remove ambiguity.
    const prompt = `
        Based on the following dataset sample and column types, suggest a list of chart configurations for a dashboard.
        
        Column Headers: ${headers.join(', ')}
        Column Types: ${JSON.stringify(types, null, 2)}
        Data Sample:
        ${JSON.stringify(dataSample, null, 2)}

        Guidelines:
        1. Suggest up to 6 diverse and insightful charts.
        2. Choose appropriate chart types from: 'bar', 'line', 'area', 'pie', 'scatter'.
        3. For 'bar', 'line', 'area', and 'scatter' charts, provide 'xKey' (usually a categorical or date column) and 'yKey' (one or more numerical columns).
        4. For 'pie' charts, 'xKey' is the category name, and 'yKey' is the numerical value to aggregate.
        5. 'yKey' must be a string. For charts that support multiple series (bar, line, area), you can provide a comma-separated list of column names.
        6. Create meaningful, concise titles for each chart.
        7. Prioritize common and useful visualizations. For example, trends over time (line/area), comparisons (bar), proportions (pie), and relationships between two numeric variables (scatter). For pie and scatter charts, 'yKey' must be a single column name.
        8. Ensure the keys you select exist in the column headers.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                // Fix: Corrected responseSchema to use a valid type for yKey and remove invalid Type.ONE_OF.
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING },
                            type: { 
                                type: Type.STRING,
                                enum: Object.values(ChartType).filter(t => t !== ChartType.TABLE) 
                            },
                            xKey: { type: Type.STRING },
                            yKey: {
                                type: Type.STRING
                            }
                        },
                        required: ["title", "type", "xKey", "yKey"]
                    },
                },
            },
        });
        
        const jsonText = response.text.trim();
        let suggestions = JSON.parse(jsonText);
        
        if (!Array.isArray(suggestions)) {
            throw new Error("AI response is not a valid array of chart configurations.");
        }

        // Fix: Post-process suggestions to handle comma-separated yKey for multi-series charts.
        suggestions = suggestions.map((s: any) => {
            if (s.yKey && typeof s.yKey === 'string' && s.yKey.includes(',')) {
                const multiYAxisTypes = [ChartType.BAR, ChartType.LINE, ChartType.AREA];
                if (multiYAxisTypes.includes(s.type)) {
                    return { ...s, yKey: s.yKey.split(',').map((k: string) => k.trim()) };
                }
            }
            return s;
        });

        // Validate suggestions to filter out any invalid ones
        const validSuggestions = suggestions.filter((s: any) => 
            s.title && s.type && s.xKey && s.yKey && headers.includes(s.xKey) && 
            (Array.isArray(s.yKey) ? s.yKey.every((key:string) => headers.includes(key)) : headers.includes(s.yKey))
        );

        return validSuggestions as ChartConfig[];

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to generate chart suggestions from the AI model.");
    }
};
