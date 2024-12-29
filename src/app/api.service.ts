import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MenuItem } from './models/menu-item.model';
import { User } from './models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = 'http://localhost:3000/api/';

  // For Sending Item from MenuComponent to EditComponent
  private itemEmitter = new BehaviorSubject<any>(null);
  itemObservable$ = this.itemEmitter.asObservable();

  // For Refreshing MenuComponent after editing
  private refreshDataEmitter = new BehaviorSubject<void>(undefined);  // Trigger refresh
  refreshDataObservable$ = this.refreshDataEmitter.asObservable();

  constructor(private http: HttpClient) { }

  // Read
  getMenu(): Observable<{status: boolean, data: MenuItem[]}>{
    return this.http.get<{status: boolean, data: MenuItem[]}>(this.apiUrl + 'menu');
    //return this.http.get<MenuItem[]>(`${this.apiUrl}menu`);
  }

  // Delete
  deleteItem(id: Number): Observable<{status: boolean, message: string}>{
    return this.http.delete<{status: boolean, message: string}>(this.apiUrl + 'delete/' + id);
  }

  // Add
  addItem(item: MenuItem): Observable<{status: boolean, message: string}>{
    return this.http.post<{status: boolean, message: string}>(this.apiUrl + 'add', item);
  }

  // Search
  searchItem(name: string): Observable<{status: boolean, data: MenuItem[]}>{
    return this.http.get<{status: boolean, data: MenuItem[]}>(this.apiUrl + 'search/' + name);
  } 

  // Edit
  editItem(id: Number, item: MenuItem): Observable<{status: boolean, message: string}>{
    return this.http.put<{status: boolean, message: string}>(this.apiUrl + 'update/' + id, item)
  }

  // Sending Item from MenuComponent to here
  pushingItem(item: MenuItem){
    this.itemEmitter.next(item);
    console.log("In apiservice pushed")
    console.log(item.id);
    console.log(item['price ($)']);
    console.log(item['calories (kCal)']);
  }

  // Function to refresh MenuComponent
  triggerRefresh() {
    this.refreshDataEmitter.next();  // This triggers the refresh
  }

  // Register User
  registerUser(user: User): Observable<{status: boolean, message: string}>{
    return this.http.post<{status: boolean, message: string}>(this.apiUrl + 'register', user);
  }

  // Login User
  loginUser(userDetails: {email: string, password: string}){
    return this.http.post<string>(this.apiUrl + 'login', userDetails);
  }


  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem('token');
  }
}
