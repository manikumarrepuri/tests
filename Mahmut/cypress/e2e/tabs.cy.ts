describe('Tabs Functionality', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  describe('Tab Display and Structure', () => {
    it('should display both tabs with correct labels', () => {
      cy.get('[data-testid="tab-0"]').should('contain', 'Jobs by Location')
      cy.get('[data-testid="tab-1"]').should('contain', 'Jobs by Industry')
    })

    it('should have proper tab structure', () => {
      cy.get('.tabs-container').should('have.attr', 'role', 'tablist')
      cy.get('.tabs-container').should('have.attr', 'aria-label', 'Job categories')
      
      cy.get('[data-testid="tab-0"]').should('have.attr', 'role', 'tab')
      cy.get('[data-testid="tab-1"]').should('have.attr', 'role', 'tab')
    })
  })

  describe('Default Tab State', () => {
    it('should have first tab active by default', () => {
      cy.get('[data-testid="tab-0"]').should('have.class', 'active')
      cy.get('[data-testid="tab-1"]').should('not.have.class', 'active')
    })
  })

  describe('Tab Switching', () => {
    it('should switch to second tab when clicked', () => {
      cy.get('[data-testid="tab-1"]').click()
      
      cy.get('[data-testid="tab-1"]').should('have.class', 'active')
      cy.get('[data-testid="tab-0"]').should('not.have.class', 'active')
    })

    it('should switch back to first tab when clicked', () => {
      // Switch to second tab
      cy.get('[data-testid="tab-1"]').click()
      cy.get('[data-testid="tab-1"]').should('have.class', 'active')
      
      // Switch back to first tab
      cy.get('[data-testid="tab-0"]').click()
      cy.get('[data-testid="tab-0"]').should('have.class', 'active')
      cy.get('[data-testid="tab-1"]').should('not.have.class', 'active')
    })

    it('should handle rapid tab switching', () => {
      cy.get('[data-testid="tab-1"]').click()
      cy.get('[data-testid="tab-0"]').click()
      cy.get('[data-testid="tab-1"]').click()
      
      cy.get('[data-testid="tab-1"]').should('have.class', 'active')
    })
  })

  describe('Tab Content', () => {
    it('should have proper list structure in tab content', () => {
      cy.get('[data-testid="tabpanel-0"] ul').should('exist')
      cy.get('[data-testid="tabpanel-0"] li').should('have.length.at.least', 6)
      
      cy.get('[data-testid="tab-1"]').click()
      cy.get('[data-testid="tabpanel-1"] ul').should('exist')
      cy.get('[data-testid="tabpanel-1"] li').should('have.length.at.least', 6)
    })

    it('should maintain content when switching between tabs', () => {
      // Check first tab content
      cy.get('[data-testid="tabpanel-0"]').should('contain', 'Birmingham')
      
      // Switch to second tab
      cy.get('[data-testid="tab-1"]').click()
      cy.get('[data-testid="tabpanel-1"]').should('contain', 'Engineering')
      
      // Switch back to first tab
      cy.get('[data-testid="tab-0"]').click()
      cy.get('[data-testid="tabpanel-0"]').should('contain', 'Birmingham')
    })
  })

  describe('Accessibility', () => {
    it('should announce tab changes to screen readers', () => {
      cy.get('[data-testid="tab-1"]').click()
      
      // Tab should be announced as selected
      cy.get('[data-testid="tab-1"]').should('have.attr', 'aria-selected', 'true')
    })

    it('should maintain focus management', () => {
      cy.get('[data-testid="tab-1"]').click()
      
      // Focus should remain on the clicked tab
      cy.get('[data-testid="tab-1"]').should('be.focused')
    })
  })

  describe('Custom Commands', () => {
    it('should work with custom switchTab command', () => {
      cy.switchTab('Jobs by Industry')
      cy.get('[data-testid="tab-1"]').should('have.class', 'active')
      cy.get('[data-testid="tabpanel-1"]').should('be.visible')
      
      cy.switchTab('Jobs by Location')
      cy.get('[data-testid="tab-0"]').should('have.class', 'active')
      cy.get('[data-testid="tabpanel-0"]').should('be.visible')
    })
  })

  describe('Edge Cases', () => {
    it('should handle rapid clicking on same tab', () => {
      cy.get('[data-testid="tab-0"]').click()
      cy.get('[data-testid="tab-0"]').click()
      cy.get('[data-testid="tab-0"]').click()
      
      // Should remain active
      cy.get('[data-testid="tab-0"]').should('have.class', 'active')
      cy.get('[data-testid="tabpanel-0"]').should('be.visible')
    })

    it('should handle rapid switching between tabs', () => {
      cy.get('[data-testid="tab-1"]').click()
      cy.get('[data-testid="tab-0"]').click()
      cy.get('[data-testid="tab-1"]').click()
      cy.get('[data-testid="tab-0"]').click()
      
      // Should end up on first tab
      cy.get('[data-testid="tab-0"]').should('have.class', 'active')
      cy.get('[data-testid="tabpanel-0"]').should('be.visible')
    })

    it('should maintain state during form interactions', () => {
      // Switch to second tab
      cy.get('[data-testid="tab-1"]').click()
      cy.get('[data-testid="tabpanel-1"]').should('be.visible')
      
      // Interact with form
      cy.get('[data-testid="keyword-input"]').type('Test')
      
      // Tab should still be active
      cy.get('[data-testid="tab-1"]').should('have.class', 'active')
      cy.get('[data-testid="tabpanel-1"]').should('be.visible')
    })
  })

  describe('Responsive Behavior', () => {
    it('should work on mobile viewport', () => {
      cy.viewport('iphone-6')
      
      cy.get('[data-testid="tab-0"]').should('be.visible')
      cy.get('[data-testid="tab-1"]').should('be.visible')
      cy.get('[data-testid="tabpanel-0"]').should('be.visible')
      
      cy.get('[data-testid="tab-1"]').click()
      cy.get('[data-testid="tabpanel-1"]').should('be.visible')
    })

    it('should work on tablet viewport', () => {
      cy.viewport('ipad-2')
      
      cy.get('[data-testid="tab-0"]').should('be.visible')
      cy.get('[data-testid="tab-1"]').should('be.visible')
      cy.get('[data-testid="tabpanel-0"]').should('be.visible')
      
      cy.get('[data-testid="tab-1"]').click()
      cy.get('[data-testid="tabpanel-1"]').should('be.visible')
    })

    it('should work on desktop viewport', () => {
      cy.viewport(1920, 1080)
      
      cy.get('[data-testid="tab-0"]').should('be.visible')
      cy.get('[data-testid="tab-1"]').should('be.visible')
      cy.get('[data-testid="tabpanel-0"]').should('be.visible')
      
      cy.get('[data-testid="tab-1"]').click()
      cy.get('[data-testid="tabpanel-1"]').should('be.visible')
    })
  })

  describe('Integration with Form', () => {
    it('should not interfere with form functionality', () => {
      // Fill form
      cy.get('[data-testid="keyword-input"]').type('Software Engineer')
      cy.get('[data-testid="location-input"]').type('London')
      cy.get('[data-testid="distance-select"]').select('10')
      
      // Switch tabs
      cy.get('[data-testid="tab-1"]').click()
      cy.get('[data-testid="tab-0"]').click()
      
      // Form should still work
      cy.get('[data-testid="search-button"]').should('be.visible')
      cy.get('[data-testid="search-button"]').should('not.be.disabled')
    })

    it('should maintain form state when switching tabs', () => {
      // Fill form
      cy.get('[data-testid="keyword-input"]').type('Software Engineer')
      cy.get('[data-testid="location-input"]').type('London')
      
      // Switch tabs
      cy.get('[data-testid="tab-1"]').click()
      cy.get('[data-testid="tab-0"]').click()
      
      // Form values should be preserved
      cy.get('[data-testid="keyword-input"]').should('have.value', 'Software Engineer')
      cy.get('[data-testid="location-input"]').should('have.value', 'London')
    })
  })
}) 