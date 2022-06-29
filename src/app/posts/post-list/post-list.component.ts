import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { Post } from "../model/post.model";
import { PostsService } from "../posts.service";

@Component ({
  selector:'app-post-list',
  templateUrl: "./post-list.component.html",
  styleUrls: ["post-list.component.css"]
})
export class PostListComponent implements OnInit,OnDestroy{
//   posts :Post[] = [
//     new Post("First Post", "This is my FirstPost "),
//     new Post("Second Post", "This is my SecondPost "),
//     new Post("Third Post", "This is my ThirdPost "),
// ]
// @Input() posts :Post[] =[];
public isLoading= false ;
posts :Post[] =[];
subscription : Subscription ;
constructor(public postService :PostsService){

}
ngOnInit(): void {
  this.isLoading= true;
  this.postService.getPosts();
   this.subscription =this.postService.getPostUpdateListener().subscribe(
    (posts)=>{
      this.isLoading= false ;
      this.posts =posts;
    }
   )
}
ngOnDestroy(): void {
    if (this.subscription){
      this.subscription.unsubscribe();
    }
}
}
