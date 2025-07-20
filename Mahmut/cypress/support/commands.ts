declare global {
  namespace Cypress {
    interface Chainable {
      fillSearchForm(keyword: string, location: string, distance: string): Chainable<void>
      
      submitSearchForm(): Chainable<void>
      
      switchTab(tabName: string): Chainable<void>
      
      waitForLocationSuggestions(): Chainable<void>
      
      selectLocationFromDropdown(location: string): Chainable<void>
    }
  }
}

Cypress.Commands.add('fillSearchForm', (keyword: string, location: string, distance: string) => {
  cy.get('[data-testid="keyword-input"]').clear().type(keyword)
  cy.get('[data-testid="location-input"]').clear().type(location)
  cy.get('[data-testid="distance-select"]').select(distance)
})

// Custom command to submit the search form
Cypress.Commands.add('submitSearchForm', () => {
  cy.get('[data-testid="search-button"]').click()
})

// Custom command to switch tabs
Cypress.Commands.add('switchTab', (tabName: string) => {
  cy.get('[role="tab"]').contains(tabName).click()
})

// Custom command to wait for location suggestions
Cypress.Commands.add('waitForLocationSuggestions', () => {
  cy.get('[data-testid="location-dropdown"]').should('be.visible')
})

// Custom command to select location from dropdown
Cypress.Commands.add('selectLocationFromDropdown', (location: string) => {
  cy.get('[data-testid="location-dropdown"]').within(() => {
    cy.contains(location).click()
  })
})

export {} 