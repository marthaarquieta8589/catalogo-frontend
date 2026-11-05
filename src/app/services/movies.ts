
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Estructura de los datos de cada película
export interface Pelicula {
  id: number;
  title: string;
  synopsis: string;
  year: number;
  cover: string;
}

@Injectable({
  providedIn: 'root'
})
export class MoviesService {

  private http = inject(HttpClient);

  private apiUrl = 'http://127.0.0.1:8000/api/movies';

  // Servicio index: obtener todas las películas
  index(): Observable<Pelicula[]> {
    return this.http.get<Pelicula[]>(this.apiUrl);
  }

}
