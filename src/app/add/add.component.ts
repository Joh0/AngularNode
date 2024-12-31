import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ApiService } from '../api.service';
import { MenuItem } from '../models/menu-item.model';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrl: './add.component.css'
})
export class AddComponent {

  constructor(private myService: ApiService){
  }

  onSubmit(form: NgForm){
    console.log("Add Form: " + form);
    var newItem: MenuItem = {
      id: 0, 
      item: form.value.name, 
      'price ($)': form.value.price, 
      'calories (kCal)': form.value.calories};
    console.log("Menu Item to be added: " + newItem);
    this.myService.addItem(newItem).subscribe(
      (response: { status: boolean; message: string}) => {
        alert(response.message);
        form.reset();
      },
      (error) => {
        alert("Error in Adding Item: " + error.message);
      }
    )
  }
}
