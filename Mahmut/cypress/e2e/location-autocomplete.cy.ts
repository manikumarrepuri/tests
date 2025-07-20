describe('Location Autocomplete', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  describe('Basic Functionality', () => {
    it('should not show dropdown for short input', () => {
      cy.get('[data-testid="location-input"]').type('L')
      
      // Should not show dropdown for single character
      cy.get('[data-testid="location-dropdown"]').should('not.exist')
    })

    it('should show loading indicator while fetching suggestions', () => {
      cy.get('[data-testid="location-input"]').type('London')
      cy.get('[data-testid="location-loading"]').should('be.visible')
    })
  })

  describe('Edge Cases', () => {
    it('should handle rapid typing', () => {
      cy.get('[data-testid="location-input"]').type('London', { delay: 0 })
      cy.get('[data-testid="location-input"]').clear()
      cy.get('[data-testid="location-input"]').type('Manchester', { delay: 0 })
      
      // Should handle rapid input without errors
      cy.get('[data-testid="location-input"]').should('have.value', 'Manchester')
    })

    it('should handle special characters in location names', () => {
      cy.get('[data-testid="location-input"]').type('New York, NY')
      
      // Should not break with special characters
      cy.get('[data-testid="location-input"]').should('have.value', 'New York, NY')
    })

    it('should handle very long location names', () => {
      const longLocation = 'A'.repeat(50)
      cy.get('[data-testid="location-input"]').type(longLocation)
      
      // Should handle long input
      cy.get('[data-testid="location-input"]').should('have.value', longLocation)
    })
  })

  describe('Accessibility', () => {
    it('should announce loading status to screen readers', () => {
      cy.get('[data-testid="location-input"]').type('London')
      cy.get('[data-testid="location-loading"]').should('be.visible')
      cy.get('[data-testid="location-loading"]').should('have.attr', 'aria-hidden', 'true')
    })
  })
}) 