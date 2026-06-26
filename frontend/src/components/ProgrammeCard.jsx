import { useState } from 'react';

const ProgrammeCard = ({ programme, actions }) => {
  const {
    campusName,
    title,
    type,
    domain,
    subDomain,
    location,
    scale,
    status,
    startDate,
    endDate,
    participantsCount,
    description,
    feeBased
  } = programme;

  const [isExpanded, setIsExpanded] = useState(false);

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

  const formatDate = (dateStr) => {
    if (!dateStr) return 'TBD';
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return 'TBD';
      
      const day = date.getDate();
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const month = months[date.getMonth()];
      const year = date.getFullYear();
      
      let hours = date.getHours();
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // convert 0 to 12
      
      return `${day} ${month} ${year}, ${hours}:${minutes} ${ampm}`;
    } catch (e) {
      return 'TBD';
    }
  };

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
        
        <h3 className="text-lg font-bold text-primary mb-1 line-clamp-2">{title}</h3>
        {campusName && (
          <p className="text-xs font-semibold text-gray-500 mb-3">Campus: {campusName}</p>
        )}
        
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex justify-between">
            <span className="font-semibold text-gray-500">Domain:</span>
            <span>{domain}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-500">Location:</span>
            <span>{location}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-500">Starts:</span>
            <span>{formatDate(startDate)}</span>
          </div>
          {endDate && (
            <div className="flex justify-between">
              <span className="font-semibold text-gray-500">Ends:</span>
              <span>{formatDate(endDate)}</span>
            </div>
          )}
        </div>

        {/* View Details Expandable Drawer */}
        <div className="mt-4 border-t border-gray-100 pt-3">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-between w-full text-xs font-bold text-accent hover:text-accent-dark transition focus:outline-none"
          >
            <span>{isExpanded ? 'Hide Details' : 'View Details'}</span>
            <svg
              className={`h-4 w-4 transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {isExpanded && (
            <div className="mt-3 space-y-2 text-xs text-gray-600 transition-all duration-200">
              {subDomain && (
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-500">Sub Domain:</span>
                  <span>{subDomain}</span>
                </div>
              )}
              {scale && (
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-500">Scale:</span>
                  <span className="capitalize">{scale.toLowerCase().replace('_', ' ')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="font-semibold text-gray-500">Participants:</span>
                <span>{participantsCount ?? 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-gray-500">Fee Model:</span>
                <span>{feeBased ? 'Fee-Based' : 'Free / Sponsored'}</span>
              </div>
              {description && (
                <div className="mt-2 text-gray-700 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                  <p className="font-semibold text-gray-500 mb-1">Description:</p>
                  <p className="whitespace-pre-line leading-relaxed">{description}</p>
                </div>
              )}
            </div>
          )}
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

