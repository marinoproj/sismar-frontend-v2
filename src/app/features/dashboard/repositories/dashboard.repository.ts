import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { DashboardSummary } from '../models/dashboard.model';

export abstract class DashboardRepository {
  abstract getSummary(): Observable<DashboardSummary>;
}

export const DASHBOARD_REPOSITORY = new InjectionToken<DashboardRepository>('DASHBOARD_REPOSITORY');
