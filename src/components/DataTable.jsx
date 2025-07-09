import React from 'react';

export default function DataTable({ 
  title, 
  headers, 
  data, 
  statusIcons = {}, 
  statusColors = {}, 
  onRowClick,
  renderActions
}) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-medium">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row, rowIndex) => (
              <tr 
                key={rowIndex} 
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => onRowClick?.(row)}
              >
                {headers.map((header, cellIndex) => {
                  if (header === 'Status') {
                    const Icon = statusIcons[row.status.toLowerCase()];
                    return (
                      <td key={cellIndex} className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${statusColors[row.status.toLowerCase()]}`}>
                          {Icon && Icon}
                          {row.status}
                        </span>
                      </td>
                    );
                  }
                  
                  if (header === 'Actions' && renderActions) {
                    return (
                      <td key={cellIndex} className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {renderActions(row)}
                      </td>
                    );
                  }

                  return (
                    <td key={cellIndex} className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={header === 'Amount' ? 'font-medium' : 'text-gray-500'}>
                        {row[header.toLowerCase()]}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {data.length === 0 && (
        <div className="p-6 text-center text-gray-500">
          No data available
        </div>
      )}
    </div>
  );
}