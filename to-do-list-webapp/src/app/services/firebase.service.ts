import {Injectable} from '@angular/core';
import {AngularFireDatabase} from "@angular/fire/compat/database";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {Router} from "@angular/router";
import {Observable, of} from "rxjs";
import {onAuthStateChanged} from "@angular/fire/auth";
import {ListItem, Note, Reminder} from "../common/entities";
import {query, ref} from "@angular/fire/database";
import {getBlob} from "@angular/fire/storage";

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private db: AngularFireDatabase, private auth: AngularFireAuth, private router: Router) {
    this.auth.onAuthStateChanged(user => {
      if (user) {
        sessionStorage.setItem('userId', user.uid);
      } else {
        sessionStorage.removeItem('userId');
      }
    });
  }

  getUid(): string | null {
    return sessionStorage.getItem('userId');
  }

  createUserWithEmailAndPassword(email: string, password: string): Observable<boolean> {
    this.auth.createUserWithEmailAndPassword(email, password).then(
      value => {
        const uid = value!.user!.uid;
        if (uid) {
          sessionStorage.setItem('userId', uid);
          return of(true);
        }
        return of(false);
      }
    );
    return of(false);
  }

  signInWithEmailAndPassword(email: string, password: string): Observable<boolean> {
    this.auth.signInWithEmailAndPassword(email, password).then(value => {
        const uid = value!.user!.uid;
        if (uid) {
          sessionStorage.setItem('userId', uid);
          return of(true);
        }
        return of(false);
      }
    );
    return of(false);
  }

  signOut() {
    this.auth.signOut().then(() => {
      sessionStorage.removeItem('userId');
      this.router.navigateByUrl('/login');
    });
  }

  async getLastTwoReminders(): Promise<Observable<Reminder[]>> {
    const uid = this.getUid();
    const reminders: Reminder[] = [];
    await this.db.database.ref(`${uid}/reminders`)
      .limitToFirst(2)
      .orderByChild('eventTimestamp')
      .get()
      .then(snapshot => {
        snapshot.forEach(childSnapshot => {
          const reminder: Reminder = childSnapshot.val();
          reminders.push(reminder);
        });
      });
    return of(reminders);
  }

  async getReminders(): Promise<Observable<Reminder[]>> {
    const uid = this.getUid();
    const reminders: Reminder[] = [];
    await this.db.database.ref(`${uid}/reminders`)
      .orderByChild('eventTimestamp')
      .get()
      .then(snapshot => {
        snapshot.forEach(childSnapshot => {
          const reminder: Reminder = childSnapshot.val();
          reminders.push(reminder);
        });
      });
    return of(reminders);
  }

  addReminder(content: string, eventTimestamp: string): void {
    const uid = this.getUid();
    this.db.database.ref(`${uid}/reminders/`).push({
      content,
      eventTimestamp
    });
  }

  updateReminder(reminder: Reminder): void {
    const uid = this.getUid();
    this.db.database.ref(`${uid}/reminders/${reminder.key}`)
      .update({
        content: reminder.content,
        eventTimestamp: reminder.eventTimestamp,
        timestamp: Date.now()
      });
  }

  removeReminder(key: string): void {
    const uid = this.getUid();
    this.db.database.ref(`${uid}/reminders/${key}`).remove();
  }

  async getReminderByKey(key: string): Promise<Observable<Reminder>> {
    const uid = this.getUid();
    await this.db.database.ref(`${uid}/reminders/${key}`)
      .once('value').then(snapshot => {
        const reminder: Reminder = snapshot.val();
        return of(reminder);
      });
    throw new Error('Reminder not found');
  }

  tagOnChildAdded(callback: (tag: string) => void): void {
    const uid = this.getUid();
    this.db.database.ref(`${uid}/tags`).on('child_added', snapshot => {
      const tag: string = <string>snapshot.key;
      callback(tag);
    });
  }

  tagOnChildRemoved(callback: (tag: string) => void): void {
    const uid = this.getUid();
    this.db.database.ref(`${uid}/tags`).on('child_removed', snapshot => {
      const tag: string = <string>snapshot.key;
      callback(tag);
    });
  }

  setTag(tag: string): void {
    const uid = this.getUid();
    this.db.database.ref(`${uid}/tags/${tag}`).set("");
  }

  removeTag(tag: string): void {
    const uid = this.getUid();
    this.db.database.ref(`${uid}/tags/${tag}`).remove();
  }

  async getTags(): Promise<Observable<string[]>> {
    const uid = this.getUid();
    const tags: string[] = [];
    await this.db.database.ref(`${uid}/tags`)
      .orderByChild('tag')
      .once('value').then(snapshot => {
        snapshot.forEach(childSnapshot => {
          const tag: string | null = childSnapshot.key;
          if (tag != null) {
            tags.push(tag);
          }
        });
      });
    return of(tags);
  }

  async addNote(note: Note): Promise<void> {
    const uid = this.getUid();
    this.db.database.ref(`${uid}/notes/`).push({
      title: note.title,
      content: note.content,
      timestamp: Date.now(),
      type: note.type,
      tag: note.tag,
      pinned: note.pinned,
      image: note.image,
      listItems: note.listItems
    });

    if (note.tag !== "") {
      this.setTag(note.tag);
    }
    if (note.image !== "") {
      const blobImage = await (await fetch(note.image)).blob();
      this.base64encodeImage(blobImage).then(base64 => {
        note.image = base64;
        this.db.database.ref(`${uid}/notes/${note}/image`).update(note.image);
      });
    }
  }

  noteOnChildAdded(callback: (note: Note) => void): void {
    const uid = this.getUid();
    this.db.database.ref(`${uid}/notes`).on('child_added', snapshot => {
      const listItems: ListItem[] = [];
      for (const key in snapshot.val().listItems) {
        listItems.push(
          new ListItem(
            key,
            snapshot.val().listItems[key].body,
            snapshot.val().listItems[key].checked
          )
        );
      }
      const note: Note = new Note(
        snapshot.key,
        snapshot.val().title,
        snapshot.val().timestamp,
        snapshot.val().type,
        snapshot.val().tag,
        snapshot.val().pinned,
        snapshot.val().content,
        snapshot.val().image,
        listItems);
      callback(note);
    });
  }

  async updateNote(note: Note): Promise<void> {
    const uid = this.getUid();
    this.db.database.ref(`${uid}/notes/${note.key}`).update({
      title: note.title,
      timestamp: Date.now(),
      type: note.type,
      tag: note.tag,
      pinned: note.pinned,
      content: note.content,
      image: note.image,
      listItems: note.listItems
    });
    if (note.tag !== "") {
      this.setTag(note.tag);
    }
    if (note.image !== "") {
      const blobImage = await (await fetch(note.image)).blob();
      this.base64encodeImage(blobImage).then(base64 => {
        note.image = base64;
        this.db.database.ref(`${uid}/notes/${note.key}/image`).update(note.image);
      });
    }
  }

  updateNotePinned(key: string, pinned: boolean): void {
    const uid = this.getUid();
    this.db.database.ref(`${uid}/notes/${key}/`).update({pinned: pinned});
  }

  async getNoteByKey(key: string): Promise<Observable<Note>> {
    const uid = this.getUid();
    await this.db.database.ref(`${uid}/notes/${key}`).get().then(snapshot => {
      if (snapshot.exists()) {
        const listItems: ListItem[] = [];
        for (const key in snapshot.val().listItems) {
          listItems.push(
            new ListItem(
              key,
              snapshot.val().listItems[key].body,
              snapshot.val().listItems[key].checked
            )
          );
        }
        const note: Note = new Note(
          snapshot.key,
          snapshot.val().title,
          snapshot.val().timestamp,
          snapshot.val().type,
          snapshot.val().tag,
          snapshot.val().pinned,
          snapshot.val().content,
          snapshot.val().image,
          listItems);
        return of(note);
      }
      throw new Error('Note not found');
    });
    throw new Error('Note not found');
  }

  async getNotes(): Promise<Observable<Note[]>> {
    const uid = this.getUid();
    const notes: Note[] = [];
    await this.db.database.ref(`${uid}/notes/`)
      .orderByChild('pinned')
      .get()
      .then(snapshot => {
        snapshot.forEach(childSnapshot => {
          const note: Note = childSnapshot.val();
          notes.push(note);
        });
      });
    return of(notes);
  }

  async getNotesByTag(tag: string): Promise<Observable<Note[]>> {
    const uid = this.getUid();
    const notes: Note[] = [];
    await this.db.database.ref(`${uid}/notes/`)
      .orderByChild('tag')
      .equalTo(tag)
      .get()
      .then(snapshot => {
        snapshot.forEach(childSnapshot => {
          const note: Note = childSnapshot.val();
          notes.push(note);
        });
      });
    return of(notes);
  }

  removeNote(key: string): void {
    const uid = this.getUid();
    this.db.database.ref(`${uid}/notes/${key}`).remove();
  }

  private base64encodeImage(image: Blob): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = function () {
        resolve(reader.result);
      };
      reader.onerror = function (error) {
        reject(error);
      };
    });
  }
}
