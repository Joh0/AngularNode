import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {
      console.log('HomeComponent destroyed');
  }
  ngOnInit(): void {
    console.log('HomeComponent created');
  }

  constructor(private myService: ApiService, private router: Router){}

  logout(){
    this.myService.logout();
    alert("Successfully logged out!");
    this.router.navigate(['/home']);
  }

}
