describe('Login spec', () => {
  it('Should verify that page exists', () => {
    cy.visit('/login')

    cy.get('.mat-card-title')
      .should('exist')
      .and('contain.text', 'Login')
  })

  it('Should have an empty input error', () => {
    cy.visit('/login')

    cy.get('input[formControlName=email]').focus().blur()
    cy.get('input[formControlName=password]').focus()

    cy.get('input[formControlName=email]')
      .should('have.class', 'ng-invalid')
  })

  it('Should toggle password visibility', () => {
    cy.visit('/login')

    cy.get('input[formControlName=password]')
      .should('have.attr', 'type', 'password')
      .type('test123')

    cy.get('button[data-testid=toggle-pass-button]').click()

    cy.get('input[formControlName=password]')
      .should('have.attr', 'type', 'text')
  })

  it('Should enable submit button', () => {
    cy.visit('/login')

    cy.get('input[formControlName=email]').type("yoga@studio.com")
    cy.get('input[formControlName=password]').type('test123')
    cy.get('button[data-testid=submit-button]').should('not.be.disabled')
  })

  it('Should get successfull login', () => {
    cy.visit('/login')

    cy.intercept('POST', '/api/auth/login', {
      body: {
        id: 1,
        username: 'userName',
        firstName: 'firstName',
        lastName: 'lastName',
        admin: true
      },
    })

    cy.intercept(
      {
        method: 'GET',
        url: '/api/session',
      },
      []).as('session')

    cy.get('input[formControlName=email]').type("yoga@studio.com")
    cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`)

    cy.url().should('include', '/sessions')
  })

  it('Should get unsuccessfull login', () => {
    cy.visit('/login')

    cy.intercept('POST', '/api/auth/login', {
      statusCode: 401,
      body: {
        message: 'Bad credentials'
      }
    }).as('login')

    cy.get('input[formControlName=email]').type("yoga@studio.com")
    cy.get('input[formControlName=password]').type(`${"test!123"}{enter}{enter}`)

    cy.get('.error')
      .should('exist')
      .and('contain.text', 'An error occurred')
  })
});