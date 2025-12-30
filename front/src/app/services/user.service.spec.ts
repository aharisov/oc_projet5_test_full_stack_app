import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { UserService } from './user.service';
import { User } from '../interfaces/user.interface';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[
        HttpClientTestingModule
      ],
      providers: [UserService]
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getById method and return user', () => {
    const userId = '2';
    const mockResponse: User = {
      id: 2,
      email: 'test@test.com',
      lastName: 'Richard',
      firstName: 'Pierre',
      admin: false,
      password: '123aqw',
      createdAt: new Date('2025-12-12')
    };

    service.getById(userId).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`api/user/${userId}`);
    expect(req.request.method).toBe('GET');

    req.flush(mockResponse);
  });

  it('should call delete method and return any', () => {
    const mockResponse: any = {};
    const userId = '2';

    service.delete(userId).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`api/user/${userId}`);
    expect(req.request.method).toBe('DELETE');

    req.flush(mockResponse);
  });
});
