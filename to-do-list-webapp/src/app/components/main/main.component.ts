import {Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
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

  @ViewChild(NoteFormComponent) noteFormComponent!: NoteFormComponent;
  @ViewChild('notesContainer') notesContainer: ElementRef | undefined;
  // currentEditedNote: Note | List = new Note(null, "", Date.now(), "note", "", false, "", "");

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
      const currentEditedNote = this.noteFormComponent.currentEditedNote;

      if (currentEditedNote.title === ''
        && (currentEditedNote.content === '' || currentEditedNote.listItems.length === 0)) {
        return;
      }
      if (!currentEditedNote.key) {
        this.fbService.addNote(currentEditedNote);
      } else {
        this.fbService.updateNote(currentEditedNote!);
      }
      this.formShown = false;
      this.noteFormComponent.currentEditedNote = new Note(
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
    console.log(note);
    this.notes.push(note);
    this.sortNotes();
  }

  sortNotes(): void {
    this.notes.sort((a: Note, b: Note) => {
      const aPinned = a.pinned ? 1 : 0;
      const bPinned = b.pinned ? 1 : 0;
      return bPinned - aPinned;
    });
  }

  emitPinChange(noteKey: string) {
    this.pinNoteChange.emit(noteKey);
  }
}
