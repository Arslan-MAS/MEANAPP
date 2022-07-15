import { Component , EventEmitter , OnInit, Output} from "@angular/core";
import { FormControl, FormGroup, NgForm, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Post } from "../model/post.model";
import { PostsService } from "../posts.service";
import { mimeType } from "./mime-type.validator";
enum Mode {
  create,
  edit
}
@Component(
  { selector : "app-post-create",
    templateUrl : "./post-create.component.html",
    styleUrls : [ "./post-create.component.css"],
  }
)
export class PostCreateComponent implements OnInit{
  enteredContent = '';
  enteredTitle = '' ;
  private mode = Mode.create ;
  private postId :String;
  public post :Post ;
  public isLoading = false ;
  form : FormGroup ;
  imagePreview :String ;
  // @Output() postCreated:EventEmitter<Post> = new EventEmitter<Post> () ;

  constructor(public postService : PostsService, public route:ActivatedRoute){

  }
  ngOnInit(): void {
    this.form= new FormGroup({
      'title'  : new FormControl(null,{ validators :[Validators.required, Validators.minLength(3)]}),
      'content' : new FormControl(null , {validators:[Validators.required]}),
      'image' : new FormControl ( null, { validators : [ Validators.required] ,
         asyncValidators:[mimeType]}) ,

    });
    this.route.paramMap.subscribe((paramMap:ParamMap)=>{
      if (paramMap.has("id")){
          this.mode=Mode.edit;
          this.postId = paramMap.get("id");

          //loading spinner start
          this.isLoading = true ;
          this.postService.getPost(this.postId).subscribe((responsePost)=>
            {
              this.isLoading=false ;

              this.post=responsePost;
              this.form.setValue({
                "title":this.post.Title,
                "content": this.post.Content,
                "image" : this.post.ImagePath
              })
          }
          );
      }else {
          this.mode=Mode.create;
          this.postId = null;
          this.post= new Post("","","");
      }

    })
  }
  onSavePost( ){

    if (this.form.invalid)
      return ;
    this.isLoading= true;
    if (this.mode===Mode.create){

      const post:Post= new Post (this.form.value.title , this.form.value.content);
      this.postService.addPosts(post, this.form.value.image);
      this.form.reset();
    }else if (this.mode==Mode.edit){
      this.postService.updatePost(this.postId ,this.form.value.title,this.form.value.content,this.form.value.image );
    }

    //this.postCreated.emit(post);
  }
  onImagePicked(event : Event){
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({"image" : file });
    this.form.get("image").updateValueAndValidity();
    console.log(file);
    console.log (this.form);
    const reader = new FileReader () ;
    reader.onload = () => {
      this.imagePreview=reader.result as string;
    }
    reader.readAsDataURL(file);
  }
}
