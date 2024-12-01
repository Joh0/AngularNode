import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MenuItem } from './models/menu-item.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = 'http://localhost:3000/api/';

  constructor(private http: HttpClient) { }

  // Read
  getMenu(): Observable<{status: boolean, data: MenuItem[]}>{
    return this.http.get<{status: boolean, data: MenuItem[]}>(this.apiUrl + 'menu');
    //return this.http.get<MenuItem[]>(`${this.apiUrl}menu`);
  }
}
