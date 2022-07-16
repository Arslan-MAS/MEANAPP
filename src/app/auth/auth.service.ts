import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, Subject } from "rxjs";
import { AuthData } from "./auth.model";

@Injectable ({
providedIn : "root"
})
export class AuthService {
  private token :string ;
  private tokenTimer : NodeJS.Timeout ;
  private authStatus :boolean ;
  private userId : string;
  private authStatusListener= new Subject<boolean>();
  constructor (private http:HttpClient ,private router :Router){

  }
  getToken(){
    return this.token;
  }
  getAuthStatus(){
    return this.authStatus;
  }
  getAuthStatusListener():Observable<boolean>{
    return this.authStatusListener.asObservable();
  }
  getUserID() {
    return this.userId;
  }


  createUser(email:string, password:string){
    const authData : AuthData = {
      email : email ,
      password : password ,
    } ;
    this.http.post("http://localhost:3000/api/user/signup",
      authData
    ).subscribe(response =>{
      console.log(response);
      this.login(email,password);

    },(error)=>{
      console.log(error);
      this.authStatusListener.next(false);

    });
  }
  login( email :string ,password :string ){
    const authData : AuthData = {
      email : email ,
      password : password ,
    } ;
    this.http.post<{
      token:string ,
      userId: string,
      expiresIn : number
    }>("http://localhost:3000/api/user/login",
      authData
    ).subscribe(response =>{
      this.token= response.token;
      //console.log(response);
      if (this.token){
        const expiresInDuration = response.expiresIn;
        this.initializeTimer(expiresInDuration);
        const now =new Date();
        const expirationDate = new Date (now.getTime() + expiresInDuration*1000);
        this.userId=response.userId;
        this.saveAuthData(this.token,expirationDate,this.userId);
        console.log(expirationDate);
        this.authStatus=true;
        this.authStatusListener.next(true);
        this.router.navigate(['/']);
      }
    } , ()=> {
      this.authStatusListener.next(false);
    });
  }

  autoAuthUser(){
    const authInfo=   this.getAuthData();
    if (!authInfo){
      return ;
    }
    const now = new Date();
    const expiresIn = authInfo.expirationDate.getTime() -  now.getTime() ;
    if (expiresIn>0){
      this.token=authInfo.token;
      this.userId= authInfo.userId;
      this.authStatus= true;
      this.authStatusListener.next(true);
      this.initializeTimer(expiresIn/1000);
    }

  }

  initializeTimer (duration :number ){


    this.tokenTimer = setTimeout(()=>{
      this.logout();
    },
    duration*1000);
  }
  logout (){

    this.authStatus=false;
    this.token=null;
    this.userId= null ;
    this.authStatusListener.next(false );
    this.router.navigate(['/']);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
  }
  private saveAuthData(token :string , expirationDate : Date ,userId : string){
    localStorage.setItem('token',token);
    localStorage.setItem("userId",userId);
    localStorage.setItem('expiration',expirationDate.toISOString());
  }
  private clearAuthData (){
    localStorage.removeItem ("expiration");
    localStorage.removeItem("token");

    localStorage.removeItem("userId");
  }
  private getAuthData(){

    const userId = localStorage.getItem("userId");
    const token =  localStorage.getItem("token");
    const expirationDate = localStorage.getItem ("expiration");
    if (!token ||  !expirationDate ){
      return ;
    }
    return {
        token:token,
        expirationDate :new Date(expirationDate),
        userId : userId
    }

  }
}
