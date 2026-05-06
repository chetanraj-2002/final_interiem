import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Threshold } from '../models/models';

@Injectable({ providedIn: 'root' })
export class ThresholdService {
  private baseUrl = 'http://localhost:9090/api/thresholds';

  constructor(private http: HttpClient) {}

  getByAssetId(assetId: number): Observable<Threshold> {
    return this.http.get<Threshold>(`${this.baseUrl}/${assetId}`);
  }

  saveOrUpdate(payload: { assetId: number; rmsMax: number; tempMax: number }): Observable<Threshold> {
    return this.http.post<Threshold>(this.baseUrl, payload);
  }
}
