import React from 'react';

const BasicSkeleton = () => {
    return (
        <div className="animate-pulse">
            <div className="bg-gray-300 h-48 w-full"></div> {/* Placeholder for an image */}
            <div className="mt-2 bg-gray-300 h-6 w-3/4"></div> {/* Placeholder for a title */}
            <div className="mt-1 bg-gray-300 h-4 w-1/2"></div> {/* Placeholder for a subtitle or description */}
        </div>
    );
};

export default BasicSkeleton;