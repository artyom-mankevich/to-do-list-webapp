import { Component, OnInit } from '@angular/core';
import {FirebaseService} from "../../services/firebase.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  authenticated: boolean | null = false;

  constructor(private fbService: FirebaseService) { }

  ngOnInit(): void {
    this.fbService.authenticated.subscribe(value => {
      this.authenticated = value;
    });
  }

  logout() {
    this.fbService.signOut();
  }
}
