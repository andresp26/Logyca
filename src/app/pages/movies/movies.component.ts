import { Component, OnInit } from '@angular/core';
import { Movie } from 'src/app/models/movie.class';
import { MoviesService } from 'src/app/services/movies.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ReserveService } from 'src/app/services/reserve.service';
import { Reserve } from 'src/app/models/reserve.class';
import { Router } from '@angular/router';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.css']
})
export class MoviesComponent implements OnInit {

  movies: Movie[] = [];
  form: FormGroup;
  movie = new Movie();
  edit = false;
  profile = '';
  filtermovies: Movie[] = [];
  _listFilter = '';
  peli = new Movie();
  get listFilter(): string {
    return this._listFilter;
  }
  set listFilter(value: string) {
    this._listFilter = value;
    this.filtermovies = this.listFilter ? this.doFilter(this.listFilter) : this.movies;
  }
  constructor(private movieservice: MoviesService, private fb: FormBuilder,
    private spinner: NgxSpinnerService, private toastr: ToastrService,
    private reservaservice: ReserveService, private router : Router,) {
      this.filtermovies = this.movies;
      this.listFilter = '';
     }

  ngOnInit() {
    this.loadMovies();
    this.createForm();
    this.profile = sessionStorage.getItem('Perfil');
  }

  doFilter(filterBy: string): Movie[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.movies.filter((mov: Movie) =>
        mov.titulo.toLocaleLowerCase().indexOf(filterBy) !== -1 ||
        mov.descripcion.toLocaleLowerCase().indexOf(filterBy) !== -1 || 
        mov.actores.toLocaleLowerCase().indexOf(filterBy) !== -1 ||  
        mov.director.toLocaleLowerCase().indexOf(filterBy) !== -1 ||
        mov.cantidad.toString().indexOf(filterBy) !== -1 || 
        mov.costo_alquiler.toString().indexOf(filterBy) !== -1);
    }

  createForm() {
    this.form = this.fb.group({
      'titulo': ['', Validators.required],
      'descripcion': ['', Validators.required],
      'actores': ['', Validators.required],
      'director': ['', Validators.required],
      'costo': ['', Validators.required],
      'cantidad': ['', Validators.required]
    });
  }

  loadMovies() {
    this.spinner.show();
    this.movieservice.getMovies().subscribe(
      (data: []) => {
        this.movies = data;
        this.filtermovies = data;
        this.spinner.hide();
      },
      error => {
        console.log(error);
      });
  }


  insert() {
    if (this.form.valid) {
      this.movie.titulo = this.form.controls.titulo.value;
      this.movie.descripcion = this.form.controls.descripcion.value;
      this.movie.actores = this.form.controls.actores.value;
      this.movie.director = this.form.controls.director.value;
      this.movie.costo_alquiler = this.form.controls.costo.value;
      this.movie.cantidad = this.form.controls.cantidad.value;
      this.spinner.show();
      this.movieservice.insertMovie(this.movie).subscribe(
        (data: []) => {
          if (data != null) {
            this.loadMovies();
            this.spinner.hide();
            this.toastr.success('Operacion Exitosa', 'Aviso');
          } else {
            this.toastr.warning('Operacion Fallida', 'Aviso');
          }
        },
        error => {
          console.log(error);
        });
      this.toastr.success('Operacion Exitosa', 'Aviso');
    } else {
      this.toastr.warning('Formulario Incompleto', 'Aviso!');
    }
  }


  getmovie(id: number) {
    return this.movies.find(x => x.id == id);
  }

  updateform(id: number) {
    this.edit = true;
    this.peli = this.getmovie(id);
    this.form.controls.titulo.setValue(this.peli.titulo);
    this.form.controls.descripcion.setValue(this.peli.descripcion);
    this.form.controls.director.setValue(this.peli.director);
    this.form.controls.cantidad.setValue(this.peli.cantidad);
    this.form.controls.costo.setValue(this.peli.costo_alquiler);
    this.form.controls.actores.setValue(this.peli.actores);
  }

  update() {    
    this.peli.titulo = this.form.controls.titulo.value;
    this.peli.descripcion = this.form.controls.descripcion.value;
    this.peli.director = this.form.controls.director.value;
    this.peli.cantidad = this.form.controls.cantidad.value;
    this.peli.costo_alquiler = this.form.controls.costo.value;
    this.peli.actores = this.form.controls.actores.value;
    this.spinner.show();
    this.movieservice.updateMovie(this.peli).subscribe(
      (data: []) => {
        if (data != null) {
          this.loadMovies();
          this.toastr.success('Se actualizo la pelicula', 'Aviso');
          this.edit = false;
          this.form.reset();
          this.spinner.hide();
        } else {
          this.toastr.warning('Operacion Fallida', 'Aviso');
        }
      },
      error => {
        console.log(error);
      });
  }

  delete(id: number) {
    this.spinner.show();
    this.movieservice.deleteMovie(id).subscribe(
      (data: []) => {
         this.loadMovies();
         this.toastr.success('Se elimino la pelicula', 'Aviso');
         this.spinner.hide();
      },
      error => {
        console.log(error);
      });
  }

  reserveMovie(movie: number) {
    let reserva = new Reserve();
    reserva.userid = parseInt(sessionStorage.getItem('Id'));
    reserva.peliculaid = movie;
    this.spinner.show();
    this.reservaservice.reserveMovie(reserva).subscribe(
      (data: []) => {        
        this.spinner.hide(); 
        this.toastr.success('Se genero la reserva', 'Aviso');
        this.router.navigate(['/reservas']); 
      },
      error => {
        console.log(error);
      });
  }

}
