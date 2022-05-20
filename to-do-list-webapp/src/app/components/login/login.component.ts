import {Component, OnInit} from '@angular/core';
import {FirebaseService} from "../../services/firebase.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email: string = "";
  password1: string = "";
  emailValid: boolean = false;
  password1Valid: boolean = false;
  authSuccess: boolean = true;

  constructor(private fbService: FirebaseService, private router: Router) {
  }

  ngOnInit(): void {
  }

  submit(): void {
    if (this.emailValid && this.password1Valid) {
      this.fbService.signInWithEmailAndPassword(this.email, this.password1).subscribe(
        value => this.authSuccess = value
      );
      this.router.navigateByUrl('/main');
    }
  }

  validateEmail(): void {
    const regex = /(?:[a-z\d!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z\d!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z\d](?:[a-z\d-]*[a-z\d])?\.)+[a-z\d](?:[a-z\d-]*[a-z\d])?|\[(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?|[a-z\d-]*[a-z\d]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)])/;
    this.emailValid = regex.test(this.email);
  }

  validatePassword1(): void {
    this.password1Valid = this.password1.length >= 8;
  }

}
