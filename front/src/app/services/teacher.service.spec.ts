import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { TeacherService } from './teacher.service';
import { Teacher } from '../interfaces/teacher.interface';

describe('TeacherService', () => {
  let service: TeacherService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[
        HttpClientTestingModule
      ],
      providers: [TeacherService]
    });
    service = TestBed.inject(TeacherService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call all method and return teachers list', () => {
    const mockResponse: Teacher[] = [
      {
        id: 1,
        lastName: 'Richard',
        firstName: 'Pierre',
        createdAt: new Date('2025-12-12'),
        updatedAt: new Date('2025-12-12')
      },
      {
        id: 2,
        lastName: 'Dupont',
        firstName: 'Antoine',
        createdAt: new Date('2025-12-13'),
        updatedAt: new Date('2025-12-13')
      }
    ];

    service.all().subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('api/teacher');
    expect(req.request.method).toBe('GET');

    req.flush(mockResponse);
  });
  
  it('should call detail method and return teacher', () => {
    const teacherId = '1';
    const mockResponse: Teacher = {
        id: 1,
        lastName: 'Richard',
        firstName: 'Pierre',
        createdAt: new Date('2025-12-12'),
        updatedAt: new Date('2025-12-12')
      };

    service.detail(teacherId).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`api/teacher/${teacherId}`);
    expect(req.request.method).toBe('GET');

    req.flush(mockResponse);
  });
});
