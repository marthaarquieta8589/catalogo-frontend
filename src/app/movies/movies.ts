
import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MoviesService, Pelicula } from '../services/movies';

@Component({
  selector: 'app-movies',
  imports: [RouterLink],
  templateUrl: './movies.html',
  styleUrl: './movies.css'
})
export class Movies implements OnInit {

  // Conexión con el servicio de películas
  private moviesService = inject(MoviesService);

  // Datos que se mostrarán en el catálogo
  peliculas = signal<Pelicula[]>([]);
  error = signal('');

  ngOnInit() {

    // Llamada al servicio index de Laravel
    this.moviesService.index().subscribe({
      next: (datos) => {
        this.peliculas.set(datos);
      },

      error: () => {
        this.error.set('No se pudieron cargar las películas.');
      }
    });

  }
}



