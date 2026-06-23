import React from 'react';

const ProgrammeCard = ({ programme, actions }) => {
  const { title, type, domain, subDomain, location, status, startDate, scale } = programme;

  // Status Badge color
  const getStatusBadge = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'CLOSED':
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const formattedDate = startDate ? new Date(startDate).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }) : 'N/A';

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition duration-200 overflow-hidden flex flex-col justify-between">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary uppercase">
            {type}
          </span>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadge(status)}`}>
            {status}
          </span>
        </div>
        
        <h3 className="text-lg font-bold text-primary mb-2 line-clamp-2">{title}</h3>
        
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex justify-between">
            <span className="font-semibold text-gray-500">Domain:</span>
            <span>{domain} {subDomain ? `(${subDomain})` : ''}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-500">Location:</span>
            <span>{location}</span>
          </div>
          {scale && (
            <div className="flex justify-between">
              <span className="font-semibold text-gray-500">Scale:</span>
              <span className="capitalize">{scale.toLowerCase().replace('_', ' ')}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="font-semibold text-gray-500">Starts:</span>
            <span>{formattedDate}</span>
          </div>
        </div>
      </div>

      {actions && (
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex flex-wrap gap-2 justify-end">
          {actions}
        </div>
      )}
    </div>
  );
};

export default ProgrammeCard;
