import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostListComponent } from './components/posts/post-list/post-list.component';
import { CreatePostComponent } from './components/posts/create-post/create-post.component';

const routes: Routes = [
  { path: '', component: PostListComponent },
  { path: 'create', component: CreatePostComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
