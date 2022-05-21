import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Reminder } from 'src/app/common/entities';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-reminders-container',
  templateUrl: './reminders-container.component.html',
  styleUrls: ['./reminders-container.component.css']
})
export class RemindersContainerComponent implements OnInit {

  Date = Date;

  @Input()
  formShown: boolean = false; 

  @Output() editReminderEmitter = new EventEmitter<any>();
  editedReminder: Reminder =  new Reminder('','', 0, Date.now());

  @Input()
  reminders: Reminder[] = [];

  constructor(private fbService: FirebaseService) { }
 

  ngOnInit(): void {
  }

  editReminder(event: any, key: string | null){ 
    const classList = event.target.classList;
    this.formShown = true;
    this.editedReminder = this.reminders.find(reminder => reminder.key === key)!;
    this.editReminderEmitter.emit(this.editedReminder);
  }
  removeReminder(key: string | null) {
    if (key == null) return;
    this.fbService.removeReminder(key);
  }
 
}
