import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Reserve } from '../models/reserve.class';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};
@Injectable({
  providedIn: 'root'
})
export class ReserveService {

  public pathapi = 'http://localhost:3000/reservas';
  constructor(private http: HttpClient) { }

  public reserveMovie(reserva: Reserve) {
    return this.http.post(this.pathapi, reserva,
      { headers: httpOptions.headers });
  }

  public getReserveUser(user: number) {
    return this.http.get(this.pathapi + `?userid=${user}`,
      { headers: httpOptions.headers });
  }

  public removReserve(idreserve:number) {
    return this.http.delete(this.pathapi + `/${idreserve}`,
      { headers: httpOptions.headers });
  }
}
