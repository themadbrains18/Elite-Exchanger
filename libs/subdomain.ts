export const getValidSubdomain = (host?: string | null) => {
    let subdomain: string | null = null;
    if (!host && typeof window !== 'undefined') {
        // On client side, get the host from window
        host = window.location.host;
    }
    if (host && host.includes('.')) {
        const candidate = host.split('.')[0];
        if (candidate && !candidate.includes('localhost')) {
            // Valid candidate
            subdomain = candidate;
        }
    }
    return subdomain;
};

// export const truncateNumber = (num: number, decimals: number) => {
//     const factor = Math.pow(10, decimals);
//     return (num >= 0 ? Math.floor(num * factor) : Math.ceil(num * factor)) / factor;
// }


export const truncateNumber = (num: number, decimals: number) => {
    const valueString = num?.toString();
    const decimalIndex = valueString?.indexOf('.');

    if (decimalIndex === -1) {
        // No decimal point found, so return the value as is
        return valueString;
    }

    // Slice the string to include only up to 6 digits after the decimal point
    return valueString?.slice(0, decimalIndex + (decimals+1));
}