import { render, screen, waitFor } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { expect } from '@jest/globals'; 

import { FormComponent } from './form.component';
import { SessionApiService } from '../../services/session-api.service';
import { SessionService } from 'src/app/services/session.service';
import { TeacherService } from 'src/app/services/teacher.service';
import { Session } from '../../interfaces/session.interface';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;

  const mockRouter = {
    url: '/sessions/create',
    navigate: jest.fn()
  };

  const mockSnackBar = {
    open: jest.fn()
  };

  const mockSessionService = {
    sessionInformation: { admin: true }
  };

  const mockTeacherService = {
    all: jest.fn().mockReturnValue(of([1, 2]))
  };

  const mockActivatedRoute = {
    snapshot: { paramMap: { get: jest.fn().mockReturnValue('1') } }
  };

  const mockSessionApiService = {
    detail: jest.fn(),
    create: jest.fn(),
    update: jest.fn()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormComponent],
      imports: [
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule, 
        MatSnackBarModule,
        MatSelectModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: MatSnackBar, useValue: mockSnackBar },
        { provide: SessionApiService, useValue: mockSessionApiService },
        { provide: SessionService, useValue: mockSessionService },
        { provide: TeacherService, useValue: mockTeacherService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  afterEach(() => jest.clearAllMocks());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should redirect if user is not admin', () => {
    mockSessionService.sessionInformation.admin = false;

    component.ngOnInit();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/sessions']);
  });

  it('should initialize form in create mode', () => {
    const initFormSpy = jest.spyOn(component as any, 'initForm');

    component.ngOnInit();

    expect(component.onUpdate).toBe(false);
    expect(initFormSpy).toHaveBeenCalled();
  });

  it('should load session and initialize form in update mode', () => {
    mockRouter.url = '/sessions/update/1';
    component.onUpdate = true;

    const mockSession: Session = {
      id: 1,
      name: 'Yoga session',
      date: new Date('2026-01-10'),
      teacher_id: 2,
      description: 'test yoga session',
      users: [1, 2]
    };

    mockSessionApiService.detail.mockReturnValue(of(mockSession));
    
    const initFormSpy = jest.spyOn(component as any, 'initForm');

    component.ngOnInit();

    expect(component.onUpdate).toBe(true);
    expect(mockSessionApiService.detail).toHaveBeenCalledWith('1');
    expect(initFormSpy).toHaveBeenCalledWith(mockSession);
  });

  it('should handle submit when form is undefined', () => {
    component.sessionForm = undefined;
    component.onUpdate = false;

    mockSessionApiService.create.mockReturnValue(of({}));

    component.submit();

    expect(mockSessionApiService.create).toHaveBeenCalledWith(undefined);
  });

  it('should create session', () => {
    component.onUpdate = false;

    mockSessionApiService.create.mockReturnValue(of({}));

    const exitSpy = jest.spyOn(component as any, 'exitPage');

    (component as any).initForm({
      id: 1,
      name: 'Test session',
      date: '2026-03-03',
      teacher_id: 1,
      description: 'Test session description'
    });

    component.submit();

    expect(mockSessionApiService.create).toHaveBeenCalled();
    expect(exitSpy).toHaveBeenCalledWith('Session created !');
    expect(mockSnackBar.open).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['sessions']);
  });

  it('should update session', () => {
    component.onUpdate = true;
    component['id'] = '4';

    mockSessionApiService.update.mockReturnValue(of({}));

    const exitSpy = jest.spyOn(component as any, 'exitPage');

    (component as any).initForm({
      id: 4,
      name: 'Updated session name',
      date: new Date('2025-04-01'),
      teacher_id: 2,
      description: 'updated description'
    });

    component.submit();

    expect(mockSessionApiService.update).toHaveBeenCalledWith(
      '4',
      component.sessionForm?.value
    );
    expect(exitSpy).toHaveBeenCalledWith('Session updated !');
    expect(mockSnackBar.open).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['sessions']);
  });
});

describe('FormComponent (integration tests)', () => {
  const mockSessionService = {
    sessionInformation: { id: 1, admin: true }
  };

  const mockRouter = {
    navigate: jest.fn(),
    url: '/sessions/create'
  };

  const mockSnackBar = {
    open: jest.fn()
  };

  const mockTeachers = [
    { id: 1, firstName: 'Hélène', lastName: 'THIERCELIN' }
  ];

  const mockTeacherService = {
    all: jest.fn().mockReturnValue(of(mockTeachers))
  };

  const mockSessionApiService = {
    create: jest.fn(),
    update: jest.fn(),
    detail: jest.fn()
  };

  const renderComponent = async ({
      admin = true,
      url = '/sessions/create',
      session = null
    }: {
      admin?: boolean;
      url?: string;
      session?: any;
    } = {}) => {
    mockSessionService.sessionInformation.admin = admin;
    mockRouter.url = url;

    if (session) {
      mockSessionApiService.detail.mockReturnValue(of(session));
    }

    return render(FormComponent, {
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatIconModule
      ],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: SessionApiService, useValue: mockSessionApiService },
        { provide: TeacherService, useValue: mockTeacherService },
        { provide: MatSnackBar, useValue: mockSnackBar },
        { provide: Router, useValue: mockRouter },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: () => '1' } }
          }
        }
      ]
    });
  };

  it('should redirect non-admin user', async () => {
    await renderComponent({ admin: false });

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/sessions']);
  });

  it('should have the ng-invalid class when input is empty', async () => {
    await renderComponent();

    const inputName = await screen.findByTestId('input-name') as HTMLInputElement;
    await userEvent.click(inputName);

    expect(inputName).toHaveClass('ng-invalid');
  });

  it('should create a session when form is valid', async () => {
    mockSessionApiService.create.mockReturnValue(of({}));

    await renderComponent();

    await userEvent.type(screen.getByTestId('input-name'), 'Yoga');
    await userEvent.type(screen.getByTestId('input-date'), '2026-01-10');
    await userEvent.click(screen.getByRole('combobox'));
    await userEvent.click(await screen.findByTestId('teacher-option-1')); 
    await userEvent.type(
      screen.getByTestId('input-descr'),
      'Relaxing yoga session'
    );

    const submitButton = await screen.findByTestId('submit-button') as HTMLButtonElement;
    expect(submitButton).toBeEnabled();

    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSessionApiService.create).toHaveBeenCalled();
      expect(mockSnackBar.open).toHaveBeenCalledWith(
        'Session created !',
        'Close',
        { duration: 3000 }
      );
      expect(mockRouter.navigate).toHaveBeenCalledWith(['sessions']);
    });
  });

  it('should update session when in update mode', async () => {
    const existingSession = {
      id: 1,
      name: 'Yoga',
      date: '2026-01-10',
      teacher_id: 1,
      description: 'Old description'
    };

    mockSessionApiService.update.mockReturnValue(of({}));

    await renderComponent({
      url: '/sessions/update/1',
      session: existingSession
    });

    expect(await screen.findByTestId('input-name')).toHaveValue('Yoga');

    await userEvent.clear(screen.getByTestId('input-descr'));
    await userEvent.type(
      screen.getByTestId('input-descr'),
      'Updated description'
    );

    const submitButton = await screen.findByTestId('submit-button') as HTMLButtonElement;
    expect(submitButton).toBeEnabled();

    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSessionApiService.update)
        .toHaveBeenCalledWith('1', expect.objectContaining({
          description: 'Updated description'
        }));

      expect(mockSnackBar.open).toHaveBeenCalledWith(
        'Session updated !',
        'Close',
        { duration: 3000 }
      );
    });
  });

});