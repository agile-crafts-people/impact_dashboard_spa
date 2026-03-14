describe('Comment Domain', () => {
  beforeEach(() => {
    cy.login()
  })

  it('should display comments list page', () => {
    cy.visit('/comments')
    cy.get('h1').contains('Comments').should('be.visible')
    cy.get('[data-automation-id="comment-list-new-button"]').should('be.visible')
  })

  it('should navigate to new comment page', () => {
    cy.visit('/comments')
    cy.get('[data-automation-id="comment-list-new-button"]').click()
    cy.url().should('include', '/comments/new')
    cy.get('h1').contains('New Comment').should('be.visible')
  })

  it('should create a new comment document', () => {
    cy.visit('/comments/new')
    
    const timestamp = Date.now()
    const itemName = `test-comment-${timestamp}`
    
    cy.get('[data-automation-id="comment-new-name-input"]').type(itemName)
    cy.get('[data-automation-id="comment-new-description-input"]').type('Test description for Cypress')
    cy.get('[data-automation-id="comment-new-status-input"]').type('active')
    cy.get('[data-automation-id="comment-new-submit-button"]').click()
    
    // Should redirect to view page after creation
    cy.url().should('include', '/comments/')
    cy.url().should('not.include', '/comments/new')
    
    // Verify the comment name is displayed on view page (in a text field, not h1)
    cy.get('input[readonly]').first().should('have.value', itemName)
  })

  it('should search for comments', () => {
    // First create a comment with a unique name
    cy.visit('/comments/new')
    const timestamp = Date.now()
    const itemName = `search-test-comment-${timestamp}`
    
    cy.get('[data-automation-id="comment-new-name-input"]').type(itemName)
    cy.get('[data-automation-id="comment-new-description-input"]').type('Search test description')
    cy.get('[data-automation-id="comment-new-status-input"]').type('active')
    cy.get('[data-automation-id="comment-new-submit-button"]').click()
    cy.url().should('include', '/comments/')
    
    // Navigate to list page
    cy.visit('/comments')
    
    // Wait for initial load
    cy.get('table').should('exist')
    
    // Search for the comment
    cy.get('[data-automation-id="comment-list-search"]').find('input').type(itemName)
    // Wait for debounce (300ms) plus API call
    cy.wait(800)
    
    // Verify the search results contain the comment
    cy.get('table tbody').should('contain', itemName)
    
    // Clear search and verify all comments are shown again
    cy.get('[data-automation-id="comment-list-search"]').find('input').clear()
    cy.wait(800)
    cy.get('table').should('exist')
  })
})
