import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { Post } from './posts/model/post.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor (private authService :AuthService){

  }
  ngOnInit(): void {
    this.authService.autoAuthUser();
  }
  title = 'MeanCourse';
  storedPosts : Post[ ] = [];

  onPostCreated(post){
    this.storedPosts.push(post);
  }
}
