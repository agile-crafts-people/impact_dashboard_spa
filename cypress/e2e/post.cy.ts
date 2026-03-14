describe('Post Domain', () => {
  beforeEach(() => {
    cy.login()
  })

  it('should display posts list page', () => {
    cy.visit('/posts')
    cy.get('h1').contains('Posts').should('be.visible')
    cy.get('[data-automation-id="post-list-new-button"]').should('be.visible')
  })

  it('should navigate to new post page', () => {
    cy.visit('/posts')
    cy.get('[data-automation-id="post-list-new-button"]').click()
    cy.url().should('include', '/posts/new')
    cy.get('h1').contains('New Post').should('be.visible')
  })

  it('should create a new post document', () => {
    cy.visit('/posts/new')
    
    const timestamp = Date.now()
    const itemName = `test-post-${timestamp}`
    
    cy.get('[data-automation-id="post-new-name-input"]').type(itemName)
    cy.get('[data-automation-id="post-new-description-input"]').type('Test description for Cypress')
    cy.get('[data-automation-id="post-new-status-input"]').type('active')
    cy.get('[data-automation-id="post-new-submit-button"]').click()
    
    // Should redirect to view page after creation
    cy.url().should('include', '/posts/')
    cy.url().should('not.include', '/posts/new')
    
    // Verify the post name is displayed on view page (in a text field, not h1)
    cy.get('input[readonly]').first().should('have.value', itemName)
  })

  it('should search for posts', () => {
    // First create a post with a unique name
    cy.visit('/posts/new')
    const timestamp = Date.now()
    const itemName = `search-test-post-${timestamp}`
    
    cy.get('[data-automation-id="post-new-name-input"]').type(itemName)
    cy.get('[data-automation-id="post-new-description-input"]').type('Search test description')
    cy.get('[data-automation-id="post-new-status-input"]').type('active')
    cy.get('[data-automation-id="post-new-submit-button"]').click()
    cy.url().should('include', '/posts/')
    
    // Navigate to list page
    cy.visit('/posts')
    
    // Wait for initial load
    cy.get('table').should('exist')
    
    // Search for the post
    cy.get('[data-automation-id="post-list-search"]').find('input').type(itemName)
    // Wait for debounce (300ms) plus API call
    cy.wait(800)
    
    // Verify the search results contain the post
    cy.get('table tbody').should('contain', itemName)
    
    // Clear search and verify all posts are shown again
    cy.get('[data-automation-id="post-list-search"]').find('input').clear()
    cy.wait(800)
    cy.get('table').should('exist')
  })
})
