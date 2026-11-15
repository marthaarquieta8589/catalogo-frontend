
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

  // Registrar una nueva película
  store(pelicula: Omit<Pelicula, 'id'>): Observable<unknown> {
    return this.http.post(this.apiUrl, pelicula);
  }

  // Actualizar una película existente
  update(id: number, pelicula: Omit<Pelicula, 'id'>): Observable<unknown> {
    return this.http.put(`${this.apiUrl}/${id}`, pelicula);
  }

  // Eliminar una película
  destroy(id: number): Observable<unknown> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Consultar una película por su ID
  show(id: number): Observable<Pelicula> {
    return this.http.get<Pelicula>(`${this.apiUrl}/${id}`);
  }

}

