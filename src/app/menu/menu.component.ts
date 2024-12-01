import { Component } from '@angular/core';
import { ApiService } from '../api.service';
import { MenuItem } from '../models/menu-item.model';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {

  menuData: MenuItem[] = [];

  constructor(private myService: ApiService){
  }

  ngOnInit(): void {
    this.getData();
  }

  getData(): void {
    this.myService.getMenu().subscribe(
      (response: { status: boolean; data: MenuItem[] }) => {
        this.menuData = response.data;
      },
      (error) => {
        console.error('Error fetching resources:', error);
      }
    );
  }
}


