
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

  // Obtener la portada de cada película
  obtenerPortada(pelicula: Pelicula): string {

    const cover = (pelicula.cover || '').trim();

    // Si es una URL, utilizarla directamente
    if (/^https?:\/\//i.test(cover)) {
      return cover;
    }

    // Si es una ruta local, conservarla
    if (cover.startsWith('/')) {
      return cover;
    }

    // Nombres originales registrados en MySQL
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

    // Mantener nuestras 11 portadas originales
    if (cover.toLowerCase() === portadasOriginales[pelicula.id]) {
      const numero = pelicula.id === 13 ? 11 : pelicula.id;
      return `/portadas/${numero}.png`;
    }

    // Utilizar el archivo indicado en el formulario
    return cover ? `/portadas/${cover}` : '';
  }

  // Eliminar una película del catálogo
  eliminar(id: number, titulo: string) {

    // Pedir confirmación antes de eliminar
    const confirmar = confirm(
      `¿Estás segura de eliminar la película "${titulo}"?`
    );

    if (!confirmar) {
      return;
    }

    // Llamada al servicio DELETE de Laravel
    this.moviesService.destroy(id).subscribe({
      next: () => {

        // Actualizar la lista después de eliminar
        this.peliculas.update(lista =>
          lista.filter(pelicula => pelicula.id !== id)
        );

      },
      error: () => {
        this.error.set(
          'No se pudo eliminar la película.'
        );
      }
    });

  }

}



