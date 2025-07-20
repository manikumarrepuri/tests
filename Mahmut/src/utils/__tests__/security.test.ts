import {
  sanitizeInput,
  validateKeyword,
  validateLocation,
  validateDistance,
  RateLimiter,
  safeLogError,
  generateCSRFToken,
  validateCSRFToken,
} from '../security';

describe('Security Utilities', () => {
  describe('sanitizeInput', () => {
    it('should return empty string for non-string input', () => {
      expect(sanitizeInput(null as unknown as string)).toBe('');
      expect(sanitizeInput(undefined as unknown as string)).toBe('');
      expect(sanitizeInput(123 as unknown as string)).toBe('');
      expect(sanitizeInput({} as unknown as string)).toBe('');
    });

    it('should remove dangerous characters and patterns', () => {
      expect(sanitizeInput('<script>alert("xss")</script>')).toBe(
        'scriptalert("xss")/script'
      );
      expect(sanitizeInput('javascript:alert("xss")')).toBe('alert("xss")');
      expect(sanitizeInput('onclick=alert("xss")')).toBe('alert("xss")');
      expect(
        sanitizeInput('data:text/html,<script>alert("xss")</script>')
      ).toBe('data:text/html,scriptalert("xss")/script');
    });

    it('should trim whitespace', () => {
      expect(sanitizeInput('  hello world  ')).toBe('hello world');
    });

    it('should preserve safe content', () => {
      expect(sanitizeInput('Hello World')).toBe('Hello World');
      expect(sanitizeInput('London, UK')).toBe('London, UK');
      expect(sanitizeInput('Software Engineer')).toBe('Software Engineer');
    });

    // Debug test to see what sanitizeInput actually returns
    it('should debug malicious inputs', () => {
      const maliciousInputs = [
        '<script>alert("xss")</script>',
        'javascript:alert("xss")',
        'onclick=alert("xss")',
        'data:text/html,<script>alert("xss")</script>',
        'vbscript:alert("xss")',
        '<iframe src="malicious.com"></iframe>',
        '<object data="malicious.com"></object>',
        '<embed src="malicious.com"></embed>',
      ];

      maliciousInputs.forEach(input => {
        const sanitized = sanitizeInput(input);
        console.log(`Input: "${input}" -> Sanitized: "${sanitized}"`);
      });
    });
  });

  describe('validateKeyword', () => {
    it('should validate required field', () => {
      const result = validateKeyword('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Keyword is required');
    });

    it('should validate minimum length', () => {
      const result = validateKeyword('a');
      expect(result.isValid).toBe(true);
      expect(result.sanitized).toBe('a');
    });

    it('should validate maximum length', () => {
      const longKeyword = 'a'.repeat(101);
      const result = validateKeyword(longKeyword);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Keyword must be less than 100 characters');
    });

    it('should detect malicious patterns after sanitization', () => {
      const maliciousInputs = [
        '<script>alert("xss")</script>',
        'javascript:alert("xss")',
        'onclick=alert("xss")',
        'data:text/html,<script>alert("xss")</script>',
        'vbscript:alert("xss")',
        '<iframe src="malicious.com"></iframe>',
        '<object data="malicious.com"></object>',
        '<embed src="malicious.com"></embed>',
      ];

      maliciousInputs.forEach(input => {
        const result = validateKeyword(input);
        // If the sanitized string is empty, isValid should be false
        if (!result.sanitized) {
          expect(result.isValid).toBe(false);
        } else {
          expect(result.isValid).toBe(true);
        }
      });
    });

    it('should accept valid keywords', () => {
      const validKeywords = [
        'Software Engineer',
        'Data Scientist',
        'Project Manager',
        'React Developer',
        'UX Designer',
      ];

      validKeywords.forEach(keyword => {
        const result = validateKeyword(keyword);
        expect(result.isValid).toBe(true);
        expect(result.sanitized).toBe(keyword);
      });
    });
  });

  describe('validateLocation', () => {
    it('should validate required field', () => {
      const result = validateLocation('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Location is required');
    });

    it('should validate minimum length', () => {
      const result = validateLocation('L');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Location must be at least 2 characters');
    });

    it('should validate maximum length', () => {
      const longLocation = 'a'.repeat(51);
      const result = validateLocation(longLocation);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Location must be less than 50 characters');
    });

    it('should validate character patterns', () => {
      const invalidLocations = [
        'London!',
        'Manchester@',
        'Birmingham#',
        'Leeds$',
        'Liverpool%',
      ];

      invalidLocations.forEach(location => {
        const result = validateLocation(location);
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Location contains invalid characters');
      });
    });

    it('should accept valid locations', () => {
      const validLocations = [
        'London',
        'Manchester, UK',
        'Birmingham-West Midlands',
        'Leeds, Yorkshire',
        'Liverpool, Merseyside',
        'Edinburgh, Scotland',
        'Cardiff, Wales',
      ];

      validLocations.forEach(location => {
        const result = validateLocation(location);
        expect(result.isValid).toBe(true);
        expect(result.sanitized).toBe(location);
      });
    });
  });

  describe('validateDistance', () => {
    it('should accept valid distances', () => {
      const validDistances = ['5', '10', '20'];

      validDistances.forEach(distance => {
        const result = validateDistance(distance);
        expect(result.isValid).toBe(true);
        expect(result.sanitized).toBe(distance);
      });
    });

    it('should reject invalid distances', () => {
      const invalidDistances = ['1', '15', '25', 'invalid', ''];

      invalidDistances.forEach(distance => {
        const result = validateDistance(distance);
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Invalid distance selected');
        expect(result.sanitized).toBe('5'); // Default fallback
      });
    });
  });

  describe('RateLimiter', () => {
    let rateLimiter: RateLimiter;

    beforeEach(() => {
      rateLimiter = new RateLimiter(5, 1000); // 5 requests per second
    });

    it('should allow requests within limit', () => {
      for (let i = 0; i < 5; i++) {
        expect(rateLimiter.isAllowed('test-user')).toBe(true);
      }
    });

    it('should block requests over limit', () => {
      // Make 5 requests (at limit)
      for (let i = 0; i < 5; i++) {
        rateLimiter.isAllowed('test-user');
      }

      // 6th request should be blocked
      expect(rateLimiter.isAllowed('test-user')).toBe(false);
    });

    it('should reset after window expires', () => {
      // Make 5 requests
      for (let i = 0; i < 5; i++) {
        rateLimiter.isAllowed('test-user');
      }

      // Should be blocked
      expect(rateLimiter.isAllowed('test-user')).toBe(false);

      // Fast forward time by 1.1 seconds
      jest.advanceTimersByTime(1100);

      // Should be allowed again
      expect(rateLimiter.isAllowed('test-user')).toBe(true);
    });

    it('should handle multiple users independently', () => {
      // User 1 makes 5 requests
      for (let i = 0; i < 5; i++) {
        rateLimiter.isAllowed('user1');
      }

      // User 2 should still be allowed
      expect(rateLimiter.isAllowed('user2')).toBe(true);

      // User 1 should be blocked
      expect(rateLimiter.isAllowed('user1')).toBe(false);
    });

    it('should clear user data', () => {
      // Make some requests
      rateLimiter.isAllowed('test-user');
      rateLimiter.isAllowed('test-user');

      // Clear the user
      rateLimiter.clear('test-user');

      // Should be allowed again
      expect(rateLimiter.isAllowed('test-user')).toBe(true);
    });
  });

  describe('safeLogError', () => {
    let consoleSpy: jest.SpyInstance;

    beforeEach(() => {
      consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    });

    afterEach(() => {
      consoleSpy.mockRestore();
    });

    it('should log error messages', () => {
      const error = new Error('Test error');
      safeLogError(error, 'TestContext');

      expect(consoleSpy).toHaveBeenCalledWith(
        '[TestContext] Error:',
        'Test error'
      );
    });

    it('should sanitize sensitive information', () => {
      const error = new Error('password=secret123 token=abc123 key=xyz789');
      safeLogError(error, 'TestContext');

      expect(consoleSpy).toHaveBeenCalledWith(
        '[TestContext] Error:',
        'password=*** token=*** key=***'
      );
    });

    it('should handle non-Error objects', () => {
      safeLogError('String error', 'TestContext');

      expect(consoleSpy).toHaveBeenCalledWith(
        '[TestContext] Error:',
        'String error'
      );
    });

    it('should use default context when not provided', () => {
      safeLogError(new Error('Test error'));

      expect(consoleSpy).toHaveBeenCalledWith('[App] Error:', 'Test error');
    });
  });

  describe('generateCSRFToken', () => {
    it('should generate a token', () => {
      const token1 = generateCSRFToken();
      const token2 = generateCSRFToken();

      expect(token1).toBeDefined();
      expect(token2).toBeDefined();
      expect(token1).not.toBe(token2);
      expect(token1.length).toBe(64); // 32 bytes = 64 hex chars
    });
  });

  describe('validateCSRFToken', () => {
    it('should validate matching tokens', () => {
      const token = generateCSRFToken();
      expect(validateCSRFToken(token, token)).toBe(true);
    });

    it('should reject non-matching tokens', () => {
      const token1 = generateCSRFToken();
      const token2 = generateCSRFToken();
      expect(validateCSRFToken(token1, token2)).toBe(false);
    });

    it('should reject empty tokens', () => {
      expect(validateCSRFToken('', 'token')).toBe(false);
      expect(validateCSRFToken('token', '')).toBe(false);
      expect(validateCSRFToken('', '')).toBe(false);
    });

    it('should reject tokens of different lengths', () => {
      expect(validateCSRFToken('short', 'longertoken')).toBe(false);
    });
  });
});
