import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { expect } from '@jest/globals'; 

import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { SessionService } from 'src/app/services/session.service';
import { SessionInformation } from 'src/app/interfaces/sessionInformation.interface';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  const mockAuthService = {
    login: jest.fn()
  };

  const mockSessionService = {
    logIn: jest.fn()
  };

  const mockRouter = {
    navigate: jest.fn()
  };

  const mockSessionInformation: SessionInformation = {
    token: 'fake-token',
    id: 1,
    admin: false,
    type: '',
    username: '',
    firstName: '',
    lastName: ''
  };

beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        BrowserAnimationsModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule
      ],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: SessionService, useValue: mockSessionService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call authService.login with form values', () => {
    mockAuthService.login.mockReturnValue(of(mockSessionInformation));

    component.form.setValue({
      email: 'test@test.com',
      password: '123'
    });

    component.submit();

    expect(mockAuthService.login).toHaveBeenCalledWith({
      email: 'test@test.com',
      password: '123'
    });
  });

  it('should login and redirect on success', () => {
    mockAuthService.login.mockReturnValue(of(mockSessionInformation));

    component.form.setValue({
      email: 'test@test.com',
      password: '123'
    });

    component.submit();

    expect(mockSessionService.logIn).toHaveBeenCalledWith(mockSessionInformation);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/sessions']);
    expect(component.onError).toBe(false);
  });

  it('should set onError to true on login error', () => {
    mockAuthService.login.mockReturnValue(
      throwError(() => new Error('Invalid credentials'))
    );

    component.form.setValue({
      email: 'test@test.com',
      password: '123'
    });

    component.submit();

    expect(component.onError).toBe(true);
    expect(mockSessionService.logIn).not.toHaveBeenCalled();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });
});
