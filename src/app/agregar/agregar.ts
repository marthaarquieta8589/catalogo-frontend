import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MoviesService, Pelicula } from '../services/movies';

@Component({
  selector: 'app-agregar',
  imports: [FormsModule, RouterLink],
  templateUrl: './agregar.html',
  styleUrl: './agregar.css'
})
export class Agregar {

  private moviesService = inject(MoviesService);
  private router = inject(Router);

  // Datos de la película que vamos a registrar
  pelicula: Omit<Pelicula, 'id'> = {
    title: '',
    synopsis: '',
    year: new Date().getFullYear(),
    cover: ''
  };

  guardando = false;
  mensajeError = '';

  // Enviar la nueva película a Laravel
  guardar() {
    if (this.guardando) return;

    this.guardando = true;
    this.mensajeError = '';

    this.moviesService.store(this.pelicula).subscribe({
      next: () => {
        this.guardando = false;
        this.router.navigate(['/movies']);
      },
      error: () => {
        this.guardando = false;
        this.mensajeError =
          'No se pudo guardar la película. Revisa la conexión con Laravel.';
      }
    });
  }
}

