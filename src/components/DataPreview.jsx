import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';

const DataPreview = ({ data, title }) => {
  if (!data || data.length === 0) return null;

  const previewData = data.slice(0, 10);
  const headers = Object.keys(previewData[0]);

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {headers.map((header) => (
                  <th
                    key={header}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {previewData.map((row, idx) => (
                <tr key={idx}>
                  {headers.map((header) => (
                    <td key={header} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {row[header]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {data.length > 10 && (
          <p className="text-sm text-gray-500 mt-4">
            Showing 10 of {data.length} records
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default DataPreview;