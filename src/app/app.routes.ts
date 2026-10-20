import { Routes } from '@angular/router';
import { Movies } from './movies/movies';
import { Movie } from './movie/movie';

export const routes: Routes = [
  { path: '', component: Movies },
  { path: 'movie/:id', component: Movie },
  { path: '**', redirectTo: '' }
];
