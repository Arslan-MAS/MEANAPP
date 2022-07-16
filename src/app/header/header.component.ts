import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { AuthService } from "../auth/auth.service";

@Component(
{
  selector:"app-header",
  templateUrl:"./header.component.html",
  styleUrls:["./header.component.css"]
}
)
export class HeaderComponent implements OnInit , OnDestroy{
  isLoggedIn : boolean = false ;
  authServiceSubscription : Subscription;
  constructor (private authService :AuthService ){

  }
  ngOnInit(): void {
    this.isLoggedIn=this.authService.getAuthStatus();
    this.authServiceSubscription =this.authService.getAuthStatusListener().subscribe((authStatus)=>{
      this.isLoggedIn= authStatus;
    })
  }

  ngOnDestroy(): void {
    if (this.authServiceSubscription){
      this.authServiceSubscription.unsubscribe();
    }
  }
  onLogout(){
    this.authService.logout() ;
  }
}
