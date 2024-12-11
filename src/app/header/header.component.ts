import { Component, OnDestroy, OnInit } from '@angular/core';

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

}
