import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { map, Subject } from "rxjs";
import { Post } from "./model/post.model";

@Injectable({
  providedIn: 'root',
}

)
export class PostsService {

  public eventOmitter:Subject<Post[]>=new Subject<Post[]>() ;
  private posts:Post[] = [];
  constructor(private http :HttpClient , private router :Router){

  }
  getPosts(){
    this.http.get<{message:String,posts:any}>('http://localhost:3000/api/posts').pipe(map((resBody)=>{
      return resBody.posts.map( (eachPost) => {
        return {

          Id: eachPost._id,
          Content:eachPost.Content,
          Title:eachPost.Title

        }
      })

    })).
    subscribe((transformedPosts)=>{
      this.posts=transformedPosts;
      this.eventOmitter.next([...this.posts])
    });

  }
  getPostUpdateListener(){
    return this.eventOmitter.asObservable();
  }
  addPosts(post:Post){
    this.http.post<{message:String ,Id:String}>('http://localhost:3000/api/posts',post).subscribe((responseData)=>{

      post.Id = responseData.Id;
      this.posts.push(post);
      this.eventOmitter.next([...this.posts])
      this.router.navigate(["/"]);
    });

  }
  deletePost (postId :String) {
   this.http.delete('http://localhost:3000/api/posts/'+postId).subscribe(()=>{


    const updatedPosts = this.posts.filter( post=> {
      return  post.Id !== postId ;
    });
    this.posts=updatedPosts;
    this.eventOmitter.next([...updatedPosts]);
    this.router.navigate(["/"]);
   } )
  }
  getPost (postId :String){
    return this.http.get<Post>('http://localhost:3000/api/posts/'+postId);
  }
  updatePost (id : String ,  title :String , content :String ){
    const post :Post = {
      Id : id ,
      Title :title ,
      Content :content
    }
    this.http.put('http://localhost:3000/api/posts/'+id,post).subscribe((responseData)=>{

      const updatedPosts = [ ...this.posts];
      const oldPostIndex  = updatedPosts.findIndex( (epost)=>epost.Id==post.Id );
      updatedPosts[oldPostIndex]= post ;
      this.posts = updatedPosts ;
      this.eventOmitter.next([...this.posts]);
      this.router.navigate(["/"]);
    });
  }


}
