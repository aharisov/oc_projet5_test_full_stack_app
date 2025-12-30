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
        MatInputModule
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
