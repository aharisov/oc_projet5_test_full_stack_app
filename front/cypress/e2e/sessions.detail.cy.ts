describe('Session detail page spec (visit by admin)', () => {
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

    // Mock session detail
    cy.intercept('GET', '/api/session/1', {
      statusCode: 200,
      body: {
          "id": 1,
          "name": "Yoga",
          "date": "2025-12-14T00:00:00.000+00:00",
          "teacher_id": 1,
          "description": "Morning Yoga",
          "users": [2, 3],
          "createdAt": "2025-12-11T10:29:38",
          "updatedAt": "2025-12-18T16:27:09"
      }
    }).as('getSession');

    // Mock teacher
    cy.intercept('GET', '/api/teacher/1', {
      statusCode: 200,
      body: {
        id: 1,
        firstName: 'Lora',
        lastName: 'Fabian'
      }
    }).as('getTeacher');

    // Mock Delete API
    cy.intercept('DELETE', '/api/session/1', {
      statusCode: 200
    }).as('deleteSession');

    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type('test!1234');
    cy.get('button[data-testid=submit-button]').click();

    cy.wait('@getSessions');
  })

  it('Should navigate to session page and show session info', () => {
    // Click detail button
    cy.get('[data-testid=detail-button]').click();

    // Wait for APIs
    cy.wait('@getSession');
    cy.wait('@getTeacher');

    // Check URL
    cy.url().should('include', '/sessions/detail/1');

    // Check session info
    cy.get('h1').should('contain.text', 'Yoga');
    cy.contains('Morning Yoga').should('be.visible');
    cy.contains('Lora FABIAN').should('be.visible');
    cy.contains('2 attendees').should('be.visible');

    // Check delete button visibility because this test is by admin
    cy.get('[data-testid="delete-button"]').should('be.visible');
  });

  it('Should delete session and redirect to sessions list', () => {
    cy.get('[data-testid=detail-button]').click();

    cy.wait('@getSession');
    cy.wait('@getTeacher');

    cy.get('[data-testid="delete-button"]').should('be.visible').click();

    cy.wait('@deleteSession');

    cy.url().should('include', '/sessions');

    cy.contains('Session deleted').should('be.visible');
  });
});

describe('Session detail page spec (visit by non-admin)', () => {
  beforeEach(() => {
    cy.visit('/login');

    cy.intercept('POST', '/api/auth/login', {
      body: {
        id: 4,
        email: 'testuser@studio.com',
        password: 'test!1234',
        admin: false
      },
    });

    // Mock sessions list
    cy.intercept('GET', '/api/session', {
      statusCode: 200,
      body: [
        { id: 1, name: 'Yoga', date: '2026-01-03T10:00:00', description: 'Morning Yoga' }
      ]
    }).as('getSessions');

    // Mock teacher
    cy.intercept('GET', '/api/teacher/1', {
      statusCode: 200,
      body: {
        id: 1,
        firstName: 'Lora',
        lastName: 'Fabian'
      }
    }).as('getTeacher');

    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type('test!1234');
    cy.get('button[data-testid=submit-button]').click();

    cy.wait('@getSessions');
  })

  it('Should show session page with participate button', () => {
    cy.intercept('GET', '/api/session/1', {
      statusCode: 200,
      body: {
          "id": 1,
          "name": "Yoga",
          "date": "2025-12-14T00:00:00.000+00:00",
          "teacher_id": 1,
          "description": "Morning Yoga",
          "users": [2, 3],
          "createdAt": "2025-12-11T10:29:38",
          "updatedAt": "2025-12-18T16:27:09"
      }
    }).as('getSession');

    cy.get('[data-testid=detail-button]').click();

    cy.wait('@getSession');
    cy.wait('@getTeacher');

    cy.url().should('include', '/sessions/detail/1');

    cy.get('[data-testid="delete-button"]').should('not.exist');

    cy.get('[data-testid="add-button"]').should('be.visible');
  });

  it('Should show session page with unparticipate button', () => {
    cy.intercept('GET', '/api/session/1', {
      statusCode: 200,
      body: {
          "id": 1,
          "name": "Yoga",
          "date": "2025-12-14T00:00:00.000+00:00",
          "teacher_id": 1,
          "description": "Morning Yoga",
          "users": [4, 3],
          "createdAt": "2025-12-11T10:29:38",
          "updatedAt": "2025-12-18T16:27:09"
      }
    }).as('getSession');

    cy.get('[data-testid=detail-button]').click();

    cy.wait('@getSession');
    cy.wait('@getTeacher');

    cy.url().should('include', '/sessions/detail/1');

    cy.get('[data-testid="remove-button"]').should('be.visible');
  });

  it('Should participate in session', () => {
    let callCount = 0;

    cy.intercept('GET', '/api/session/1', (req) => {
      callCount++;

      if (callCount === 1) {
        req.reply({
          statusCode: 200,
          body: {
            id: 1,
            name: 'Yoga',
            date: '2025-12-14T00:00:00.000+00:00',
            teacher_id: 1,
            description: 'Morning Yoga',
            users: [2, 3]
          }
        });
      } else {
        req.reply({
          statusCode: 200,
          body: {
            id: 1,
            name: 'Yoga',
            teacher_id: 1,
            description: 'Morning Yoga',
            users: [2, 3, 4]
          }
        });
      }
    }).as('getSession');

    // Mock participate API
    cy.intercept('POST', '/api/session/1/participate/4', {
      statusCode: 200
    }).as('participate');

    cy.get('[data-testid=detail-button]').click();

    cy.wait('@getSession');
    cy.wait('@getTeacher');

    cy.get('[data-testid="add-button"]').should('be.visible').click();

    cy.wait('@participate');
    // Load new session info with new participant
    cy.wait('@getSession');

    // Before there were 2 users participating
    cy.contains('3 attendees').should('be.visible');

    // Now we should see unparticipate button
    cy.get('[data-testid="remove-button"]').should('be.visible');
  });

  it('Should unparticipate in session', () => {
    let callCount = 0;

    cy.intercept('GET', '/api/session/1', (req) => {
      callCount++;

      if (callCount === 1) {
        req.reply({
          statusCode: 200,
          body: {
            id: 1,
            name: 'Yoga',
            date: '2025-12-14T00:00:00.000+00:00',
            teacher_id: 1,
            description: 'Morning Yoga',
            users: [2, 3, 4]
          }
        });
      } else {
        req.reply({
          statusCode: 200,
          body: {
            id: 1,
            name: 'Yoga',
            teacher_id: 1,
            description: 'Morning Yoga',
            users: [2, 3]
          }
        });
      }
    }).as('getSession');

    // Mock participate API
    cy.intercept('DELETE', '/api/session/1/participate/4', {
      statusCode: 200
    }).as('unparticipate');

    cy.get('[data-testid=detail-button]').click();

    cy.wait('@getSession');
    cy.wait('@getTeacher');

    cy.get('[data-testid="remove-button"]').should('be.visible').click();

    cy.wait('@unparticipate');
    // Load new session info with new participant
    cy.wait('@getSession');

    // Before there were 3 users participating
    cy.contains('2 attendees').should('be.visible');

    // Now we should see participate button
    cy.get('[data-testid="add-button"]').should('be.visible');
  });
});