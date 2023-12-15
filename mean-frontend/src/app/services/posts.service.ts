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
  private postsUpdated = new Subject<{ posts: Post[]; postCount: number }>();
  private postsUrl = 'http://localhost:3000/api/posts';

  constructor(private http: HttpClient, public router: Router) {}

  getPosts(postsPerPage: number, currPage: number) {
    const queryParams = `?pageSize=${postsPerPage}&currPage=${currPage}`;
    this.http
      .get<{ message: String; posts: any[]; maxPosts: number }>(
        `${this.postsUrl}${queryParams}`
      )
      .pipe(
        map((postData) => {
          return {
            posts: postData.posts.map((post) => {
              return {
                title: post.title,
                content: post.content,
                id: post._id,
                imagePath: post.imagePath,
              };
            }),
            maxPosts: postData.maxPosts,
          };
        })
      )
      .subscribe((transformedPostsData) => {
        this.posts = transformedPostsData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostsData.maxPosts,
        });
      });
  }

  getPostsUpdatedListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);
    this.http
      .post<{ message: string; post: Post }>(this.postsUrl, postData)
      .subscribe((resData) => {
        // const post: Post = {
        //   id: resData.post.id,
        //   title: title,
        //   content: content,
        //   imagePath: resData.post.imagePath,
        // };
        // console.log(resData.message);
        // post.id = resData.post.id;
        // this.posts.push(post);
        // this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }

  getPost(id: string) {
    return this.http.get<{
      _id: string;
      title: string;
      content: string;
      imagePath: string;
    }>(`${this.postsUrl}/${id}`);
  }

  deletePost(postId: string) {
    return this.http.delete(`${this.postsUrl}/${postId}`);
  }

  updatePost(
    postId: string,
    title: string,
    content: string,
    image: File | string
  ) {
    let postData: Post | FormData;
    if (typeof image === 'object') {
      const postData = new FormData();
      postData.append('id', postId);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
      postData = {
        id: postId,
        title: title,
        content: content,
        imagePath: image,
      };
    }
    this.http
      .put(`${this.postsUrl}/${postId}`, postData)
      .subscribe((response) => {
        // const updatedPosts = [...this.posts];
        // const oldPostIndex = updatedPosts.findIndex((p) => p.id === postId);
        // const post: Post = {
        //   id: postId,
        //   title: title,
        //   content: content,
        //   imagePath: '',
        // };
        // updatedPosts[oldPostIndex] = post;
        // this.posts = updatedPosts;
        // this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }
}
