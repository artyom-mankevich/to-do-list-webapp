import {Component, OnInit} from '@angular/core';
import {Note, Reminder} from "../../common/entities";
import {FirebaseService} from "../../services/firebase.service";
import  {SidemenuOptions} from "../../enums/sidemenu";
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit {
  selectedSideMenuOption: SidemenuOptions = SidemenuOptions.Notes;
  SidemenuOptions = SidemenuOptions;
  notifications: Reminder[] = [];
  reminders: Reminder[] = [];
  tags: string[] = [];
  notes: Note[] = [];
  formShown: boolean = false;
  editedNote: Note = new Note(
    null,
    "",
    Date.now(),
    "note",
    "",
    false,
    "",
    "",
    []
  );
  editedReminder: Reminder = new Reminder('', '',  Date.now(),  Date.now());

  currentTag: string = '';

  constructor(
    private fbService: FirebaseService,
  ) {
  }

  ngOnInit(): void {
    this.fbService.tagOnChildAdded(this.addToTags.bind(this));
    this.fbService.tagOnChildRemoved(this.removeFromTags.bind(this));

    this.fbService.noteOnChildAdded(this.addToNotes.bind(this));
    this.fbService.noteOnChildRemoved(this.removeFromNotes.bind(this));
    this.fbService.noteOnChildChanged(this.changeNote.bind(this));

    this.fbService.onReminderAdded(this.addToReminders.bind(this));
    this.fbService.onReminderRemoved(this.removeFromReminders.bind(this));
    this.fbService.onReminderChanged(this.changeReminder.bind(this));

    this.fbService.getReminders().then(value => {
      value.subscribe(rem => this.reminders = rem);
    })
  }


  addToReminders(reminder: Reminder) : void {
    this.reminders.push(reminder)
    this.sortReminders();
  }

  removeFromReminders(reminder: Reminder) : void {
    this.reminders.forEach((item, index) => {
      if (item.key === reminder.key) {
        this.reminders.splice(index, 1);
      }
    });
    this.sortReminders();
  }

  changeReminder(reminder: Reminder) : void {
    this.reminders.forEach((item, index) => {
      if (item.key === reminder.key) {
        this.reminders[index] = reminder;
      }
    });
    this.sortReminders();
  }

  sortReminders(){
    this.reminders.sort((a: Reminder, b: Reminder) => {

      return a.eventTimestamp - b.eventTimestamp;
    });
  }



  addToTags(tag: string): void {
    this.tags.push(tag);
  }

  removeFromTags(tag: string): void {
    this.tags.splice(this.tags.indexOf(tag), 1);
  }

  addToNotes(note: Note): void {
    this.notes.push(note);
    this.sortNotes();
  }

  removeFromNotes(note: Note): void {
    this.notes.forEach((item, index) => {
      if (item.key === note.key) {
        this.notes.splice(index, 1);
      }
    });
    this.sortNotes();
  }

  changeNote(note: Note): void {
    this.notes.forEach((item, index) => {
      if (item.key === note.key) {
        this.notes[index] = note;
      }
    });
    this.sortNotes();
  }

  sortNotes(): void {
    this.notes.sort((a: Note, b: Note) => {
      const aPinned = a.pinned ? 1 : 0;
      const bPinned = b.pinned ? 1 : 0;
      return bPinned - aPinned;
    });
  }

  changeSideMenuOption(option: SidemenuOptions){
    this.selectedSideMenuOption = option;
  }

  removeNote(key: string | null) {
    if (key == null) return;
    this.fbService.removeNote(key);
  }

  clickTag($event: MouseEvent, tag: string) {
    if (this.currentTag === tag) {
      this.currentTag = '';
    } else {
      this.currentTag = tag;
    }
    this.filterNotesByTag();
  }

  private filterNotesByTag() {
    if (this.currentTag !== '') {
      this.notes = this.notes.filter(note => note.tag === this.currentTag);
    } else {
      this.fbService.getNotes().then(notes => {
        notes.subscribe(notes => {
          this.notes = notes;
          this.sortNotes();
        });
      })
    }
  }

  removeTag(tag: string) {
    this.fbService.removeTag(tag);
    if (this.currentTag === tag) {
      this.currentTag = '';
      this.filterNotesByTag();
    }
  }
  setCurrentNote(note: Note) {
    this.editedNote = note;
    this.formShown = true;

  }
  setCurrentReminder(reminder: Reminder) {
    this.editedReminder = reminder;
    this.formShown = true;

  }
  closeFormHandler(note: Note){
    if (note.title || note.content || note.listItems || note.image){
      if (!note.key) {
        this.fbService.addNote(note);
      } else {
        this.fbService.updateNote(note!);
      }
    }

    this.formShown = false;
    this.editedNote =  new Note(
      null,
      "",
      Date.now(),
      "note",
      "",
      false,
      "",
      "",
      []
    );
  }

  closeReminderFormHandler(reminder: Reminder) {
    if (reminder.content && reminder.timestamp) {
      if (!reminder.key){
        this.fbService.addReminder(reminder.content, reminder.eventTimestamp);
      }
      else {
        this.fbService.updateReminder(reminder);
      }
    }
    console.log(reminder)
    this.formShown = false;
    this.editedReminder = new Reminder('', '',  Date.now(), Date.now());

  }

}
