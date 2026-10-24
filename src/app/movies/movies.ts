
import { Component, OnInit, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';


interface Pelicula {
  id: number;
  title: string;
  synopsis: string;
  year: number;
  cover: string;
}

@Component({
  selector: 'app-movies',
  imports: [RouterLink],
  templateUrl: './movies.html',
  styleUrl: './movies.css'
})
export class Movies implements OnInit {

  private http = inject(HttpClient);

  peliculas = signal<Pelicula[]>([]);
  error = signal('');

  ngOnInit() {
    this.http.get<Pelicula[]>('http://127.0.0.1:8000/api/movies')
      .subscribe({
        next: (datos) => {
          this.peliculas.set(datos);
        },
        error: () => {
          this.error.set('No se pudieron cargar las películas.');
        }
      });
  }
}


