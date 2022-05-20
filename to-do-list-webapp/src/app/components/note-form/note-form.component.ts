import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {FirebaseService} from "../../services/firebase.service";
import {ListItem, Note} from "../../common/entities";

@Component({
  selector: 'app-note-form',
  templateUrl: './note-form.component.html',
  styleUrls: ['./note-form.component.css']
})
export class NoteFormComponent implements OnInit {
  @Input() currentEditedNote: Note = new Note(
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


  constructor(private fbService: FirebaseService) {
  }

  ngOnInit(): void {
  }

  formListButtonClick() {
    this.currentEditedNote.type = this.currentEditedNote.type == 'list'? 'note' : 'list'
    if (this.currentEditedNote.type == 'list') {
      this.currentEditedNote.listItems = [
        new ListItem("0", "", false)
      ];
    }
  }
}
