import { Component, OnInit } from '@angular/core';
import {FirebaseService} from "../../services/firebase.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  constructor(private fbService: FirebaseService, private router: Router) { }

  ngOnInit(): void {
  }

  getStarted() {
    if (this.fbService.getUid()) {
      this.router.navigateByUrl('/main');
    } else {
      this.router.navigateByUrl('/login');
    }
  }
}
