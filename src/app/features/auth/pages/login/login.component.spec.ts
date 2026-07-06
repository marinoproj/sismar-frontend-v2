import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Dialog } from '@angular/cdk/dialog';
import { of, Subject } from 'rxjs';
import { LoginComponent } from './login.component';
import { AuthService } from '../../../../core/auth/auth.service';
import { ToastService } from '../../../../core/services/toast.service';
import { THEME_CONFIG, themeConfig } from '../../../../core/config/theme.config';
import { ClientDTO } from '../../../../core/auth/session.model';

function buildClient(code: string): ClientDTO {
  return { id: 1, code, name: code, dhCreate: '', dhDeleted: null, enableAreaNotifications: false };
}

describe('LoginComponent', () => {
  let fixture: ComponentFixture<LoginComponent>;
  let component: LoginComponent;
  let getClients: jest.Mock;
  let login: jest.Mock;
  let toastShow: jest.Mock;
  let dialogOpen: jest.Mock;
  let navigate: jest.Mock;

  beforeEach(() => {
    getClients = jest.fn();
    login = jest.fn();
    toastShow = jest.fn();
    dialogOpen = jest.fn();
    navigate = jest.fn();

    TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: THEME_CONFIG, useValue: themeConfig },
        { provide: AuthService, useValue: { getClients, login } },
        { provide: ToastService, useValue: { show: toastShow } },
        { provide: Dialog, useValue: { open: dialogOpen } },
        { provide: Router, useValue: { navigate } },
      ],
    });

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    component.form.setValue({ username: 'joao', password: 'senha123' });
  });

  it('logs in directly when the user has exactly one client', () => {
    getClients.mockReturnValue(of([buildClient('SANTOS')]));
    login.mockReturnValue(of({}));

    component.submit();

    expect(login).toHaveBeenCalledWith({ username: 'joao', password: 'senha123' }, 'SANTOS');
    expect(navigate).toHaveBeenCalledWith(['/']);
    expect(dialogOpen).not.toHaveBeenCalled();
  });

  it('shows a toast and does not log in when there are no clients', () => {
    getClients.mockReturnValue(of([]));

    component.submit();

    expect(toastShow).toHaveBeenCalledWith(expect.objectContaining({ type: 'error' }));
    expect(login).not.toHaveBeenCalled();
  });

  it('opens the client picker when there is more than one client, and logs in with the chosen code', () => {
    const closed = new Subject<string | undefined>();
    dialogOpen.mockReturnValue({ closed });
    getClients.mockReturnValue(of([buildClient('SANTOS'), buildClient('ITAJAI')]));
    login.mockReturnValue(of({}));

    component.submit();

    expect(dialogOpen).toHaveBeenCalled();
    expect(login).not.toHaveBeenCalled();

    closed.next('ITAJAI');

    expect(login).toHaveBeenCalledWith({ username: 'joao', password: 'senha123' }, 'ITAJAI');
  });

  it('does not log in when the client picker is cancelled', () => {
    const closed = new Subject<string | undefined>();
    dialogOpen.mockReturnValue({ closed });
    getClients.mockReturnValue(of([buildClient('SANTOS'), buildClient('ITAJAI')]));

    component.submit();
    closed.next(undefined);

    expect(login).not.toHaveBeenCalled();
  });
});
