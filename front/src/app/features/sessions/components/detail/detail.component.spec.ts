import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule, } from '@angular/router/testing';
import { expect } from '@jest/globals'; 
import { of } from 'rxjs';

import { SessionService } from '../../../../services/session.service';
import { DetailComponent } from './detail.component';
import { Session } from '../../interfaces/session.interface';
import { Teacher } from 'src/app/interfaces/teacher.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionApiService } from '../../services/session-api.service';
import { TeacherService } from 'src/app/services/teacher.service';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

describe('DetailComponent', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>; 
  let service: SessionService;

  const mockRouter = {
    navigate: jest.fn()
  };

  const mockSnackBar = {
    open: jest.fn()
  };

  const mockActivatedRoute = {
    snapshot: {
      paramMap: {
        get: jest.fn().mockReturnValue('123')
      }
    }
  };

  const mockSessionService = {
    sessionInformation: {
      admin: true,
      id: 1
    }
  }

  const mockSessionApi = {
    detail: jest.fn().mockReturnValue(of({
      id: 1,
      name: 'Test',
      date: new Date('2026-01-10'),
      description: 'test',
      teacher_id: 1,
      users: [1, 2]
    })),
    delete: jest.fn().mockReturnValue(of({})),
    participate: jest.fn().mockReturnValue(of({})),
    unParticipate: jest.fn().mockReturnValue(of({}))
  };

  const mockTeacherService = {
    detail: jest.fn().mockReturnValue(of({
      id: 1,
      firstName: 'Test',
      lastName: 'Teacher',
      createdAt: new Date(),
      updatedAt: new Date()
    }))
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        MatSnackBarModule,
        MatIconModule,         
        MatCardModule,
        ReactiveFormsModule,
      ],
      declarations: [DetailComponent], 
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: MatSnackBar, useValue: mockSnackBar },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: SessionService, useValue: mockSessionService },
        { provide: SessionApiService, useValue: mockSessionApi },
        { provide: TeacherService, useValue: mockTeacherService }
      ],
    }).compileComponents();
    
    service = TestBed.inject(SessionService);
    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => jest.clearAllMocks());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should construct component correctly', () => {
    expect(component.sessionId).toBe('123');
    expect(component.isAdmin).toBe(true);
    expect(component.userId).toBe('1');
  });

  it('should call fetchSession on init', () => {
    const spy = jest.spyOn(component as any, 'fetchSession');
    
    component.ngOnInit();
    
    expect(spy).toHaveBeenCalled();
  });

  it('should fetch session with all necessary data', () => {
    const mockSession: Session = {
      id: 1,
      name: 'Test',
      date: new Date('2026-01-10'),
      description: 'test',
      teacher_id: 5,
      users: [1, 2]
    };

    const mockTeacher: Teacher = {
      id: 5,
      lastName: 'Dupont',
      firstName: 'Camille',
      createdAt: new Date('2025-12-01'),
      updatedAt: new Date()
    };

    mockSessionApi.detail.mockReturnValue(of(mockSession));
    mockTeacherService.detail.mockReturnValue(of(mockTeacher));

    (component as any).fetchSession();

    expect(mockSessionApi.detail).toHaveBeenCalledWith('123');
    expect(component.session).toEqual(mockSession);
    expect(component.isParticipate).toBe(true);
    expect(mockTeacherService.detail).toHaveBeenCalledWith('5');
    expect(component.teacher).toEqual(mockTeacher);
  });

  it('should call participate and refresh session', () => {
    const refreshSpy = jest.spyOn(component as any, 'fetchSession');

    mockSessionApi.participate.mockReturnValue(of({}));

    component.participate();

    expect(mockSessionApi.participate).toHaveBeenCalledWith('123', '1');
    expect(refreshSpy).toHaveBeenCalled();
  });

  it('should call unParticipate and refresh session', () => {
    const refreshSpy = jest.spyOn(component as any, 'fetchSession');

    mockSessionApi.unParticipate.mockReturnValue(of({}));

    component.unParticipate();

    expect(mockSessionApi.unParticipate).toHaveBeenCalledWith('123', '1');
    expect(refreshSpy).toHaveBeenCalled();
  });

  it('should delete session, show snackbar and navigate to sessions list', () => {
    mockSessionApi.delete.mockReturnValue(of({}));

    component.delete();

    expect(mockSessionApi.delete).toHaveBeenCalledWith('123');
    expect(mockSnackBar.open).toHaveBeenCalledWith(
      'Session deleted !',
      'Close',
      { duration: 3000 }
    );
    expect(mockRouter.navigate).toHaveBeenCalledWith(['sessions']);
  });

  it('should return to the previous page', () => {
    const backSpy = jest.spyOn(window.history, 'back');
    
    component.back();
    
    expect(backSpy).toHaveBeenCalled();
  });
});

