import { Component, OnInit } from '@angular/core';
import {FirebaseService} from "../../services/firebase.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  email: string = "";
  password1: string = "";
  password2: string = "";
  emailValid: boolean = false;
  password1Valid: boolean = false;
  password2Valid: boolean = false;
  signupSuccessful: boolean = true;

  constructor(private fbService: FirebaseService, private router: Router) { }

  ngOnInit(): void {
  }

  submit(): void{
    if (this.password1Valid && this.password2Valid && this.emailValid) {
      this.fbService.createUserWithEmailAndPassword(this.email, this.password1).then(value => {
        this.signupSuccessful = value;
        if (this.signupSuccessful) {
          this.router.navigateByUrl('/main');
        }
      }).catch(reason => {
        this.signupSuccessful = false;
        console.log(reason);
      });
    }
  }

  validateEmail(): void {
    const regex = /(?:[a-z\d!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z\d!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z\d](?:[a-z\d-]*[a-z\d])?\.)+[a-z\d](?:[a-z\d-]*[a-z\d])?|\[(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?|[a-z\d-]*[a-z\d]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)])/;
    this.emailValid = regex.test(this.email);
  }

  validatePassword1(): void {
    this.password1Valid = this.password1.length >= 8;
  }

  passwordsMatch() {
    this.password2Valid = this.password1 === this.password2;
  }
}
