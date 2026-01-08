describe('Session create/update', () => {
  beforeEach(() => {
    cy.visit('/login');

    cy.intercept('POST', '/api/auth/login', {
      body: {
        id: 1,
        email: 'yoga@studio.com',
        password: 'test!1234',
        admin: true
      },
    });

    // Mock sessions list
    cy.intercept('GET', '/api/session', {
      statusCode: 200,
      body: [
        { id: 1, name: 'Yoga', date: '2026-01-03T10:00:00', description: 'Morning Yoga' }
      ]
    }).as('getSessions');

    // Mock teachers list
    cy.intercept('GET', '/api/teacher', {
      statusCode: 200,
      body: [
        { id: 1, firstName: 'Anne', lastName: 'Idalgo' },
        { id: 2, firstName: 'Jane', lastName: 'Smith' }
      ]
    }).as('getTeachers');

    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type('test!1234');
    cy.get('button[data-testid=submit-button]').click();

    cy.wait('@getSessions');
  })

  it('Should display create session form', () => {
    cy.get('[data-testid="create-button"]').should('be.visible').click();

    cy.wait('@getTeachers');

    cy.contains('Create session').should('be.visible');
    cy.get('[data-testid="submit-button"]').should('be.disabled');
  });

  it('Should create a session', () => {
    cy.intercept('POST', '/api/session', {
      statusCode: 200,
      body: {}
    }).as('createSession');

    cy.get('[data-testid="create-button"]').should('be.visible').click();

    cy.wait('@getTeachers');

    cy.get('[data-testid="input-name"]').type('Yoga');
    cy.get('[data-testid="input-date"]').type('2026-01-14');

    cy.get('mat-select').click();
    cy.get('[data-testid="teacher-option-1"]').click();

    cy.get('[data-testid="input-descr"]').type('Morning Yoga');

    cy.get('[data-testid="submit-button"]').should('be.enabled').click();

    cy.wait('@createSession').its('request.body').should('deep.include', {
      name: 'Yoga',
      teacher_id: 1,
      description: 'Morning Yoga'
    });

    cy.url().should('include', '/sessions');
  });

  it('Should show edit form with session data', () => {
    cy.intercept('GET', '/api/session/1', {
      statusCode: 200,
      body: {
        id: 1,
        name: 'Yoga',
        date: '2026-01-14T00:00:00.000+00:00',
        teacher_id: 1,
        description: 'Morning Yoga'
      }
    }).as('getSession');

    cy.get('[data-testid="edit-button"]').should('be.visible').click();

    cy.wait('@getSession');
    cy.wait('@getTeachers');

    cy.contains('Update session').should('be.visible');

    cy.get('[data-testid="input-name"]').should('have.value', 'Yoga');
    cy.get('[data-testid="input-date"]').should('contain.value', '2026-01-14');
    cy.get('.mat-select-min-line').should('contain.text', 'Anne Idalgo');
    cy.get('[data-testid="input-descr"]').should('contain.value', 'Morning Yoga');
  });

  it('Should update a session', () => {
    cy.intercept('GET', '/api/session/1', {
      statusCode: 200,
      body: {
        id: 1,
        name: 'Yoga',
        date: '2026-01-14T00:00:00.000+00:00',
        teacher_id: 1,
        description: 'Morning Yoga'
      }
    }).as('getSession');

    cy.intercept('PUT', '/api/session/1', {
      statusCode: 200
    }).as('updateSession');

    cy.get('[data-testid="edit-button"]').should('be.visible').click();

    cy.wait('@getSession');
    cy.wait('@getTeachers');

    cy.get('[data-testid="input-name"]').clear().type('Advanced Yoga');

    cy.get('[data-testid="submit-button"]').click();

    cy.wait('@updateSession')
      .its('request.body')
      .should('include', { name: 'Advanced Yoga' });

    cy.url().should('include', '/sessions');
  });
});