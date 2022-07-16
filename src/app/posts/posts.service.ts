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

  public eventOmitter:Subject<{posts : Post[], maxPosts :number}>=new Subject< {posts : Post[], maxPosts :number}>() ;
  private posts:Post[] = [];
  constructor(private http :HttpClient , private router :Router){

  }
  getPosts(postsPerPage :number , currentPage:number){
    const queryParams =`?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http.get<{message:String,posts:any,maxPosts:number}>('http://localhost:3000/api/posts'+queryParams).pipe(map((resBody)=>{
      return {posts :resBody.posts.map( (eachPost) => {
        return {

          Id: eachPost._id,
          Content:eachPost.Content,
          Title:eachPost.Title,
          ImagePath :eachPost.ImagePath,
          Creator : eachPost.Creator
        }
      })

    , maximumPosts :resBody.maxPosts
    }

    })).
    subscribe((transformedPostsData)=>{
      this.posts=transformedPostsData.posts;
      this.eventOmitter.next({posts : [...this.posts],maxPosts:transformedPostsData.maximumPosts})
    });

  }
  getPostUpdateListener(){
    return this.eventOmitter.asObservable();
  }
  addPosts(post:Post , image : File){
    const postData = new FormData () ;
    postData.append("Title", post.Title as string );
    postData.append("Content", post.Content as string );
    postData.append ("image", image , post.Title as string )
    this.http.post<{message:String ,post:Post}>('http://localhost:3000/api/posts',postData).subscribe((responseData)=>{

      // post.Id = responseData.post.Id;
      // post.ImagePath = responseData.post.ImagePath ;
      // this.posts.push(post);
      // this.eventOmitter.next([...this.posts])
      this.router.navigate(["/"]);
    });

  }
  deletePost (postId :String) {
    return this.http.delete('http://localhost:3000/api/posts/'+postId);
  }
  getPost (postId :String){
    return this.http.get<Post>('http://localhost:3000/api/posts/'+postId);
  }
  updatePost (id : String ,  title :String , content :String , image : string |File){

    var  postData :Post | FormData;
    if (typeof (image)=== "string" ){
        postData  = new Post (

        title ,
        content,
        id ,
        image ,
        )

    }else if (typeof (image) == "object") {
      postData = new FormData() ;
      postData.append("Id" ,id as string);
      postData.append("Title", title as string );
      postData.append("Content", content as string );
      postData.append ("image", image , title as string )
    }

    this.http.put<{post:Post}>('http://localhost:3000/api/posts/'+id,postData).subscribe((responseData)=>{

      // const updatedPosts = [ ...this.posts];
      // var post =new Post (

      //   title ,
      //   content,
      //   id ,
      //   "",
      //   )
      // const oldPostIndex  = updatedPosts.findIndex( (epost)=>epost.Id==post.Id );
      // updatedPosts[oldPostIndex]= post ;
      // this.posts = updatedPosts ;
      // this.eventOmitter.next([...this.posts]);
      this.router.navigate(["/"]);
    });
  }


}
