
import { Component, OnInit, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

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
  private router = inject(Router);

  pelicula = signal<Pelicula | null>(null);
  error = signal('');
  cargando = signal(true);
  eliminando = signal(false);
  imagenError = signal(false);

  // Consultar la película seleccionada
  ngOnInit() {

    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.error.set('No se encontró el identificador de la película.');
      this.cargando.set(false);
      return;
    }

    this.http.get<Pelicula>(
      `http://127.0.0.1:8000/api/movies/${id}`
    ).subscribe({
      next: (datos) => {
        this.pelicula.set(datos);
        this.imagenError.set(false);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar la información de la película.');
        this.cargando.set(false);
      }
    });

  }

  // Obtener la portada de la película
  obtenerPortada(pelicula: Pelicula): string {

    const cover = (pelicula.cover || '').trim();

    // Dirección URL de una imagen
    if (/^https?:\/\//i.test(cover)) {
      return cover;
    }

    // Ruta local completa
    if (cover.startsWith('/')) {
      return cover;
    }

    // Portadas originales registradas en MySQL
    const portadasOriginales: Record<number, string> = {
      1: 'horizonte.jpg',
      2: 'estacion.jpg',
      3: 'codigo.jpg',
      4: 'invierno.jpg',
      5: 'ciudad.jpg',
      6: 'camino.jpg',
      7: 'tiempo.jpg',
      8: 'mar.jpg',
      9: 'memoria.jpg',
      10: 'senal.jpg',
      13: 'destino_digital_actualizado.jpg'
    };

    if (cover.toLowerCase() === portadasOriginales[pelicula.id]) {
      const numero = pelicula.id === 13 ? 11 : pelicula.id;
      return `/portadas/${numero}.png`;
    }

    // Nuevas portadas guardadas en el proyecto
    return cover ? `/portadas/${cover}` : '';
  }

  // Eliminar una película con confirmación
  eliminar(pelicula: Pelicula) {

    if (this.eliminando()) return;

    const confirmar = window.confirm(
      `¿Estás segura de eliminar la película "${pelicula.title}"?`
    );

    if (!confirmar) return;

    this.eliminando.set(true);
    this.error.set('');

    this.http.delete(
      `http://127.0.0.1:8000/api/movies/${pelicula.id}`
    ).subscribe({
      next: () => {
        this.router.navigate(['/movies']);
      },
      error: () => {
        this.error.set('No se pudo eliminar la película.');
        this.eliminando.set(false);
      }
    });

  }

}

