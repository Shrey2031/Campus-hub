import React from 'react';

const Avatar = ({ size = 'md', src, name, className = '', gradient = 'from-primary to-primary-light' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`${sizeClasses[size]} ${className} rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0 overflow-hidden`}>
      {src ? (
        <img src={src} alt={name} className="w-full h-full object-cover rounded-2xl" />
      ) : (
        <div className={`w-full h-full ${gradient} flex items-center justify-center`}>
          <i className="fas fa-user text-white text-sm"></i>
        </div>
      )}
    </div>
  );
};

export default Avatar;