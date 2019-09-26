import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user.class';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username: string;
  pass: string;
  user = new User();
  constructor(private userservice: UserService, private router : Router,
    private toastr: ToastrService) { }

  ngOnInit() {
  }


  Validar () {
    debugger;
    if (this.validacampos(this.username) && this.validacampos(this.pass)) {
      this.userservice.validateUser(this.username, this.pass).subscribe(
        (data: any) => {
          if (data.length != 0) {
              this.user = data[0];
              sessionStorage.setItem('Perfil',this.user.profile);
              sessionStorage.setItem('Id', this.user.id.toString());
              this.router.navigate(['movies']);
              this.toastr.success(this.user.name , 'Bienvenido' );
          } else {
            this.toastr.warning('Contraseña incorrecta o usuario no existe' , 'Aviso!');
          }
        },
        error => {
          console.log(error);
        });
    } else {
      this.toastr.warning('Ingrese usuario y contraseña', 'Aviso');
    }
  }

  validacampos (campo): Boolean {
    if (campo != undefined && campo != '' && campo != null)
    return true;
    else return false;
  }

  registro() {
    this.router.navigate(['/registro']);
  }

}
