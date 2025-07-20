describe('Form Validation', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  describe('Required Field Validation', () => {
    it('should show error when keyword is empty', () => {
      cy.get('[data-testid="location-input"]').type('London')
      cy.get('[data-testid="distance-select"]').select('10')
      cy.get('[data-testid="search-button"]').click()
      
      cy.get('[data-testid="keyword-input"]').should('have.attr', 'aria-invalid', 'true')
      cy.get('.error-message').should('contain', 'required')
    })

    it('should show error when location is empty', () => {
      cy.get('[data-testid="keyword-input"]').type('Software Engineer')
      cy.get('[data-testid="distance-select"]').select('10')
      cy.get('[data-testid="search-button"]').click()
      
      cy.get('[data-testid="location-input"]').should('have.attr', 'aria-invalid', 'true')
      cy.get('.error-message').should('contain', 'required')
    })

    it('should show multiple errors when multiple fields are empty', () => {
      cy.get('[data-testid="search-button"]').click()
      
      cy.get('.error-message').should('have.length.at.least', 2)
      cy.get('[data-testid="keyword-input"]').should('have.attr', 'aria-invalid', 'true')
      cy.get('[data-testid="location-input"]').should('have.attr', 'aria-invalid', 'true')
    })
  })

  describe('Field Length Validation', () => {
    it('should validate keyword maximum length', () => {
      const longKeyword = 'a'.repeat(101)
      cy.get('[data-testid="keyword-input"]').type(longKeyword)
      cy.get('[data-testid="keyword-input"]').blur()
      
      cy.get('[data-testid="keyword-input"]').should('have.attr', 'aria-invalid', 'true')
      cy.get('.error-message').should('contain', 'less than')
    })

    it('should validate location minimum length', () => {
      cy.get('[data-testid="location-input"]').type('a')
      cy.get('[data-testid="location-input"]').blur()
      
      cy.get('[data-testid="location-input"]').should('have.attr', 'aria-invalid', 'true')
      cy.get('.error-message').should('contain', 'at least')
    })

    it('should validate location maximum length', () => {
      const longLocation = 'a'.repeat(51)
      cy.get('[data-testid="location-input"]').type(longLocation)
      cy.get('[data-testid="location-input"]').blur()
      
      cy.get('[data-testid="location-input"]').should('have.attr', 'aria-invalid', 'true')
      cy.get('.error-message').should('contain', 'less than')
    })
  })

  describe('Input Sanitization', () => {
    it('should handle special characters in keyword', () => {
      cy.get('[data-testid="keyword-input"]').type('Software Engineer & Developer')
      cy.get('[data-testid="keyword-input"]').blur()
      
      // Should not show validation error for valid input
      cy.get('[data-testid="keyword-input"]').should('not.have.attr', 'aria-invalid', 'true')
    })

    it('should handle special characters in location', () => {
      cy.get('[data-testid="location-input"]').type('New York, NY')
      cy.get('[data-testid="location-input"]').blur()
      
      // Should not show validation error for valid input
      cy.get('[data-testid="location-input"]').should('not.have.attr', 'aria-invalid', 'true')
    })
  })

  describe('Real-time Validation', () => {
    it('should clear errors when user starts typing', () => {
      // Trigger validation errors
      cy.get('[data-testid="search-button"]').click()
      cy.get('.error-message').should('be.visible')
      
      // Start typing in keyword field
      cy.get('[data-testid="keyword-input"]').type('Software Engineer')
      cy.get('[data-testid="keyword-input"]').should('not.have.attr', 'aria-invalid', 'true')
      
      // Start typing in location field
      cy.get('[data-testid="location-input"]').type('London')
      cy.get('[data-testid="location-input"]').should('not.have.attr', 'aria-invalid', 'true')
    })

    it('should not show errors for untouched fields', () => {
      cy.get('[data-testid="keyword-input"]').type('Software Engineer')
      cy.get('[data-testid="location-input"]').type('London')
      
      // Should not show errors for valid, untouched fields
      cy.get('[data-testid="keyword-input"]').should('not.have.attr', 'aria-invalid', 'true')
      cy.get('[data-testid="location-input"]').should('not.have.attr', 'aria-invalid', 'true')
    })
  })

  describe('Form Submission with Validation', () => {
    it('should prevent submission with invalid data', () => {
      cy.get('[data-testid="search-button"]').click()
      
      // Form should not submit
      cy.get('[data-testid="search-button"]').should('not.be.disabled')
      cy.get('[data-testid="loading-status"]').should('not.exist')
    })

    it('should allow submission with valid data', () => {
      cy.get('[data-testid="keyword-input"]').type('Software Engineer')
      cy.get('[data-testid="location-input"]').type('London')
      cy.get('[data-testid="distance-select"]').select('10')
      
      cy.get('[data-testid="search-button"]').click()
      
      // Should show loading state
      cy.get('[data-testid="search-button"]').should('be.disabled')
      cy.get('[data-testid="loading-status"]').should('be.visible')
    })

    it('should reset validation state after successful submission', () => {
      cy.get('[data-testid="keyword-input"]').type('Software Engineer')
      cy.get('[data-testid="location-input"]').type('London')
      cy.get('[data-testid="distance-select"]').select('10')
      
      cy.get('[data-testid="search-button"]').click()
      
      // Wait for submission to complete
      cy.get('[data-testid="search-button"]').should('not.be.disabled', { timeout: 15000 })
      
      // Form should be reset and validation state cleared
      cy.get('[data-testid="keyword-input"]').should('have.value', '')
      cy.get('[data-testid="location-input"]').should('have.value', '')
      cy.get('.error-message').should('not.exist')
    })
  })

  describe('Accessibility in Validation', () => {
    it('should announce validation errors to screen readers', () => {
      cy.get('[data-testid="search-button"]').click()
      
      cy.get('.error-message').should('have.attr', 'role', 'alert')
      cy.get('.error-message').should('have.attr', 'aria-live', 'polite')
    })
  })

  describe('Edge Cases', () => {
    it('should handle rapid typing and validation', () => {
      cy.get('[data-testid="keyword-input"]').type('Software Engineer', { delay: 0 })
      cy.get('[data-testid="location-input"]').type('London', { delay: 0 })
      
      // Should not show validation errors for valid input
      cy.get('[data-testid="keyword-input"]').should('not.have.attr', 'aria-invalid', 'true')
      cy.get('[data-testid="location-input"]').should('not.have.attr', 'aria-invalid', 'true')
    })

    it('should handle validation with empty strings', () => {
      cy.get('[data-testid="keyword-input"]').clear()
      cy.get('[data-testid="keyword-input"]').blur()
      
      cy.get('[data-testid="keyword-input"]').should('have.attr', 'aria-invalid', 'true')
    })
  })
}) 