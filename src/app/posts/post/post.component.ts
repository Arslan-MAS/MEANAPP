import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";
import { PostsService } from "../posts.service";

@Component({
  selector: "app-post",
  templateUrl : "./post.component.html",
  styleUrls :["./post.component.css"]
})
export class PostComponent implements OnInit , OnDestroy {
  panelOpenState = false;
  @Input("Title") title:String ;
  @Input("Content")  content:String ;
  @Input ("Id") id :String ;
  @Input ("ImagePath") imagePath :String ;

  @Input () postUserId :String ;
  @Input () postsPerPage :number ;
  @Input () currentPage :number ;
  authSubscription : Subscription ;
  isLoggedIn : boolean= false ;
  isLoading :boolean = false ;
  userId :string ;
  constructor ( private postsService : PostsService, private authService :AuthService){

  }
  ngOnInit(): void {

    this.isLoggedIn=this.authService.getAuthStatus();

    this.userId=this.authService.getUserID() ;
    console.log(this.userId);
    console.log(this.postUserId);
     this.authSubscription = this.authService.getAuthStatusListener().subscribe(authStatus =>{

      this.isLoggedIn= authStatus ;

      this.userId=this.authService.getUserID() ;
     });
  }
  ngOnDestroy(): void {

    if (this.authSubscription){
      this.authSubscription.unsubscribe();
    }
  }

  onDelete (id :String){
    this.isLoading=true;
    this.postsService.deletePost(id).subscribe(()=>{
      this.isLoading=false ;
      this.postsService.getPosts(0,0);

    });
  }
}
