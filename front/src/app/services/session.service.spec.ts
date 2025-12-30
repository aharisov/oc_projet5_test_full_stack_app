import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { SessionService } from './session.service';
import { SessionInformation } from '../interfaces/sessionInformation.interface';

describe('SessionService', () => {
  let service: SessionService;

  const mockSession: SessionInformation = {
    token: 'abcd',
    type: 'type',
    id: 2,
    username: 'test',
    firstName: 'Antoine',
    lastName: 'Dupont',
    admin: false
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with isLogged = false and without session info', () => {
    expect(service.isLogged).toBe(false);
    expect(service.sessionInformation).toBeUndefined();
  });

  it('should emit false initially from $isLogged()', (done) => {
    service.$isLogged().subscribe(value => {
      expect(value).toBe(false);
      done();
    });
  });

  it('should log in and update values', (done) => {
    service.$isLogged().subscribe(value => {
      // wait until login triggers next() method
      if (value === true) {
        expect(service.isLogged).toBe(true);
        expect(service.sessionInformation).toEqual(mockSession);
        done();
      }
    });

    service.logIn(mockSession);
  });

  it('should log out and update values', (done) => {
    // prepare for the logout operation
    service.logIn(mockSession);

    service.$isLogged().subscribe(value => {
      if (value === false) {
        expect(service.isLogged).toBe(false);
        expect(service.sessionInformation).toBeUndefined();
        done();
      }
    });

    service.logOut();
  });
});
