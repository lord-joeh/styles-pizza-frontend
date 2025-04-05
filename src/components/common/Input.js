// pizza-frontend/src/components/common/Input.js
import React from 'react';

const Input = ({ label, value, onChange, type = 'text', className, error }) => {
    return (
        <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">{label}</label>
            <input
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${className} ${error ? 'border-red-500' : ''}`}
                type={type}
                value={value}
                onChange={onChange}
            />
            {error && <p className="text-red-500 text-xs italic">{error}</p>}
        </div>
    );
};

export default Input;