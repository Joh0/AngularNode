import { ChangeDetectorRef, Component } from '@angular/core';
import { ApiService } from '../api.service';
import { MenuItem } from '../models/menu-item.model';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {

  menuData: MenuItem[] = [];

  constructor(private cdr: ChangeDetectorRef, private myService: ApiService){
  }

  ngOnInit(): void {
    this.getData();
  }

  getData(): void {
    this.myService.getMenu().subscribe(
      (response: { status: boolean; data: MenuItem[] }) => {
        this.menuData = response.data;
        console.log(this.menuData);
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching resources:', error);
      }
    );
  }

  deleteItem(id: Number){
    console.log('deleteItem called with ID:', id);
    alert("Here!");
    this.myService.deleteItem(id).subscribe(
      (response: { status: boolean; message: string}) => {
        alert(response.message);
        this.getData();
      },
      (error) => {
        alert(error);
      }
    );
  }

  searchItem(form: NgForm){
    var item: string = form.value.name;
    console.log(form.value.name);
    this.myService.searchItem(item).subscribe(
      (response: { status: boolean; data: MenuItem[] }) => {
        this.menuData = response.data;
        //console.log('Updated menuData:', this.menuData);
      },
      (error) => {
        console.error('Error fetching resources:', error);
      }
    )
  }
}


