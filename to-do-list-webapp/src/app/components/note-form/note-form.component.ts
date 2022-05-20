import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {FirebaseService} from "../../services/firebase.service";
import {List, ListItem, Note} from "../../common/entities";

@Component({
  selector: 'app-note-form',
  templateUrl: './note-form.component.html',
  styleUrls: ['./note-form.component.css']
})
export class NoteFormComponent implements OnInit, OnChanges {
  @Input() currentEditedNote: Note | List | null = null;

  constructor(private fbService: FirebaseService) {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['currentEditedNote']) {
      this.currentEditedNote = changes['currentEditedNote'].currentValue;
    }
  }
}
