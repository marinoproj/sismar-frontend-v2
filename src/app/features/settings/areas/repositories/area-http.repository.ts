import { HttpClient, HttpContext, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, of, throwError } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { SKIP_ERROR_TOAST } from '../../../../core/interceptors/skip-error-toast.context';
import { AreaRepository } from './area.repository';
import { Area, AreaInput, RetroactiveJob, TriggerRetroactiveJobInput } from '../models/area.model';

@Injectable()
export class AreaHttpRepository implements AreaRepository {
  private readonly http = inject(HttpClient);

  getAll(): Observable<Area[]> {
    return this.http.get<Area[]>(`${environment.apiUrl}/area`);
  }

  create(input: AreaInput): Observable<Area> {
    return this.http.post<Area>(`${environment.apiUrl}/area`, input);
  }

  update(id: number, input: AreaInput): Observable<Area> {
    return this.http.put<Area>(`${environment.apiUrl}/area/${id}`, input);
  }

  activate(id: number): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/area/${id}/activate`, {});
  }

  deactivate(id: number): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/area/${id}/deactivate`, {});
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/area/${id}`);
  }

  getLastRetroactiveJob(id: number): Observable<RetroactiveJob | null> {
    return this.http
      .get<RetroactiveJob>(`${environment.apiUrl}/area/${id}/retroactive-jobs/last`, {
        context: new HttpContext().set(SKIP_ERROR_TOAST, true),
      })
      .pipe(catchError((error: HttpErrorResponse) => (error.status === 404 ? of(null) : throwError(() => error))));
  }

  triggerRetroactiveJob(id: number, input: TriggerRetroactiveJobInput): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/area/${id}/retroactive-events`, input);
  }

  cancelRetroactiveJob(id: number): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/area/${id}/retroactive-jobs/last/cancel`, {});
  }
}
