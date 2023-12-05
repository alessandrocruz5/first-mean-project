import { Injectable } from '@angular/core';
import { Post } from '../models/post/post.model';
import { HttpClient } from '@angular/common/http';
import { Subject, map } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();
  private postsUrl = 'http://localhost:3000/api/posts';

  constructor(private http: HttpClient, public router: Router) {}

  getPosts() {
    this.http
      .get<{ message: String; posts: any[] }>(this.postsUrl)
      .pipe(
        map((postData) => {
          return postData.posts.map((post) => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
            };
          });
        })
      )
      .subscribe((transformedPosts) => {
        this.posts = transformedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPostsUpdatedListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string) {
    const post: Post = { id: 'null', title: title, content: content };
    this.http
      .post<{ message: string; postId: string }>(this.postsUrl, post)
      .subscribe((resData) => {
        console.log(resData.message);
        post.id = resData.postId;
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }

  getPost(id: string) {
    return this.http.get<{ _id: string; title: string; content: string }>(
      `${this.postsUrl}/${id}`
    );
  }

  deletePost(postId: string) {
    this.http.delete(`${this.postsUrl}/${postId}`).subscribe(() => {
      const updatedPosts = this.posts.filter((post) => post.id !== postId);
      this.posts = updatedPosts;
      this.postsUpdated.next([...this.posts]);
    });
  }

  updatePost(postId: string, title: string, content: string) {
    const post: Post = { id: postId, title: title, content: content };
    this.http.put(`${this.postsUrl}/${postId}`, post).subscribe((response) => {
      const updatedPosts = [...this.posts];
      const oldPostIndex = updatedPosts.findIndex((p) => p.id === postId);
      updatedPosts[oldPostIndex] = post;
      this.posts = updatedPosts;
      this.postsUpdated.next([...this.posts]);
      this.router.navigate(['/']);
    });
  }
}
