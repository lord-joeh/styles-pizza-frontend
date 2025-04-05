/**
 * Formats a number as currency
 * @param {number} amount - The amount to format
 * @param {string} [currency='GHS'] - Currency code (default: GHS)
 * @param {string} [locale='en-US'] - Locale for formatting (default: en-US)
 * @returns {string} Formatted currency string
 * @throws {TypeError} If amount is not a number
 */
export const formatCurrency = (amount, currency = 'GHS', locale = 'en-US') => {
    if (typeof amount !== 'number' || isNaN(amount)) {
        throw new TypeError('Amount must be a valid number');
    }
    return new Intl.NumberFormat(locale, { 
        style: 'currency', 
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
};

/**
 * Calculates the total price of items in a cart
 * @param {Array} items - Array of cart items
 * @returns {number} Total amount
 * @throws {TypeError} If items is not an array
 */
export const calculateCartTotal = (items) => {
    if (!Array.isArray(items)) {
        throw new TypeError('Items must be an array');
    }
    
    return items.reduce((total, item) => {
        const price = Number(item.price) || 0;
        const quantity = Number(item.quantity) || 0;
        const itemTotal = price * quantity;
        
        // Ensure we don't return NaN
        return typeof itemTotal === 'number' ? total + itemTotal : total;
    }, 0);
};

/**
 * Creates a debounced function that delays invocation
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @param {Object} [options] - Options {leading: boolean, trailing: boolean}
 * @returns {Function} Debounced function
 */
export const debounce = (func, delay, options = {}) => {
    let timeoutId;
    let lastArgs;
    let lastThis;
    let result;
    
    const { leading = false, trailing = true } = options;
    
    const invokeFunc = () => {
        if (lastArgs && trailing) {
            result = func.apply(lastThis, lastArgs);
        }
        timeoutId = null;
    };
    
    return function(...args) {
        const context = this;
        lastArgs = args;
        lastThis = context;
        
        if (leading && !timeoutId) {
            result = func.apply(context, args);
        }
        
        clearTimeout(timeoutId);
        timeoutId = setTimeout(invokeFunc, delay);
        
        return result;
    };
};

/**
 * Checks if a value is empty
 * @param {*} value - Value to check
 * @returns {boolean} True if the value is empty
 */
export const isEmpty = (value) => {
    if (value == null) return true;
    if (typeof value === 'string') return value.trim().length === 0;
    if (Array.isArray(value)) return value.length === 0;
    if (value instanceof Map || value instanceof Set) return value.size === 0;
    if (typeof value === 'object') return Object.keys(value).length === 0;
    return false;
};

/**
 * Validates email format
 * @param {string} email - Email address to validate
 * @returns {boolean} True if email is valid
 */
export const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
};

/**
 * Generates a unique ID
 * @param {number} [length=8] - Length of the ID
 * @returns {string} Unique ID string
 */
export const generateId = (length = 8) => {
    return Math.random().toString(36).substring(2, 2 + length);
};