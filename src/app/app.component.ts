import { Component } from '@angular/core';
import { Post } from './posts/model/post.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'MeanCourse';
  storedPosts : Post[ ] = [];
  onPostCreated(post){
    this.storedPosts.push(post);
  }
}
