import { render, screen, waitFor } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { expect } from '@jest/globals'; 
import { SessionService } from 'src/app/services/session.service';

import { MeComponent } from './me.component';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { User } from 'src/app/interfaces/user.interface';
import { of } from 'rxjs/internal/observable/of';

describe('MeComponent', () => {
  let component: MeComponent;
  let fixture: ComponentFixture<MeComponent>;

  const mockUser: User = {
    id: 1,
    email: 'test@test.com',
    firstName: 'Alex',
    lastName: 'TEST',
    admin: true,
    password: '',
    createdAt: new Date()
  };

  const mockSessionService = {
    sessionInformation: { id: 1, admin: true },
    logOut: jest.fn()
  };

  const mockUserService = {
    getById: jest.fn(),
    delete: jest.fn()
  };

  const mockRouter = {
    navigate: jest.fn()
  };

  const mockSnackBar = {
    open: jest.fn()
  };

  beforeEach(async () => {
    mockUserService.getById.mockReturnValue(of(mockUser));
    mockUserService.delete.mockReturnValue(of(null));

    await TestBed.configureTestingModule({
      declarations: [MeComponent],
      imports: [
        MatSnackBarModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
      ],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: UserService, useValue: mockUserService },
        { provide: Router, useValue: mockRouter },
        { provide: MatSnackBar, useValue: mockSnackBar }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => jest.clearAllMocks());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load user on init', () => {
    expect(mockUserService.getById).toHaveBeenCalledWith('1');
    expect(component.user).toEqual(mockUser);
  });

  it('should go back when back() is called', () => {
    const spy = jest.spyOn(window.history, 'back').mockImplementation();

    component.back();

    expect(spy).toHaveBeenCalled();
  });

  it('should delete user and perform side effects', () => {
    component.delete();

    expect(mockUserService.delete).toHaveBeenCalledWith('1');
    expect(mockSnackBar.open).toHaveBeenCalled();
    expect(mockSessionService.logOut).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });
});

describe('MeComponent (integration tests)', () => {
  const mockUser: User = {
    id: 2,
    email: 'user@test.com',
    firstName: 'Alex',
    lastName: 'DUBOIS',
    admin: false,
    password: '12345',
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-02')
  };

  const mockSessionService = {
    sessionInformation: { id: 2, admin: false },
    logOut: jest.fn()
  };

  const mockUserService = {
    getById: jest.fn(),
    delete: jest.fn()
  };

  const mockRouter = { 
    navigate: jest.fn() 
  };
  const mockBack = {
    back: jest.fn()
  };
  const mockSnackBar = {
    open: jest.fn()
  };

  beforeEach(async () => {
    mockUserService.getById.mockReturnValue(of(mockUser));
    mockUserService.delete.mockReturnValue(of(null));

    await render(MeComponent, {
      imports: [
        MatCardModule,
        MatIconModule,
        MatSnackBarModule
      ],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: UserService, useValue: mockUserService },
        { provide: Router, useValue: mockRouter },
        { provide: MatSnackBar, useValue: mockSnackBar }
      ]
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render user info for a normal user', async () => {
    expect(screen.getByTestId('page-title')).toHaveTextContent('User information');
    expect(screen.getByTestId('user-name-line')).toHaveTextContent('Name: Alex DUBOIS');
    expect(screen.getByTestId('user-email-line')).toHaveTextContent('Email: user@test.com');
    expect(screen.queryByTestId('is-admin-message')).toBeNull();
    expect(screen.getByText('Delete my account:')).toBeInTheDocument();
    expect(screen.getByTestId('user-created-line')).toHaveTextContent('Create at: January 1, 2026');
    expect(screen.getByTestId('user-updated-line')).toHaveTextContent('Last update: January 2, 2026');
  });

  it('should render admin message for an admin user', async () => {
    mockUser.admin = true;

    waitFor(() => {
      expect(screen.getByTestId('is-admin-message')).toHaveTextContent('You are admin');
      expect(screen.queryByText('Delete my account:')).toBeNull();
    })
  });

  it('should delete non-admin user and redirect to the home page', async () => {
    mockUser.admin = false;

    await waitFor(() => {
      expect(screen.getByText('Delete my account:')).toBeInTheDocument();
      
      const deleteButton = screen.getByTestId('delete-button');
      userEvent.click(deleteButton);

      expect(mockUserService.delete).toHaveBeenCalledWith('2');
      expect(mockSnackBar.open).toHaveBeenCalledWith(
        "Your account has been deleted !",
        'Close',
        { duration: 3000 }
      );
      expect(mockSessionService.logOut).toHaveBeenCalled();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
    });
  });

  it('should call back() when back button is clicked', async () => {
    const backButton = screen.getByTestId('back-button');
    await userEvent.click(backButton);

    waitFor(() => expect(mockBack.back).toHaveBeenCalled());
  });
});