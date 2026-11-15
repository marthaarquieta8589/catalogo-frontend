import { Routes } from '@angular/router';

import { Home } from './home/home';
import { Movies } from './movies/movies';
import { Movie } from './movie/movie';
import { Agregar } from './agregar/agregar';
import { Editar } from './editar/editar';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'movies', component: Movies },
  { path: 'movie/:id', component: Movie },
  { path: 'agregar', component: Agregar },
  { path: 'editar/:id', component: Editar },
  { path: '**', redirectTo: '' }
];
