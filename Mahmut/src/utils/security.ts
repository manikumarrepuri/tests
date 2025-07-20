// Security utilities for input validation and sanitization

/**
 * Sanitize user input to prevent XSS attacks
 */
export const sanitizeInput = (input: string): string => {
  if (typeof input !== 'string') {
    return '';
  }

  // Remove potentially dangerous characters and patterns
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
};

/**
 * Validate and sanitize keyword input
 */
export const validateKeyword = (
  keyword: string
): { isValid: boolean; sanitized: string; error?: string } => {
  const sanitized = sanitizeInput(keyword);

  if (!sanitized) {
    return { isValid: false, sanitized: '', error: 'Keyword is required' };
  }

  if (sanitized.length < 1) {
    return {
      isValid: false,
      sanitized: '',
      error: 'Keyword must be at least 1 character',
    };
  }

  if (sanitized.length > 100) {
    return {
      isValid: false,
      sanitized: '',
      error: 'Keyword must be less than 100 characters',
    };
  }

  // Check for potentially malicious patterns
  const maliciousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+=/i,
    /data:text\/html/i,
    /vbscript:/i,
    /<iframe/i,
    /<object/i,
    /<embed/i,
  ];

  for (const pattern of maliciousPatterns) {
    if (pattern.test(sanitized)) {
      return {
        isValid: false,
        sanitized: '',
        error: 'Invalid characters detected',
      };
    }
  }

  return { isValid: true, sanitized };
};

/**
 * Validate and sanitize location input
 */
export const validateLocation = (
  location: string
): { isValid: boolean; sanitized: string; error?: string } => {
  const sanitized = sanitizeInput(location);

  if (!sanitized) {
    return { isValid: false, sanitized: '', error: 'Location is required' };
  }

  if (sanitized.length < 2) {
    return {
      isValid: false,
      sanitized: '',
      error: 'Location must be at least 2 characters',
    };
  }

  if (sanitized.length > 50) {
    return {
      isValid: false,
      sanitized: '',
      error: 'Location must be less than 50 characters',
    };
  }

  // Allow only letters, numbers, spaces, commas, hyphens, and periods
  const validPattern = /^[a-zA-Z0-9\s,\-\.]+$/;
  if (!validPattern.test(sanitized)) {
    return {
      isValid: false,
      sanitized: '',
      error: 'Location contains invalid characters',
    };
  }

  return { isValid: true, sanitized };
};

/**
 * Validate distance value
 */
export const validateDistance = (
  distance: string
): { isValid: boolean; sanitized: string; error?: string } => {
  const validDistances = ['5', '10', '20'];

  if (!validDistances.includes(distance)) {
    return {
      isValid: false,
      sanitized: '5',
      error: 'Invalid distance selected',
    };
  }

  return { isValid: true, sanitized: distance };
};

/**
 * Rate limiting utility
 */
export class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private maxRequests: number;
  private windowMs: number;

  constructor(maxRequests: number = 10, windowMs: number = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const userRequests = this.requests.get(identifier) || [];

    // Remove old requests outside the window
    const recentRequests = userRequests.filter(
      time => now - time < this.windowMs
    );

    if (recentRequests.length >= this.maxRequests) {
      return false;
    }

    // Add current request
    recentRequests.push(now);
    this.requests.set(identifier, recentRequests);

    return true;
  }

  clear(identifier: string): void {
    this.requests.delete(identifier);
  }
}

/**
 * Safe error logging (prevents sensitive data exposure)
 */
export const safeLogError = (error: unknown, context?: string): void => {
  const errorMessage = error instanceof Error ? error.message : String(error);

  // Don't log sensitive information
  const sanitizedMessage = errorMessage
    .replace(/password[=:]\s*\S+/gi, 'password=***')
    .replace(/token[=:]\s*\S+/gi, 'token=***')
    .replace(/key[=:]\s*\S+/gi, 'key=***');

  console.error(`[${context || 'App'}] Error:`, sanitizedMessage);


};

/**
 * Generate CSRF token (for future use)
 */
export const generateCSRFToken = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

/**
 * Validate CSRF token
 */
export const validateCSRFToken = (
  token: string,
  storedToken: string
): boolean => {
  if (!token || !storedToken) {
    return false;
  }

  // Use timing-safe comparison to prevent timing attacks
  if (token.length !== storedToken.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < token.length; i++) {
    result |= token.charCodeAt(i) ^ storedToken.charCodeAt(i);
  }

  return result === 0;
};
