import { Component, OnInit } from '@angular/core';
import { ReserveService } from 'src/app/services/reserve.service';
import { Reserve } from 'src/app/models/reserve.class';
import { MoviesService } from 'src/app/services/movies.service';
import { Movie } from 'src/app/models/movie.class';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reservas',
  templateUrl: './reservas.component.html',
  styleUrls: ['./reservas.component.css']
})
export class ReservasComponent implements OnInit {

  reservas : Reserve[] = [];
  movies: Movie[] = [];
  constructor(private reservaservice: ReserveService, private movieservice: MoviesService,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.loadReserves();
  }

  loadReserves() {
    this.reservaservice.getReserveUser(parseInt(sessionStorage.getItem('Id'))).subscribe(
      (data: []) => {        
        this.reservas = data;
        this.movies = [];
        this.reservas.forEach(element => {
          this.loadMovies(element.peliculaid);
        });
      },
      error => {
        console.log(error);
      });
  }

  loadMovies(idmovie: number) {
    this.movieservice.getMovie(idmovie).subscribe(
      (data: Movie) => {        
        
        this.movies.push(data);
      },
      error => {
        console.log(error);
      });
  }

  removeReserve(id:number) {
    let reserva = this.reservas.find(x=> x.peliculaid);
    this.reservaservice.removReserve(reserva.id).subscribe(
      (data: []) => {        
        this.loadReserves();
        this.toastr.success('Reserva eliminada', 'Aviso');
      },
      error => {
        console.log(error);
      });
  }
}
