import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/models/user.class';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  form: FormGroup;
  constructor(private fb: FormBuilder, private spinner: NgxSpinnerService, private toastr: ToastrService,
              private userservice: UserService, private router : Router ) { }

  ngOnInit() {
    this.createForm();
  }


  createForm() {
    this.form = this.fb.group({
      'nombre': ['', Validators.required],
      'usuario': ['', Validators.required],
      passwords: this.fb.group({
        password: ['', [Validators.required]],
        confirm_password: ['', [Validators.required]],
      }, {validator: this.passwordConfirming}),
      'perfil': ['', Validators.required]      
    });
  }


  passwordConfirming(c: AbstractControl): { invalid: boolean } {
    if (c.get('password').value !== c.get('confirm_password').value) {
        return {invalid: true};
    }
  }

  registro() {
    if (this.form.valid) {
      let user = new User();
      user.name = this.form.controls.nombre.value;
      user.username = this.form.controls.usuario.value;
      user.pass = this.form.get('passwords').get('password').value;
      user.profile = this.form.controls.perfil.value;
      this.spinner.show();
      this.userservice.getUser(user.username).subscribe(
        (data: []) => {
          if (data.length == 0) {
            this.insertarUsuario(user);
          } else {
            this.toastr.warning('Este usuario ya existe', 'Aviso');
          }
          this.spinner.hide();
        },
        error => {
          console.log(error);
        });
    } else {
      this.toastr.warning('Formulario Incompleto' , 'Aviso!');
    }
  }

  insertarUsuario(user: User) {
    this.spinner.show();
    this.userservice.insertUser(user).subscribe(
      (data: []) => {
        if(data!= null) {
          this.toastr.success('Usuario Creado', 'Aviso');
          this.router.navigate(['/login']);
        }
        this.spinner.hide();
      },
      error => {
        console.log(error);
      });
  }


}
