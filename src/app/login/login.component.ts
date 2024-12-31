import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ApiService } from '../api.service';
import { User } from '../models/user.model';
import { error } from 'console';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  options = ['Admin', 'User']
  buttonLabel = 'Login'
  SwitchLabel = 'Register'
  showPassword: boolean = false;

  constructor(private myService: ApiService, private router: Router){}

  onSubmit(form: NgForm){
    if(this.buttonLabel == 'Register'){
      this.onRegister(form.value);
      form.reset();
    }
    else{
      this.onLogin(form.value);
      form.reset();
    }
    }
  


  onSwitch(){
    if(this.buttonLabel == 'Register'){
      this.buttonLabel = 'Login';
      this.SwitchLabel = 'Register'
    }
    else{
      this.buttonLabel = 'Register';
      this.SwitchLabel = 'Login'
    }
  }

  onRegister(user: User){
    console.log("User to register: " + user);
    this.myService.registerUser(user).subscribe(
      (response: {status: boolean, message: string}) => {
        alert(response.message);
      },
      (error) => {
        alert("Error in registering: " + error.message);
      }
    )
  }

  onLogin(userDetails: {email: string, password: string}){
    console.log("User to log in: " + userDetails);
    this.myService.loginUser(userDetails).subscribe(
      (response: string) => {
        this.myService.saveToken(response);
        alert("Login successful!")
        console.log("logging isLoggedIn: " + this.myService.isLoggedIn());
        this.router.navigate(['/home']);
      },
      (error) => {
        alert("Error in logging in: " + error.message);
      }
    )
  }

  togglePasswordVisibility(){
    this.showPassword = !this.showPassword;
  }

}
