// pizza-frontend/src/components/common/Button.js
import React from 'react';

const Button = ({ children, onClick, className, disabled = false }) => {
    return (
        <button
            onClick={onClick}
            className={`px-4 py-2 rounded bg-blue-500 text-white ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

export default Button;