import { Component, Input } from "@angular/core";
import { PostsService } from "../posts.service";

@Component({
  selector: "app-post",
  templateUrl : "./post.component.html",
  styleUrls :["./post.component.css"]
})
export class PostComponent {
  panelOpenState = false;
  @Input("Title") title:String ;
  @Input("Content")  content:String ;
  @Input ("Id") id :String ;

  constructor ( private postsService : PostsService){

  }
  onDelete (id :String){
    this.postsService.deletePost(id);
  }
}
