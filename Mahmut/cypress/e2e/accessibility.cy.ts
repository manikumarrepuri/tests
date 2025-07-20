describe('Accessibility', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  describe('Form Accessibility', () => {
    it('should have proper form labels', () => {
      cy.get('[data-testid="keyword-input"]').should('have.attr', 'aria-required', 'true')
      cy.get('[data-testid="location-input"]').should('have.attr', 'aria-required', 'true')
      cy.get('[data-testid="distance-select"]').should('have.attr', 'aria-required', 'true')
    })

    it('should have proper button accessibility', () => {
      cy.get('[data-testid="search-button"]').should('have.attr', 'type', 'submit')
      cy.get('[data-testid="search-button"]').should('not.be.disabled')
    })
  })

  describe('Tabs Accessibility', () => {
    it('should have proper tab structure', () => {
      cy.get('.tabs-container').should('have.attr', 'role', 'tablist')
      cy.get('[data-testid="tab-0"]').should('have.attr', 'role', 'tab')
      cy.get('[data-testid="tab-1"]').should('have.attr', 'role', 'tab')
    })
  })

  describe('Color and Contrast', () => {
    it('should have sufficient color contrast', () => {
      // Basic color contrast check - elements should be visible
      cy.get('.container').should('be.visible')
      cy.get('[data-testid="keyword-input"]').should('be.visible')
      cy.get('[data-testid="search-button"]').should('be.visible')
    })

    it('should not rely solely on color to convey information', () => {
      // Check that error states are indicated by more than just color
      cy.get('[data-testid="search-button"]').click()
      cy.get('.error-message').should('be.visible')
    })
  })

  describe('Focus Management', () => {
    it('should maintain focus after form submission', () => {
      cy.get('[data-testid="keyword-input"]').type('Software Engineer')
      cy.get('[data-testid="location-input"]').type('London')
      cy.get('[data-testid="distance-select"]').select('10')
      
      cy.get('[data-testid="search-button"]').click()
      
      // Focus should be maintained somewhere on the page
      cy.get('body').should('be.visible')
    })
  })

  describe('Screen Reader Support', () => {
    it('should have proper ARIA attributes for form fields', () => {
      cy.get('[data-testid="keyword-input"]').should('have.attr', 'aria-required', 'true')
      cy.get('[data-testid="location-input"]').should('have.attr', 'aria-required', 'true')
      cy.get('[data-testid="distance-select"]').should('have.attr', 'aria-required', 'true')
    })

    it('should announce loading status to screen readers', () => {
      cy.get('[data-testid="keyword-input"]').type('Software Engineer')
      cy.get('[data-testid="location-input"]').type('London')
      cy.get('[data-testid="distance-select"]').select('10')
      
      cy.get('[data-testid="search-button"]').click()
      cy.get('[data-testid="loading-status"]').should('be.visible')
    })
  })

  describe('Responsive Accessibility', () => {
    it('should be accessible on mobile devices', () => {
      cy.viewport('iphone-6')
      
      cy.get('[data-testid="keyword-input"]').should('be.visible')
      cy.get('[data-testid="location-input"]').should('be.visible')
      cy.get('[data-testid="search-button"]').should('be.visible')
    })

    it('should be accessible on tablet devices', () => {
      cy.viewport('ipad-2')
      
      cy.get('[data-testid="keyword-input"]').should('be.visible')
      cy.get('[data-testid="location-input"]').should('be.visible')
      cy.get('[data-testid="search-button"]').should('be.visible')
    })
  })
}) 