import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PatientService {
  private base = 'http://localhost:4000/api/patients';
  constructor(private http: HttpClient) {}
  list(params?: any) { return this.http.get<any>(this.base, { params }); }
  get(id: string) { return this.http.get<any>(`${this.base}/${id}`); }
  create(data: any) { return this.http.post<any>(this.base, data); }
  update(id: string, data: any) { return this.http.put<any>(`${this.base}/${id}`, data); }
  remove(id: string) { return this.http.delete<any>(`${this.base}/${id}`); }
}
