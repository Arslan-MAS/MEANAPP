import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
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
public totalPosts = 0 ;
public postsPerPage = 2 ;
public pageSizeOptions = [1,2,5,10];
public currentPage =1 ;

constructor(public postService :PostsService){

}
ngOnInit(): void {
  this.isLoading= true;
  this.postService.getPosts(this.postsPerPage,this.currentPage);

   this.subscription =this.postService.getPostUpdateListener().subscribe(
    (postsData)=>{
      this.isLoading= false ;
      this.posts =postsData.posts;
      this.totalPosts=postsData.maxPosts;
    }
   )
}

onChangePage(pageData:PageEvent){
  this.isLoading=true;
  console.log(pageData);
  this.currentPage=pageData.pageIndex+1;
  this.postsPerPage= pageData.pageSize
  this.postService.getPosts(this.postsPerPage,this.currentPage);

}
ngOnDestroy(): void {
    if (this.subscription){
      this.subscription.unsubscribe();
    }
}
}
