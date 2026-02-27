describe('Navigation Drawer', () => {
  beforeEach(() => {
    cy.login()
  })

  it('should open navigation drawer with hamburger menu', () => {
    cy.visit('/dashboards')
    cy.get('[data-automation-id="nav-drawer-toggle"]').should('be.visible')
    cy.get('[data-automation-id="nav-drawer-toggle"]').click()
    
    // Check that drawer is visible with domain sections
    cy.contains('DASHBOARD DOMAIN').should('be.exist')
    cy.contains('POST DOMAIN').should('be.exist')
    cy.contains('COMMENT DOMAIN').should('be.exist')
    cy.contains('CLASSIFICATION DOMAIN').should('be.exist')
    cy.contains('PROFILE DOMAIN').should('be.exist')
  })
  it('should have all dashboard domain links in drawer', () => {
    cy.visit('/dashboards')
    cy.get('[data-automation-id="nav-drawer-toggle"]').click()
    
    cy.get('[data-automation-id="nav-dashboards-list-link"]').should('be.visible')
    cy.get('[data-automation-id="nav-dashboards-new-link"]').should('be.visible')
  })
  it('should have all post domain links in drawer', () => {
    cy.visit('/dashboards')
    cy.get('[data-automation-id="nav-drawer-toggle"]').click()
    
    cy.get('[data-automation-id="nav-posts-list-link"]').should('be.visible')
    cy.get('[data-automation-id="nav-posts-new-link"]').should('be.visible')
  })
  it('should have all comment domain links in drawer', () => {
    cy.visit('/dashboards')
    cy.get('[data-automation-id="nav-drawer-toggle"]').click()
    
    cy.get('[data-automation-id="nav-comments-list-link"]').should('be.visible')
    cy.get('[data-automation-id="nav-comments-new-link"]').should('be.visible')
  })
  it('should have classification domain link in drawer', () => {
    cy.visit('/dashboards')
    cy.get('[data-automation-id="nav-drawer-toggle"]').click()
    
    cy.get('[data-automation-id="nav-classifications-list-link"]').should('be.visible')
  })
  it('should have profile domain link in drawer', () => {
    cy.visit('/dashboards')
    cy.get('[data-automation-id="nav-drawer-toggle"]').click()
    
    cy.get('[data-automation-id="nav-profiles-list-link"]').should('be.visible')
  })

  it('should have admin and logout at bottom of drawer', () => {
    // Login with admin role to see admin link
    cy.login(['admin'])
    cy.visit('/dashboards')
    cy.get('[data-automation-id="nav-drawer-toggle"]').click()
    
    // Admin and Logout should be visible in the drawer
    cy.get('[data-automation-id="nav-admin-link"]').should('be.visible')
    cy.get('[data-automation-id="nav-logout-link"]').should('be.visible')
  })

  it('should navigate to different pages from drawer', () => {
    cy.visit('/dashboards')
    cy.get('[data-automation-id="nav-drawer-toggle"]').click()
    
    cy.get('[data-automation-id="nav-posts-list-link"]').click()
    cy.url().should('include', '/posts')
  })

  it('should close drawer after navigation', () => {
    cy.visit('/dashboards')
    cy.get('[data-automation-id="nav-drawer-toggle"]').click()
    
    cy.get('[data-automation-id="nav-posts-list-link"]').click()
    
    // Drawer should close after navigation (temporary drawer)
    cy.wait(500)
    cy.contains('DASHBOARD DOMAIN').should('not.be.visible')
  })
})