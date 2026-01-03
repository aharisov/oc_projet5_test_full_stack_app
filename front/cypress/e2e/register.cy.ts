describe('Register spec', () => {
  it('Should verify that page exists', () => {
    cy.visit('/register')

    cy.get('.mat-card-title')
      .should('exist')
      .and('contain.text', 'Register')
  })

  it('Should have an empty input error', () => {
    cy.visit('/register')

    cy.get('input[formControlName=email]').focus().blur()
    cy.get('input[formControlName=password]').focus()

    cy.get('input[formControlName=email]')
      .should('have.class', 'ng-invalid')
  })

  it('Should enable submit button', () => {
    cy.visit('/register')

    cy.get('input[formControlName=firstName]').type("Alex")
    cy.get('input[formControlName=lastName]').type("Test")
    cy.get('input[formControlName=email]').type("yoga@studio.com")
    cy.get('input[formControlName=password]').type('test123')
    cy.get('button[data-testid=submit-button]').should('not.be.disabled')
  })

  it('Should get successfull register', () => {
    cy.visit('/register')

    cy.intercept('POST', '/api/auth/register', {
      body: {
        firstName: 'Alex',
        lastName: 'Test',
        email: 'test@test.com',
        password: 'test123'
      },
    })

    cy.get('input[formControlName=firstName]').type("Alex")
    cy.get('input[formControlName=lastName]').type("Test")
    cy.get('input[formControlName=email]').type("test@test.com")
    cy.get('input[formControlName=password]').type(`${"test123"}{enter}{enter}`)

    cy.url().should('include', '/login')
  })

  it('Should get unsuccessfull register', () => {
    cy.visit('/register')

    cy.intercept('POST', '/api/auth/register', {
      statusCode: 401,
      body: {
        message: 'Bad credentials'
      }
    }).as('register')

    cy.get('input[formControlName=firstName]').type("Alex")
    cy.get('input[formControlName=lastName]').type("Test")
    cy.get('input[formControlName=email]').type("yoga@studio.com")
    cy.get('input[formControlName=password]').type(`${"test!123"}{enter}{enter}`)

    cy.get('.error')
      .should('exist')
      .and('contain.text', 'An error occurred')
  })
});