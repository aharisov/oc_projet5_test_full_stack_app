import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { SessionApiService } from './session-api.service';
import { Session } from '../interfaces/session.interface';

describe('SessionsService', () => {
  let service: SessionApiService;
  let httpMock: HttpTestingController;

  const mockSessionId = '1';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[
        HttpClientTestingModule
      ],
      providers: [SessionApiService] 
    });
    service = TestBed.inject(SessionApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call all method and return sessions list', () => {
    const mockResponse: Session[] = [
      {
        id: 1,
        name: 'Test session 1',
        description: 'session description 1',
        date: new Date('2026-01-10'),
        teacher_id: 1,
        users: [1]
      },
      {
        id: 2,
        name: 'Test session 2',
        description: 'session description 2',
        date: new Date('2026-01-10'),
        teacher_id: 2,
        users: []
      }
    ];

    service.all().subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('api/session');
    expect(req.request.method).toBe('GET');

    req.flush(mockResponse);
  });

  it('should call detail method and return Session', () => {
    const mockResponse: Session = {
        id: Number(mockSessionId),
        name: 'Test session 1',
        description: 'session description 1',
        date: new Date('2026-01-10'),
        teacher_id: 1,
        users: [1]
      };

    service.detail(mockSessionId).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`api/session/${mockSessionId}`);
    expect(req.request.method).toBe('GET');

    req.flush(mockResponse);
  });

  it('should call delete method and return any', () => {
    const mockResponse: any = {};

    service.delete(mockSessionId).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`api/session/${mockSessionId}`);
    expect(req.request.method).toBe('DELETE');

    req.flush(mockResponse);
  });

  it('should call create method and return Session', () => {
    const mockRequest: Session = {
      name: 'Test session',
      description: 'session description',
      date: new Date('2026-01-10'),
      teacher_id: 1,
      users: []
    };

    const mockResponse: Session = {
      id: 1,
      name: 'Test session',
      description: 'session description',
      date: new Date('2026-01-10'),
      teacher_id: 1,
      users: [],
      createdAt: new Date('2026-01-10')
    };

    service.create(mockRequest).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('api/session');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockRequest);

    req.flush(mockResponse);
  });

  it('should call update method and return Session', () => {
    const mockRequest: Session = {
      id: Number(mockSessionId),
      name: 'Test session updated',
      description: 'session description updated',
      date: new Date('2026-01-10'),
      teacher_id: 1,
      users: [1]
    };

    const mockResponse: Session = {
      id: Number(mockSessionId),
      name: 'Test session updated',
      description: 'session description updated',
      date: new Date('2026-01-05'),
      teacher_id: 1,
      users: [1],
      createdAt: new Date('2026-01-10'),
      updatedAt: new Date('2025-12-31')
    };

    service.update(mockSessionId, mockRequest).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`api/session/${mockSessionId}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockRequest);

    req.flush(mockResponse);
  });

  it('should call participate method and return nothing', () => {
    const userId = '1';

    service.participate(mockSessionId, userId).subscribe(response => {
      expect(response).toBeUndefined();
    });

    const req = httpMock.expectOne(`api/session/${mockSessionId}/participate/${userId}`);
    expect(req.request.method).toBe('POST');

    req.flush(null);
  });

  it('should call unParticipate method and return nothing', () => {
    const userId = '1';

    service.unParticipate(mockSessionId, userId).subscribe(response => {
      expect(response).toBeUndefined();
    });

    const req = httpMock.expectOne(`api/session/${mockSessionId}/participate/${userId}`);
    expect(req.request.method).toBe('DELETE');
  });
});
