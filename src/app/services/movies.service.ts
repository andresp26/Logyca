import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Movie } from '../models/movie.class';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};
@Injectable({
  providedIn: 'root'
})
export class MoviesService {

  public pathapi = 'http://localhost:3000/peliculas';
  constructor(private http: HttpClient) { }


  public getMovie(id: number) {
    return this.http.get(this.pathapi + `/${id}`,
      { headers: httpOptions.headers });
  }

  public insertMovie(movie: Movie) {
    return this.http.post(this.pathapi,
    movie, { headers: httpOptions.headers });
  }

  public getMovies() {
    return this.http.get(this.pathapi , { headers: httpOptions.headers });
  }

  public updateMovie(movie: Movie) {

    return this.http.put(this.pathapi + `/${movie.id}`, movie,
      { headers: httpOptions.headers });
  }

  public deleteMovie(id: number) {
    return this.http.delete(this.pathapi + `/${id}`,
      { headers: httpOptions.headers });
  }

}
