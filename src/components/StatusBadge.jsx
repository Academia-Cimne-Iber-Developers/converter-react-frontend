import React from 'react';

const StatusBadge = ({ status }) => {
  const baseClasses = "px-2 inline-flex text-xs leading-5 font-semibold rounded-full";
  const statusClasses = {
    success: "bg-green-100 text-green-800",
    error: "bg-red-100 text-red-800"
  };

  return (
    <span className={`${baseClasses} ${statusClasses[status]}`}>
      {status}
    </span>
  );
};

export default StatusBadge;