import { render, screen, waitFor } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

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

describe('LoginComponent (integration tests)', () => {
  const mockAuthService = {
    login: jest.fn().mockReturnValue(of({ id: 1, email: 'user@test.com' }))
  };

  const mockSessionService = {
    logIn: jest.fn()
  };

  const mockRouter = {
    navigate: jest.fn()
  };

  beforeEach(async () => {
    await render(LoginComponent, {
      imports: [
        ReactiveFormsModule,
        MatCardModule,
        MatInputModule,
        MatIconModule
      ],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: SessionService, useValue: mockSessionService },
        { provide: Router, useValue: mockRouter }
      ]
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render login title', async () => {
    expect(screen.getByTestId('login-form-title')).toHaveTextContent('Login');
  });

  it('should disable submit button when form is invalid', async () => {
    const button = screen.getByTestId('submit-button') as HTMLButtonElement;
    expect(button).toBeDisabled();
  });

  it('should enable submit button when form is valid', async () => {
    const button = screen.getByTestId('submit-button') as HTMLButtonElement;
    const inputEmail = screen.getByTestId('input-email') as HTMLInputElement;
    const inputPassword = screen.getByTestId('input-password') as HTMLInputElement;

    expect(button).toBeDisabled();

    await userEvent.type(inputEmail, 'user@test.com');
    await userEvent.type(inputPassword, '12345');
    
    await waitFor(() => {
      expect(inputEmail).toHaveValue('user@test.com')
      expect(inputPassword).toHaveValue('12345')
      expect(button).toBeEnabled();
    });
  });

  it('should toggle password visibility', async () => {
    const passwordInput = screen.getByTestId('input-password') as HTMLInputElement;
    const toggleBtn = screen.getByTestId('toggle-pass-button') as HTMLButtonElement;

    expect(passwordInput.type).toBe('password');

    await userEvent.click(toggleBtn);
    await waitFor(() => expect(passwordInput.type).toBe('text'));

    await userEvent.click(toggleBtn);
    await waitFor(() => expect(passwordInput.type).toBe('password'));
  });

  it('should call authService.login and sessionService.logIn on success', async () => {
    const submitButton = screen.getByTestId('submit-button') as HTMLButtonElement;
    const inputEmail = screen.getByTestId('input-email') as HTMLInputElement;
    const inputPassword = screen.getByTestId('input-password') as HTMLInputElement;

    await userEvent.type(inputEmail, 'user@test.com');
    await userEvent.type(inputPassword, '12345');

    await waitFor(() => expect(submitButton).toBeEnabled());

    await userEvent.click(screen.getByTestId('submit-button'));

    await waitFor(() => {
      expect(mockAuthService.login).toHaveBeenCalledWith({
        email: 'user@test.com',
        password: '12345'
      });
      expect(mockSessionService.logIn).toHaveBeenCalledWith({ id: 1, email: 'user@test.com' });
    });
  });

  it('should navigate to /sessions after login success', async () => {
    const submitButton = screen.getByTestId('submit-button') as HTMLButtonElement;
    const inputEmail = screen.getByTestId('input-email') as HTMLInputElement;
    const inputPassword = screen.getByTestId('input-password') as HTMLInputElement;

    await userEvent.type(inputEmail, 'user@test.com');
    await userEvent.type(inputPassword, '12345');

    await waitFor(() => expect(submitButton).toBeEnabled());

    await userEvent.click(submitButton);

    await waitFor(() => expect(mockRouter.navigate).toHaveBeenCalledWith(['/sessions']));
  });

  it('should show error message when login fails', async () => {
    mockAuthService.login.mockReturnValue(throwError(() => new Error('fail')));

    const submitButton = screen.getByTestId('submit-button') as HTMLButtonElement;
    const inputEmail = screen.getByTestId('input-email') as HTMLInputElement;
    const inputPassword = screen.getByTestId('input-password') as HTMLInputElement;

    await userEvent.type(inputEmail, 'user@test.com');
    await userEvent.type(inputPassword, '12345');

    await waitFor(() => expect(submitButton).toBeEnabled());

    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toBeInTheDocument();
    });
    
  });
});