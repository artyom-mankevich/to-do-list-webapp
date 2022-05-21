import {Component, OnInit} from '@angular/core';
import {FirebaseService} from "../../services/firebase.service";
import {Reminder} from "../../common/entities";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  authenticated: boolean | null = false;
  notifications: Reminder[] = [];
  curDate: number = Date.now();
  showNotifications: boolean = false;
  mobileMenuShown: boolean = false;
  tags: string[] = [];
  activeTag: string = '';

  constructor(private fbService: FirebaseService) {
  }

  ngOnInit(): void {
    this.fbService.authenticated.subscribe(value => {
      this.authenticated = value;
    });
    this.fbService.getLastTwoReminders().then(value => {
      value.subscribe(reminders => {
        this.notifications = reminders;
      });
    });
    this.fbService.getTags().then(value => {
      value.subscribe(tags => {
        this.tags = tags;
      });
    });
  }

  logout() {
    this.fbService.signOut();
  }
}
