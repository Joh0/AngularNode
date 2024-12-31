import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { MenuItem } from '../models/menu-item.model';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css'
})
export class EditComponent implements OnInit {

  itemToBeEdited: MenuItem = {
    id: 0,
    item: '',
    'price ($)': 0,
    'calories (kCal)': 0
  };

  constructor(private router: Router, private route: ActivatedRoute, private myService: ApiService){
  }

  ngOnInit(): void {
    // At initialisation of editComponent, there is alreeady an item in itemEmitter so subscribing will produce an item. This item is then tagged to itemToBeEdited
    this.myService.itemObservable$.subscribe(
     (item) => {
      if(item){
        this.itemToBeEdited = item;
        console.log('In EditComponent - item received:', item);
        console.log("itemToBeEdited: " + this.itemToBeEdited);
        console.log(this.itemToBeEdited.id);
        console.log(this.itemToBeEdited['price ($)']);
        console.log(this.itemToBeEdited['calories (kCal)']);
      } else {
        console.error('No item available to be edited! Navigate back or show an error.');
      }
     }
    );
  }

  saveItem(form: NgForm){
    console.log("Save Item Form: " + form);
    var id: Number = form.value.id;
    var item: MenuItem = {
      id: form.value.id,
      item: form.value.name,
      'price ($)': form.value.price,
      'calories (kCal)': form.value.calories
    }
    console.log("Item to be saved: " + item);
    this.myService.editItem(id, item).subscribe(
      (response: { status: boolean, message: string}) => {
        alert(response.message);
        this.myService.triggerRefresh();
        this.router.navigate(['/menu'], { relativeTo: this.route });
      },
      (error) => {
        alert("Error in saving Item: " + error);
      }
    )
  }

  
}
