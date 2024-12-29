import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from '@angular/router';
import { ApiService } from './api.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root', // Ensure it's provided at the root level.
})
export class AuthGuard implements CanActivate{
  
  constructor(private myService: ApiService, private router: Router){}

  canActivate(): boolean {
    if(this.myService.isLoggedIn()){
      console.log('AuthGuard: Access granted.');
      return true;
    }
    console.log('AuthGuard: Redirecting to login...');
    alert("Please sign in!")
    this.router.navigate(['/login']);
    return false;
  }

  
}
