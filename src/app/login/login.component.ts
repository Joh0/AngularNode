import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ApiService } from '../api.service';
import { User } from '../models/user.model';
import { error } from 'console';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  options = ['Admin', 'User']
  buttonLabel = 'Register'
  SwitchLabel = 'Login'

  constructor(private myService: ApiService){}

  onSubmit(form: NgForm){
    console.log(form.value);
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
    console.log(user);
    this.myService.registerUser(user).subscribe(
      (response: {status: boolean, message: string}) => {
        alert(response.message);
      },
      (error) => {
        alert("Error: " + error.message);
      }
    )
  }

  onLogin(userDetails: {email: string, password: string}){
    this.myService.loginUser(userDetails).subscribe(
      (response: string) => {
        this.saveToken(response);
        console.log("logging isLoggedIn: " + this.isLoggedIn());
      },
      (error) => {
        alert("Error: " + error.message);
      }
    )
  }

  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem('token');
  }

}
