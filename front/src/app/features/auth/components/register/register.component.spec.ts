import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
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
        HttpClientModule,
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
