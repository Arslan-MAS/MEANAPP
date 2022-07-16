import { Component, OnDestroy, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Subscription } from "rxjs";
import { AuthService } from "../auth.service";

@Component({
  selector:"app-login",
  templateUrl: "./login.component.html",
  styleUrls:["./login.component.css"]
})
export class LoginComponent implements OnInit ,OnDestroy {
  isLoading =false;

  authStatusSub :Subscription;
  constructor(private authService :AuthService ){

  }
  ngOnInit(): void {
    this.authStatusSub= this.authService.getAuthStatusListener().subscribe(()=>{
      this.isLoading=false;
    })
  }
  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }
  onLogin(loginForm : NgForm){
    console.log(loginForm);
    if (loginForm.invalid ){
      return ;
    }
    this.isLoading=true;
    this.authService.login(loginForm.value.email,loginForm.value.password);

  }
}
