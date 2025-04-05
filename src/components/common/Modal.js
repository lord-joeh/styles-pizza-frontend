// pizza-frontend/src/components/common/Modal.js
import React from 'react';

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg">
                {children}
                <button onClick={onClose} className="mt-4 px-4 py-2 bg-gray-300 rounded">Close</button>
            </div>
        </div>
    );
};

export default Modal;