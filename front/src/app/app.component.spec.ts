import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { of } from 'rxjs';

import { AppComponent } from './app.component';
import { SessionService } from './services/session.service';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let router: Router;

  const mockSessionService = {
    $isLogged: jest.fn().mockReturnValue(of(true)),
    logOut: jest.fn()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        HttpClientModule,
        MatToolbarModule
      ],
      declarations: [
        AppComponent
      ],
      providers: [
        { provide: SessionService, useValue: mockSessionService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router); 
    jest.spyOn(router, 'navigate');

    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should call sessionService.$isLogged and return its value', (done) => {
    const mockValue = true;
    const serviceSpy = jest
      .spyOn(mockSessionService as any, '$isLogged')
      .mockReturnValue(of(mockValue));

    component.$isLogged().subscribe(value => {
      expect(value).toBe(mockValue); 
      expect(serviceSpy).toHaveBeenCalled(); 
      done();
    });
  });

  it('should call sessionService.logOut and navigate to home page', () => {
    jest.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true));
    
    component.logout();

    expect(mockSessionService.logOut).toHaveBeenCalled(); 
    expect(router.navigate).toHaveBeenCalledWith(['']);
  });
});
