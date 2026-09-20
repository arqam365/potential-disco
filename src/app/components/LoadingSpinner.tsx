import React from 'react';

const LoadingSpinner: React.FC = () => {
    return (
        <div className="flex justify-center w-full">
            <div className="animate-spin inline-block w-16 h-16 border-4 border-current border-t-transparent text-blue-600 rounded-full dark:text-blue-500" role="status">
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    );
};

export default LoadingSpinner;