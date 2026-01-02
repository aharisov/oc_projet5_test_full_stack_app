import { render, screen, waitFor } from '@testing-library/angular';
import '@testing-library/jest-dom';

import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/services/session.service';

import { ListComponent } from './list.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Session } from '../../interfaces/session.interface';
import { SessionApiService } from '../../services/session-api.service';
import { of } from 'rxjs';

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;

  const mockSessionService = {
    sessionInformation: {
      admin: true
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListComponent],
      imports: [HttpClientModule, MatCardModule, MatIconModule],
      providers: [{ provide: SessionService, useValue: mockSessionService }]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

describe('ListComponent (integration tests)', () => {
  const mockSessions: Session[] = [
    {
      id: 1,
      name: 'Yoga',
      description: 'Relaxing yoga session',
      date: new Date('2026-01-10'),
      teacher_id: 1,
      users: []
    },
    {
      id: 2,
      name: 'Pilates',
      description: 'Core strengthening',
      date: new Date('2026-01-15'),
      teacher_id: 1,
      users: []
    },
  ];

  const mockSessionApiService = {
    all: jest.fn()
  };

  const mockSessionService = {
    sessionInformation: {
      admin: false
    }
  }

  const renderComponent = async (isAdmin: boolean) => {
    mockSessionApiService.all.mockReturnValue(of(mockSessions));
    mockSessionService.sessionInformation = {
      admin: isAdmin
    };

    await render(ListComponent, {
      imports: [
        RouterTestingModule,
        MatCardModule,
        MatIconModule
      ],
      providers: [
        { provide: SessionApiService, useValue: mockSessionApiService },
        { provide: SessionService, useValue: mockSessionService }
      ]
    });
  }

  it('should render the list of sessions', async () => {
    await renderComponent(false);

    expect(await screen.findByText('Yoga') as HTMLElement).toBeInTheDocument();
    expect(await screen.findByText('Relaxing yoga session') as HTMLElement).toBeInTheDocument();
    expect(await screen.findByText('Pilates') as HTMLElement).toBeInTheDocument();
    expect(await screen.findByText('Core strengthening') as HTMLElement).toBeInTheDocument();
  });

  it('should show Create button for admin user', async () => {
    await renderComponent(true);

    const button = await screen.findByTestId('create-button') as HTMLButtonElement;
    expect(button).toBeInTheDocument();
  });

  it('should show Edit buttons for admin user', async () => {
    await renderComponent(true);

    const editButtons = await screen.findAllByTestId('edit-button');
    expect(editButtons.length).toBe(2);
  });

  it('should hide Create button for non-admin user', async () => {
    await renderComponent(false);

    const button = screen.queryByTestId('create-button') as HTMLButtonElement;
    expect(button).toBeNull();
  });

  it('should hide Edit buttons for non-admin user', async () => {
    await renderComponent(false);

    const editButtons = screen.queryAllByTestId('edit-button');
    expect(editButtons.length).toBe(0);
  });
});
