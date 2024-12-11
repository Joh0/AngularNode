import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { MenuItem } from '../models/menu-item.model';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit, OnDestroy{

  menuData: MenuItem[] = [];
  refreshSubscription: Subscription = new Subscription;

  constructor(private router: Router, private route: ActivatedRoute, private myService: ApiService){
  }

  ngOnInit(): void {

    this.refreshSubscription = this.myService.refreshDataObservable$.subscribe(() => {
      this.getData();
    }
    );
    this.getData();
  }

  ngOnDestroy() {
    // Unsubscribe when the component is destroyed to avoid memory leaks
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  getData(): void {
    this.myService.getMenu().subscribe(
      (response: { status: boolean; data: MenuItem[] }) => {
        this.menuData = response.data;
        console.log(this.menuData);
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
    form.reset();
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

  editItem(item: MenuItem){
    console.log("In editItem function in MenuComponent");
    console.log(item.id);
    console.log(item['price ($)']);
    console.log(item['calories (kCal)']);
    // Very important to make a copy and push that copy, otherwise the data in menuComponent will adjust as well if you are using ngModel
    var copiedItem = JSON.parse(JSON.stringify(item));
    this.myService.pushingItem(copiedItem);
    setTimeout(() => {
      this.router.navigate(['edit'], { relativeTo: this.route });
    }, 0);
    console.log(this.router.config); // Check all defined routes
    console.log(this.route.snapshot.url); // Current route segments
  }

}


