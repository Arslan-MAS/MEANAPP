import { Component, OnDestroy, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Subscription } from "rxjs";
import { AuthService } from "../auth.service";

@Component({
  selector:"app-signup",
  templateUrl: "./signup.component.html",
  styleUrls:["./signup.component.css"]
})
export class SignUpComponent implements OnInit ,OnDestroy{
  isLoading =false;
  authStatusSub :Subscription;
  constructor (private authService :AuthService ){

  }
  ngOnInit(): void {
    this.authStatusSub= this.authService.getAuthStatusListener().subscribe(()=>{
      this.isLoading=false;
    })
  }
  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }
  onSignUp(signupForm : NgForm){
    console.log(signupForm);
    if (signupForm.invalid){
      return ;
    }
    this.isLoading=true;
    this.authService.createUser(signupForm.value.email,signupForm.value.password);
  }
}
