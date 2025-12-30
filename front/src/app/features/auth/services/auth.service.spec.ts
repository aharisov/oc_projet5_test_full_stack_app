import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { expect } from '@jest/globals';

import { AuthService } from './auth.service';
import { LoginRequest } from '../interfaces/loginRequest.interface';
import { RegisterRequest } from '../interfaces/registerRequest.interface';
import { SessionInformation } from 'src/app/interfaces/sessionInformation.interface';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call register and return void', () => {
    const mockRequest: RegisterRequest = {
      email: 'test@test.com',
      password: '123',
      firstName: 'Alex',
      lastName: 'Dupont'
    };

    service.register(mockRequest).subscribe(response => {
      expect(response).toBeUndefined();
    });

    const req = httpMock.expectOne('api/auth/register');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockRequest);

    req.flush(null);
  });

  it('should call login and return SessionInformation', () => {
    const mockRequest: LoginRequest = {
      email: 'test@test.com',
      password: '123'
    };

    const mockResponse: SessionInformation = {
      id: 1,
      token: 'aqwzsx123',
      type: 'type',
      username: 'test@test.com',
      firstName: 'John',
      lastName: 'Doe',
      admin: true
    };

    service.login(mockRequest).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('api/auth/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockRequest);

    req.flush(mockResponse);
  });
});
