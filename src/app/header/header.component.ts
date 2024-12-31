import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{

  welcomeMessage: string = 'Please sign in for features';
  userNameSubscription: Subscription = new Subscription;

  constructor(private myService: ApiService, private router: Router){
    this.userNameSubscription = myService.userNameObservable$.subscribe(
      (username) => {
        this.welcomeMessage = username;
      }
    )
  }

  ngOnInit(){
    this.myService.pushingUsername('Please sign in for features');
  }

 
  logout(){
    this.myService.logout();
    alert("Successfully logged out!");
    this.myService.pushingUsername('Please sign in for features');
    this.router.navigate(['/home']);
  }
}
