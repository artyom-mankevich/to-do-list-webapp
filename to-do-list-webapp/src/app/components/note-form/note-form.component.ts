import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {FirebaseService} from "../../services/firebase.service";
import {ListItem, Note} from "../../common/entities";

@Component({
  selector: 'app-note-form',
  templateUrl: './note-form.component.html',
  styleUrls: ['./note-form.component.css']
})
export class NoteFormComponent implements OnInit, OnChanges {
  @Input() editedNote: Note = new Note(
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


  constructor() {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["editedNote"].currentValue) {
      this.editedNote = changes["editedNote"].currentValue;
    }
  }

  formListButtonClick() {
    this.editedNote.type = this.editedNote.type == 'list'? 'note' : 'list'
    if (this.editedNote.type == 'list') {
      this.editedNote.listItems = [
        new ListItem("0", "", false)
      ];
    }
  }
}
