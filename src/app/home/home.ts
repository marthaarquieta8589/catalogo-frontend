import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  inject,
  signal
} from '@angular/core';

import { RouterLink } from '@angular/router';
import { MoviesService, Pelicula } from '../services/movies';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {

  // Servicio que conecta Angular con Laravel
  private moviesService = inject(MoviesService);

  // Películas que aparecerán en el carrusel
  peliculas = signal<Pelicula[]>([]);

  // Control de carga y mensajes
  cargando = signal(true);
  error = signal('');

  // Referencia al carrusel en el HTML
  @ViewChild('carrusel')
  carrusel?: ElementRef<HTMLDivElement>;

  ngOnInit() {

    // Consultar las películas registradas en MySQL
    this.moviesService.index().subscribe({

      next: (datos) => {
        this.peliculas.set(datos);
        this.cargando.set(false);
      },

      error: () => {
        this.error.set(
          'No se pudieron cargar las películas destacadas.'
        );
        this.cargando.set(false);
      }

    });
  }

  // Identificar la portada de cada película
  obtenerPortada(pelicula: Pelicula): string {

    const cover = (pelicula.cover || '').trim();

    // Imágenes mediante URL
    if (/^https?:\/\//i.test(cover)) {
      return cover;
    }

    // Rutas locales completas
    if (cover.startsWith('/')) {
      return cover;
    }

    // Nombres de las películas originales
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

    if (
      cover.toLowerCase() === portadasOriginales[pelicula.id]
    ) {
      const numero = pelicula.id === 13 ? 11 : pelicula.id;
      return `/portadas/${numero}.png`;
    }

    return cover ? `/portadas/${cover}` : '';
  }

  // Mover el carrusel hacia izquierda o derecha
  desplazarCarrusel(direccion: number) {

    const elemento = this.carrusel?.nativeElement;

    if (!elemento) return;

    elemento.scrollBy({
      left: direccion * elemento.clientWidth * 0.8,
      behavior: 'smooth'
    });
  }

}
