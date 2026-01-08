describe('Sessions list (with admin) spec', () => {
  beforeEach(() => {
    cy.visit('/login');

    cy.intercept('POST', '/api/auth/login', {
      body: {
        email: 'yoga@studio.com',
        password: 'test!1234',
        admin: true
      },
    });

    // Mock sessions list
    cy.intercept('GET', '/api/session', {
      statusCode: 200,
      body: [
        { id: 1, name: 'Yoga', date: '2026-01-03T10:00:00', description: 'Morning Yoga' },
        { id: 2, name: 'Pilates', date: '2026-01-04T11:00:00', description: 'Pilates Session' }
      ]
    }).as('getSessions');

    cy.get('input[formControlName=email]').type("yoga@studio.com");
    cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`);

    cy.wait('@getSessions');
  })

  it('Should render all sessions', () => {
    cy.get('.item').should('have.length', 2);
    cy.get('.item').first().should('contain.text', 'Yoga');
    cy.get('.item').last().should('contain.text', 'Pilates');
  });

  it('Should show create button', () => {
    cy.get('[data-testid=create-button]').should('be.visible');
  });

  it('Should show edit buttons', () => {
    cy.get('[data-testid=edit-button]').should('have.length', 2);
  });

  it('Should navigate to create page', () => {
    cy.get('[data-testid=create-button]').click();
    cy.url().should('include', '/sessions/create');
  });
})

describe('Sessions list (with non-admin) spec', () => {
  beforeEach(() => {
    cy.visit('/login');

    cy.intercept('POST', '/api/auth/login', {
      body: {
        email: 'test@studio.com',
        password: 'test!1234',
        admin: false
      },
    });

    // Mock sessions list
    cy.intercept('GET', '/api/session', {
      statusCode: 200,
      body: [
        { id: 1, name: 'Yoga', date: '2026-01-03T10:00:00', description: 'Morning Yoga' },
        { id: 2, name: 'Pilates', date: '2026-01-04T11:00:00', description: 'Pilates Session' }
      ]
    }).as('getSessions');

    cy.get('input[formControlName=email]').type("test@studio.com");
    cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`);

    cy.wait('@getSessions');
  })

  it('Should render all sessions', () => {
    cy.get('.item').should('have.length', 2);
    cy.get('.item').first().should('contain.text', 'Yoga');
    cy.get('.item').last().should('contain.text', 'Pilates');
  });

  it('Should not show create button', () => {
    cy.get('[data-testid=create-button]').should('not.exist');
  });

  it('Should not show edit buttons', () => {
    cy.get('[data-testid=edit-button]').should('not.exist');
  });
})