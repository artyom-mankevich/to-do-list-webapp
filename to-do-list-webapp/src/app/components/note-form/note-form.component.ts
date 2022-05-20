import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
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

  fileInput(fileInput: any) {
    if (fileInput.target.files && fileInput.target.files[0]) {
      const file = fileInput.target.files[0];
      if (file.size > 500000) {
        alert("File is too big, max size is 500kb");
        return;
      }
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.editedNote.image = e.target.result;
      };
      reader.readAsDataURL(fileInput.target.files[0]);
    }
  }

  clickFileButton() {
    const fileInput = document.querySelector('#fileInput');
    // @ts-ignore
    fileInput!.click();
    console.log(fileInput);
  }
}
