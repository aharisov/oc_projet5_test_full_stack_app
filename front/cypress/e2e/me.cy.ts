describe('Me component spec', () => {
  beforeEach(() => {
    cy.intercept('POST', '/api/auth/login', (req) => {
        req.reply({
            statusCode: 200,
            body: { id: 1, admin: true, email: 'yoga@studio.com', token: 'fake-jwt' }
        });
    });

    // Mock session data because after login user is redirected to /sessions
    cy.intercept('GET', '/api/session', {
      statusCode: 200,
      body: [
        { id: 1, name: 'Yoga', date: '2026-01-03T10:00:00', description: 'Morning Yoga' },
        { id: 2, name: 'Pilates', date: '2026-01-04T11:00:00', description: 'Pilates Session' }
      ]
    }).as('getSessions');

    cy.visit('/login');
    cy.get('input[formControlName=email]').type("yoga@studio.com");
    cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`);

    cy.wait('@getSessions');
  });

  it('Should show user info (admin)', () => {
    cy.intercept('GET', '/api/user/1', {
      statusCode: 200,
      body: {
            "id": 1,
            "email": "yoga@studio.com",
            "lastName": "Test",
            "firstName": "Admin",
            "admin": true,
            "createdAt": "2025-12-11T08:24:00",
            "updatedAt": "2025-12-11T08:24:00"
        }
    }).as('getUser');

    cy.get('[data-testid="account-link"]').should('be.visible').click();

    cy.wait('@getUser');

    cy.get('[data-testid="page-title"]').should('contain.text', 'User information');
    cy.get('[data-testid="user-name-line"]').should('contain.text', 'Admin TEST');
    cy.get('[data-testid="user-email-line"]').should('contain.text', 'yoga@studio.com');
    cy.get('[data-testid="is-admin-message"]').should('exist');
  });

  it('Should go back when back button is clicked', () => {
    cy.intercept('GET', '/api/user/1', {
      statusCode: 200,
      body: {
            "id": 1,
            "email": "yoga@studio.com",
            "lastName": "Test",
            "firstName": "Admin",
            "admin": true,
            "createdAt": "2025-12-11T08:24:00",
            "updatedAt": "2025-12-11T08:24:00"
        }
    }).as('getUser');

    cy.get('[data-testid="account-link"]').should('be.visible').click();

    cy.wait('@getUser');

    cy.get('[data-testid="back-button"]').click();

    cy.url().should('include', '/sessions');
  });

  it('Should show delete button for non-admin', () => {
    cy.intercept('GET', '/api/user/1', {
      statusCode: 200,
      body: {
            "id": 1,
            "email": "user@studio.com",
            "lastName": "Test",
            "firstName": "User",
            "admin": false,
            "createdAt": "2026-01-01T08:24:00",
            "updatedAt": "2026-01-01T08:24:00"
        }
    }).as('getUser');

    cy.get('[data-testid="account-link"]').should('be.visible').click();

    cy.wait('@getUser');

    cy.get('[data-testid="delete-button"]').should('exist');
  });

  it('Should delete user account and redirect to home', () => {
    cy.intercept('GET', '/api/user/1', {
      statusCode: 200,
      body: {
            "id": 1,
            "email": "user@studio.com",
            "lastName": "Test",
            "firstName": "User",
            "admin": false,
            "createdAt": "2026-01-01T08:24:00",
            "updatedAt": "2026-01-01T08:24:00"
        }
    }).as('getUser');

    cy.intercept('DELETE', '/api/user/1', {
      statusCode: 200
    }).as('deleteUser');

    cy.get('[data-testid="account-link"]').should('be.visible').click();
    
    cy.get('[data-testid="delete-button"]').should('be.visible').click();

    cy.wait('@deleteUser');

    cy.url().should('eq', Cypress.config().baseUrl);

    cy.contains('Your account has been deleted !').should('be.visible');
  });

  it('Should logout user', () => {
    cy.intercept('GET', '/api/user/1', {
      statusCode: 200,
      body: {
            "id": 1,
            "email": "user@studio.com",
            "lastName": "Test",
            "firstName": "User",
            "admin": false,
            "createdAt": "2026-01-01T08:24:00",
            "updatedAt": "2026-01-01T08:24:00"
        }
    }).as('getUser');

    cy.get('[data-testid="account-link"]').should('be.visible').click();

    cy.wait('@getUser');

    cy.get('[data-testid="logout-link"]').click();

    cy.url().should('eq', Cypress.config().baseUrl);
  });
});