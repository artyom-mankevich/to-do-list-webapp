import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { Reminder } from 'src/app/common/entities';

@Component({
  selector: 'app-reminder-form',
  templateUrl: './reminder-form.component.html',
  styleUrls: ['./reminder-form.component.css']
})
export class ReminderFormComponent implements OnInit {
  @Input() editedReminder: Reminder = new Reminder('','', 0, Date.now());

  @Output() closeFormEmitter = new EventEmitter<Reminder>()
  constructor() { }

  date = '';
  ngOnInit(): void {
  }
  closeForm(){
    this.closeFormEmitter.emit(this.editedReminder);
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes["editedReminder"].currentValue) {
      this.editedReminder = changes["editedReminder"].currentValue;
      this.date =  new Date(this.editedReminder.eventTimestamp).toISOString().substring(0, 16);

    }
  }
  updateTimestamp(){
    this.editedReminder.eventTimestamp = new Date(this.date).getTime();
  }

}
