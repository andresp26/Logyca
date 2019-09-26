import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { User } from '../models/user.class';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};
@Injectable({
  providedIn: 'root'
})
export class UserService {

  public pathapi = 'http://localhost:3000/users';
  constructor(private http: HttpClient) { }


  public getUser(user: string) {
    return this.http.get(this.pathapi + `?username=${user}`,
      { headers: httpOptions.headers });
  }

  public validateUser(user: string, pass: string) {
    return this.http.get(this.pathapi + `?username=${user}&pass=${pass}`,
      { headers: httpOptions.headers });
  }

  public insertUser(user: User) {
    return this.http.post(this.pathapi, user,
      { headers: httpOptions.headers });
  }

  

}
