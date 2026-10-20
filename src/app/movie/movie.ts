
import { Component, OnInit, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, RouterLink } from '@angular/router';

interface Pelicula {
  id: number;
  title: string;
  synopsis: string;
  year: number;
  cover: string;
}

@Component({
  selector: 'app-movie',
  imports: [RouterLink],
  templateUrl: './movie.html',
  styleUrl: './movie.css'
})
export class Movie implements OnInit {

  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);

  pelicula = signal<Pelicula | null>(null);
  error = signal('');
  cargando = signal(true);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.error.set('No se encontró el identificador de la película.');
      this.cargando.set(false);
      return;
    }

    this.http.get<Pelicula>(`http://127.0.0.1:8000/api/movies/${id}`)
      .subscribe({
        next: (datos) => {
          this.pelicula.set(datos);
          this.cargando.set(false);
        },
        error: () => {
          this.error.set('No se pudo cargar la información de la película.');
          this.cargando.set(false);
        }
      });
  }
}
