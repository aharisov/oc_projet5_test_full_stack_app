import { render, screen, waitFor } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { expect } from '@jest/globals'; 

import { RegisterComponent } from './register.component';
import { AuthService } from '../../services/auth.service';
import { RegisterRequest } from '../../interfaces/registerRequest.interface';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  const mockAuthService = {
    register: jest.fn()
  };

  const mockRouter = {
    navigate: jest.fn()
  };

  const mockRegisterInformation: RegisterRequest = {
    email: 'test@test.com',
    password: '123',
    firstName: 'Paul',
    lastName: 'Valery'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [
        BrowserAnimationsModule,
        ReactiveFormsModule,  
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule
      ],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call authService.register with form values', () => {
    mockAuthService.register.mockReturnValue(of(mockRegisterInformation));

    component.form.setValue({
      email: 'test@test.com',
      password: '123',
      firstName: 'Paul',
      lastName: 'Valery'
    });

    component.submit();

    expect(mockAuthService.register).toHaveBeenCalledWith({
      email: 'test@test.com',
      password: '123',
      firstName: 'Paul',
      lastName: 'Valery'
    });
  });

  it('should register and redirect on success', () => {
    mockAuthService.register.mockReturnValue(of(mockRegisterInformation));

    component.form.setValue({
      email: 'test@test.com',
      password: '123',
      firstName: 'Paul',
      lastName: 'Valery'
    });

    component.submit();

    expect(mockAuthService.register).toHaveBeenCalledWith({
      email: 'test@test.com',
      password: '123',
      firstName: 'Paul',
      lastName: 'Valery'
    });
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
    expect(component.onError).toBe(false);
  });

  it('should set onError to true on register error', () => {
    mockAuthService.register.mockReturnValue(
      throwError(() => new Error('Invalid credentials'))
    );

    component.form.setValue({
      email: 'test@test.com',
      password: '',
      firstName: '',
      lastName: 'Valery'
    });

    component.submit();

    expect(mockAuthService.register).toHaveBeenCalled();
    expect(component.onError).toBe(true);
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });
});

