import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Note} from 'src/app/common/entities';
import {FirebaseService} from 'src/app/services/firebase.service';

@Component({
  selector: 'app-notes-container',
  templateUrl: './notes-container.component.html',
  styleUrls: ['./notes-container.component.css']
})
export class NotesContainerComponent implements OnInit {

  @Input()
  notes: Note[] = [];

  constructor(private fbService: FirebaseService) {
  }

  @Input()
  formShown: boolean = false;


  @Output() editNoteEmitter = new EventEmitter<any>();
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

  ngOnInit(): void {
  }

  removeNote(key: string | null) {
    if (key == null) return;
    this.fbService.removeNote(key);
  }

  editNote(event: any, key: string | null) {
    const classList = event.target.classList;
    if (this.formShown
      || key == null
      || classList.contains('note__remove-button')
      || classList.contains('note__pin-icon')) {
      return;
    }
    this.formShown = true;
    this.editedNote = this.notes.find(note => note.key === key)!;
    this.editNoteEmitter.emit(this.editedNote);
  }

  updateNotePin(noteKey: string | null, pinned: boolean) {
    if (noteKey != null) {
      this.fbService.updateNotePinned(noteKey, pinned);
      this.sortNotes();
    }
  }

  sortNotes(): void {
    this.notes.sort((a: Note, b: Note) => {
      const aPinned = a.pinned ? 1 : 0;
      const bPinned = b.pinned ? 1 : 0;
      return bPinned - aPinned;
    });
  }

}
