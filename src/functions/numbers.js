export const numericInt = (value) => value && !isNaN(value) ? parseInt(value.toString().trim()) : 0;
export const numericFloat = (value) => value && !isNaN(value) ? parseFloat(value.toString().trim()) : 0;
export const containsNumber = (value) => /\d/.test(value);