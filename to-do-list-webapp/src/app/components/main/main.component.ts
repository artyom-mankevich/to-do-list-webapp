import {Component, ElementRef, EventEmitter, OnInit, Output, Renderer2, ViewChild} from '@angular/core';
import {Note, Reminder} from "../../common/entities";
import {FirebaseService} from "../../services/firebase.service";
import {Router} from "@angular/router";
import {NoteFormComponent} from "../note-form/note-form.component";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit {
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

  @ViewChild(NoteFormComponent) noteFormComponent!: NoteFormComponent;
  @ViewChild('notesContainer') notesContainer: ElementRef | undefined;

  constructor(
    private fbService: FirebaseService,
    private router: Router,
    private renderer: Renderer2
  ) {
  }

  ngOnInit(): void {
    if (!this.fbService.getUid()) {
      this.router.navigateByUrl('/login');
    }

    this.fbService.tagOnChildAdded(this.addToTags.bind(this));
    this.fbService.tagOnChildRemoved(this.removeFromTags.bind(this));

    this.fbService.noteOnChildAdded(this.addToNotes.bind(this));
    this.fbService.noteOnChildRemoved(this.removeFromNotes.bind(this));
    this.fbService.noteOnChildChanged(this.changeNote.bind(this));
  }

  ngAfterViewInit(): void {
    this.renderer.listen('document', 'click', (event) => {
      this.outsideNoteFormClick(event);
    });
  }

  private outsideNoteFormClick(event: any) {
    const noteAddButton = document.querySelector('.main-panel__add-button');
    const noteForm = document.querySelector('.note-form');
    const notes = Array.from<Node>(this.notesContainer?.nativeElement.querySelectorAll('.note'));
    if (this.formShown
      && !noteForm?.contains(event.target)
      && !noteAddButton?.contains(event.target)
      && !notes.some(note => note.contains(event.target))
    ) {
      const currentEditedNote = this.noteFormComponent.editedNote;
      this.formShown = false;

      if (currentEditedNote.title === ''
        && (currentEditedNote.content === '' || currentEditedNote.listItems.length === 0)) {
        return;
      }
      if (!currentEditedNote.key) {
        this.fbService.addNote(currentEditedNote);
      } else {
        this.fbService.updateNote(currentEditedNote!);
      }
      this.editedNote = new Note(
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

  updateNotePin(noteKey: string | null, pinned: boolean) {
    if (noteKey != null) {
      this.fbService.updateNotePinned(noteKey, pinned);
      this.sortNotes();
    }
  }

  editNode(event: any, key: string | null) {
    const classList = event.target.classList;
    if (this.formShown
      || key == null
      || classList.contains('note__remove-button')
      || classList.contains('note__pin-icon')) {
      return;
    }
    this.formShown = true;
    this.editedNote = this.notes.find(note => note.key === key)!;
  }

  removeNote(key: string | null) {
    if (key == null) return;
    this.fbService.removeNote(key);
  }
}