describe('RegisterComponent (integration tests)', () => {
  const mockAuthService = {
    register: jest.fn().mockReturnValue(of({ 
      firstName: 'Alex', 
      lastName: 'Dubois',
      email: 'user@test.com',
      password: '12345'
    }))
  };

  const mockRouter = {
    navigate: jest.fn()
  };

  beforeEach(async () => {
    await render(RegisterComponent, {
      imports: [
        ReactiveFormsModule,
        MatCardModule,
        MatInputModule,
        MatIconModule
      ],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ]
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render register title', async () => {
    expect(screen.getByTestId('register-form-title')).toHaveTextContent('Register');
  });

  it('should disable submit button when form is invalid', async () => {
    const button = screen.getByTestId('submit-button') as HTMLButtonElement;
    const inputFirstName = screen.getByTestId('input-fname') as HTMLInputElement;
    const inputLastName = screen.getByTestId('input-lname') as HTMLInputElement;
    const inputEmail = screen.getByTestId('input-email') as HTMLInputElement;
    const inputPassword = screen.getByTestId('input-password') as HTMLInputElement;

    await userEvent.type(inputFirstName, 'ss'); // min length is 3
    await userEvent.type(inputLastName, 'Dubois');
    await userEvent.type(inputEmail, 'user@test.com');
    await userEvent.type(inputPassword, '12345');

    await waitFor(() => expect(button).toBeDisabled());
  });

  it('should show empty field error', async () => {
    const button = screen.getByTestId('submit-button') as HTMLButtonElement;
    const inputFirstName = screen.getByTestId('input-fname') as HTMLInputElement;
    const inputLastName = screen.getByTestId('input-lname') as HTMLInputElement;

    // imitate entering input without typing
    await userEvent.click(inputFirstName); 
    await userEvent.type(inputLastName, 'Dubois');

    await waitFor(() => expect(inputFirstName).toHaveClass('ng-invalid'));
  });

  it('should enable submit button when form is valid', async () => {
    const button = screen.getByTestId('submit-button') as HTMLButtonElement;
    const inputFirstName = screen.getByTestId('input-fname') as HTMLInputElement;
    const inputLastName = screen.getByTestId('input-lname') as HTMLInputElement;
    const inputEmail = screen.getByTestId('input-email') as HTMLInputElement;
    const inputPassword = screen.getByTestId('input-password') as HTMLInputElement;

    expect(button).toBeDisabled();

    await userEvent.type(inputFirstName, 'Alex');
    await userEvent.type(inputLastName, 'Dubois');
    await userEvent.type(inputEmail, 'user@test.com');
    await userEvent.type(inputPassword, '12345');
    
    await waitFor(() => {
      expect(inputFirstName).toHaveValue('Alex');
      expect(inputLastName).toHaveValue('Dubois');
      expect(inputEmail).toHaveValue('user@test.com');
      expect(inputPassword).toHaveValue('12345');
      expect(button).toBeEnabled();
    });
  });

  it('should call authService.register on success', async () => {
    const submitButton = screen.getByTestId('submit-button') as HTMLButtonElement;
    const inputFirstName = screen.getByTestId('input-fname') as HTMLInputElement;
    const inputLastName = screen.getByTestId('input-lname') as HTMLInputElement;
    const inputEmail = screen.getByTestId('input-email') as HTMLInputElement;
    const inputPassword = screen.getByTestId('input-password') as HTMLInputElement;

    await userEvent.type(inputFirstName, 'Alex');
    await userEvent.type(inputLastName, 'Dubois');
    await userEvent.type(inputEmail, 'user@test.com');
    await userEvent.type(inputPassword, '12345');

    await waitFor(() => {
      expect(submitButton).toBeEnabled();

      userEvent.click(screen.getByTestId('submit-button'));

      expect(mockAuthService.register).toHaveBeenCalledWith({
        firstName: 'Alex',
        lastName: 'Dubois',
        email: 'user@test.com',
        password: '12345'
      });
    });
  });

  it('should navigate to /login after login success', async () => {
    const submitButton = screen.getByTestId('submit-button') as HTMLButtonElement;
    const inputFirstName = screen.getByTestId('input-fname') as HTMLInputElement;
    const inputLastName = screen.getByTestId('input-lname') as HTMLInputElement;
    const inputEmail = screen.getByTestId('input-email') as HTMLInputElement;
    const inputPassword = screen.getByTestId('input-password') as HTMLInputElement;

    await userEvent.type(inputFirstName, 'Alex');
    await userEvent.type(inputLastName, 'Dubois');
    await userEvent.type(inputEmail, 'user@test.com');
    await userEvent.type(inputPassword, '12345');

    await waitFor(() => {
      expect(submitButton).toBeEnabled();
      
      userEvent.click(submitButton);

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/login'])
    });
  });

  it('should show error message when register fails', async () => {
    mockAuthService.register.mockReturnValue(throwError(() => new Error('fail')));

    const submitButton = screen.getByTestId('submit-button') as HTMLButtonElement;
    const inputFirstName = screen.getByTestId('input-fname') as HTMLInputElement;
    const inputLastName = screen.getByTestId('input-lname') as HTMLInputElement;
    const inputEmail = screen.getByTestId('input-email') as HTMLInputElement;
    const inputPassword = screen.getByTestId('input-password') as HTMLInputElement;

    await userEvent.type(inputFirstName, 'Test');
    await userEvent.type(inputLastName, 'Dubois');
    await userEvent.type(inputEmail, 'user@test.com');
    await userEvent.type(inputPassword, '12345');

    await waitFor(() => {
      expect(submitButton).toBeEnabled();

      userEvent.click(submitButton);
      expect(screen.getByTestId('error-message')).toBeInTheDocument();
    });
    
  });
});