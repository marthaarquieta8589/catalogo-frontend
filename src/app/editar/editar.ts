import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MoviesService, Pelicula } from '../services/movies';

@Component({
  selector: 'app-editar',
  imports: [FormsModule, RouterLink],
  templateUrl: './editar.html',
  styleUrl: './editar.css'
})
export class Editar implements OnInit {

  private moviesService = inject(MoviesService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  id = 0;

  pelicula: Omit<Pelicula, 'id'> = {
    title: '',
    synopsis: '',
    year: new Date().getFullYear(),
    cover: ''
  };

 cargando = signal(true);
  guardando = false;
  mensajeError = '';

  ngOnInit() {

    // Obtener el ID desde la dirección
    this.id = Number(this.route.snapshot.paramMap.get('id'));

    if (!this.id) {
      this.mensajeError = 'El ID de la película no es válido.';
      this.cargando.set(false);
      return;
    }

    // Consultar los datos de la película
    this.moviesService.show(this.id).subscribe({
      next: (datos) => {
       
        this.pelicula = {
          title: datos.title,
          synopsis: datos.synopsis,
          year: datos.year,
          cover: datos.cover
        };

        this.cargando.set(false);
       
      },
      error: () => {
        this.mensajeError = 'No se pudo cargar la película.';
        this.cargando.set(false);
      }
    });
  }
  // Guardar los cambios en Laravel
  guardar() {

    if (this.guardando || this.cargando() || this.mensajeError) return;

    this.guardando = true;
    this.mensajeError = '';

    this.moviesService.update(this.id, this.pelicula).subscribe({
      next: () => {
        this.guardando = false;
        this.router.navigate(['/movies']);
      },
      error: () => {
        this.guardando = false;
        this.mensajeError = 'No se pudieron guardar los cambios.';
      }
    });

  }

}

