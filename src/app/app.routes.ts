import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Movies } from './movies/movies';
import { Movie } from './movie/movie';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'movies', component: Movies },
  { path: 'movie/:id', component: Movie },
  { path: '**', redirectTo: '' }
];
