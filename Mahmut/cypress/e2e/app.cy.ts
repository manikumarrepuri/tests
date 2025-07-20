describe('React CV Library Application', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  describe('Page Load and Initial State', () => {
    it('should load the application successfully', () => {
      cy.get('.container').should('be.visible')
      cy.get('.logo').should('be.visible')
      cy.get('[data-testid="keyword-input"]').should('be.visible')
      cy.get('[data-testid="location-input"]').should('be.visible')
      cy.get('[data-testid="distance-select"]').should('be.visible')
      cy.get('[data-testid="search-button"]').should('be.visible')
    })

    it('should display the correct page title', () => {
      cy.title().should('not.be.empty')
    })

    it('should have proper accessibility attributes', () => {
      cy.get('[data-testid="keyword-input"]').should('have.attr', 'aria-required', 'true')
      cy.get('[data-testid="location-input"]').should('have.attr', 'aria-required', 'true')
      cy.get('[data-testid="distance-select"]').should('have.attr', 'aria-required', 'true')
    })
  })

  describe('Search Form Functionality', () => {
    it('should allow typing in keyword field', () => {
      const testKeyword = 'Software Engineer'
      cy.get('[data-testid="keyword-input"]')
        .clear()
        .type(testKeyword)
        .should('have.value', testKeyword)
    })

    it('should allow typing in location field', () => {
      const testLocation = 'London'
      cy.get('[data-testid="location-input"]')
        .clear()
        .type(testLocation)
        .should('have.value', testLocation)
    })

    it('should allow selecting distance', () => {
      cy.get('[data-testid="distance-select"]')
        .select('10')
        .should('have.value', '10')
    })

    it('should show validation errors for empty required fields', () => {
      cy.get('[data-testid="search-button"]').click()
      
      // Should show validation errors
      cy.get('.error-message').should('be.visible')
      cy.get('[data-testid="keyword-input"]').should('have.attr', 'aria-invalid', 'true')
      cy.get('[data-testid="location-input"]').should('have.attr', 'aria-invalid', 'true')
    })

    it('should clear validation errors when user starts typing', () => {
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

    it('should submit form successfully with valid data', () => {
      // Fill form with valid data
      cy.get('[data-testid="keyword-input"]').type('Software Engineer')
      cy.get('[data-testid="location-input"]').type('London')
      cy.get('[data-testid="distance-select"]').select('10')
      
      // Submit form
      cy.get('[data-testid="search-button"]').click()
      
      // Should show loading state
      cy.get('[data-testid="search-button"]').should('be.disabled')
      cy.get('[data-testid="loading-status"]').should('be.visible')
      
      // Wait for submission to complete
      cy.get('[data-testid="search-button"]').should('not.be.disabled', { timeout: 15000 })
      
      // Form should be reset after successful submission
      cy.get('[data-testid="keyword-input"]').should('have.value', '')
      cy.get('[data-testid="location-input"]').should('have.value', '')
      cy.get('[data-testid="distance-select"]').should('have.value', '5')
    })

    it('should handle form submission with custom command', () => {
      cy.fillSearchForm('Software Engineer', 'London', '10')
      cy.submitSearchForm()
      
      // Should show loading state
      cy.get('[data-testid="search-button"]').should('be.disabled')
      cy.get('[data-testid="loading-status"]').should('be.visible')
    })
  })

  describe('Location Autocomplete', () => {
    it('should show loading indicator while fetching suggestions', () => {
      cy.get('[data-testid="location-input"]').type('London')
      cy.get('[data-testid="location-loading"]').should('be.visible')
    })
  })

  describe('Tabs Functionality', () => {
    it('should display both tabs', () => {
      cy.get('[data-testid="tab-0"]').should('contain', 'Jobs by Location')
      cy.get('[data-testid="tab-1"]').should('contain', 'Jobs by Industry')
    })

    it('should have first tab active by default', () => {
      cy.get('[data-testid="tab-0"]').should('have.class', 'active')
      cy.get('[data-testid="tabpanel-0"]').should('be.visible')
    })

    it('should switch to second tab when clicked', () => {
      cy.get('[data-testid="tab-1"]').click()
      cy.get('[data-testid="tab-1"]').should('have.class', 'active')
      cy.get('[data-testid="tab-0"]').should('not.have.class', 'active')
      cy.get('[data-testid="tabpanel-1"]').should('be.visible')
    })

    it('should handle tab switching with custom command', () => {
      cy.switchTab('Jobs by Industry')
      cy.get('[data-testid="tab-1"]').should('have.class', 'active')
      cy.get('[data-testid="tabpanel-1"]').should('be.visible')
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA attributes for tabs', () => {
      cy.get('[data-testid="tab-0"]').should('have.attr', 'aria-selected', 'true')
      cy.get('[data-testid="tab-1"]').should('have.attr', 'aria-selected', 'false')
      cy.get('[data-testid="tab-0"]').should('have.attr', 'role', 'tab')
      cy.get('[data-testid="tabpanel-0"]').should('have.attr', 'role', 'tabpanel')
    })

    it('should have proper ARIA attributes for form fields', () => {
      cy.get('[data-testid="keyword-input"]').should('have.attr', 'aria-required', 'true')
      cy.get('[data-testid="location-input"]').should('have.attr', 'aria-required', 'true')
      cy.get('[data-testid="distance-select"]').should('have.attr', 'aria-required', 'true')
    })

    it('should announce loading status to screen readers', () => {
      cy.fillSearchForm('Software Engineer', 'London', '10')
      cy.submitSearchForm()
      cy.get('[data-testid="loading-status"]').should('be.visible')
    })
  })

  describe('Responsive Design', () => {
    it('should work on mobile viewport', () => {
      cy.viewport('iphone-6')
      cy.get('.container').should('be.visible')
      cy.get('[data-testid="keyword-input"]').should('be.visible')
      cy.get('[data-testid="location-input"]').should('be.visible')
      cy.get('[data-testid="search-button"]').should('be.visible')
    })

    it('should work on tablet viewport', () => {
      cy.viewport('ipad-2')
      cy.get('.container').should('be.visible')
      cy.get('[data-testid="keyword-input"]').should('be.visible')
      cy.get('[data-testid="location-input"]').should('be.visible')
      cy.get('[data-testid="search-button"]').should('be.visible')
    })
  })
}) 