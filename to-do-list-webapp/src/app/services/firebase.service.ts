import {Injectable} from '@angular/core';
import {AngularFireDatabase} from "@angular/fire/compat/database";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {Router} from "@angular/router";
import {BehaviorSubject, Observable, of} from "rxjs";
import {ListItem, Note, Reminder} from "../common/entities";
import firebase from "firebase/compat";

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  public authenticated = new BehaviorSubject<boolean | null>(null);

  constructor(private db: AngularFireDatabase, private auth: AngularFireAuth, private router: Router) {
    this.auth.onAuthStateChanged(user => {
      if (user) {
        sessionStorage.setItem('userId', user.uid);
        this.authenticated.next(true);
      } else {
        sessionStorage.removeItem('userId');
        this.authenticated.next(false);
      }
    });
  }

  getUid(): string | null {
    return sessionStorage.getItem('userId');
  }

  createUserWithEmailAndPassword(email: string, password: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.auth.createUserWithEmailAndPassword(email, password).then(
        value => {
          const uid = value!.user!.uid;
          if (uid) {
            sessionStorage.setItem('userId', uid);
            resolve(true);
          }
          resolve(false);
        }
      ).catch(error => {
        reject(error);
      });
    });
  }

  signInWithEmailAndPassword(email: string, password: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.auth.signInWithEmailAndPassword(email, password).then(value => {
          const uid = value!.user!.uid;
          if (uid) {
            sessionStorage.setItem('userId', uid);
            resolve(true);
          }
          resolve(false);
        }
      ).catch(error => {
        reject(error);
      });
    });
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
          const reminder: Reminder = this.reminderFromSnapshot(childSnapshot);
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
          const reminder: Reminder = this.reminderFromSnapshot(childSnapshot);
          reminders.push(reminder);
        });
      });
    return of(reminders);
  }

  addReminder(content: string, eventTimestamp: string): void {
    const uid = this.getUid();
    this.db.database.ref(`${uid}/reminders/`).push({
      content,
      eventTimestamp,
      timestamp: Date.now()
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

  onChildAdded(callback: (reminder: Reminder) => void): void {
    const uid = this.getUid();
    this.db.database.ref(`${uid}/reminders`).on('child_added', snapshot => {
      const reminder: Reminder = this.reminderFromSnapshot(snapshot);
      callback(reminder);
    });
  }

  onChildChanged(callback: (reminder: Reminder) => void): void {
    const uid = this.getUid();
    this.db.database.ref(`${uid}/reminders`).on('child_changed', snapshot => {
      const reminder: Reminder = this.reminderFromSnapshot(snapshot);
      callback(reminder);
    });
  }

  onChildRemoved(callback: (reminder: Reminder) => void): void {
    const uid = this.getUid();
    this.db.database.ref(`${uid}/reminders`).on('child_removed', snapshot => {
      const reminder: Reminder = this.reminderFromSnapshot(snapshot);
      callback(reminder);
    });
  }

  async getReminderByKey(key: string): Promise<Observable<Reminder>> {
    const uid = this.getUid();
    await this.db.database.ref(`${uid}/reminders/${key}`)
      .once('value').then(snapshot => {
        const reminder: Reminder = this.reminderFromSnapshot(snapshot);
        return of(reminder);
      });
    throw new Error('Reminder not found');
  }

  reminderFromSnapshot(snapshot: firebase.database.DataSnapshot): Reminder {
    return new Reminder(
      snapshot.key,
      snapshot.val().content,
      snapshot.val().eventTimestamp,
      snapshot.val().timestamp
    );
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
    note.listItems = note.listItems.filter(item => item.body !== '');
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
  }

  noteOnChildAdded(callback: (note: Note) => void): void {
    const uid = this.getUid();
    this.db.database.ref(`${uid}/notes`).on('child_added', snapshot => {
      const note = FirebaseService.noteFromSnapshot(snapshot);
      callback(note);
    });
  }

  noteOnChildRemoved(callback: (note: Note) => void): void {
    const uid = this.getUid();
    this.db.database.ref(`${uid}/notes`).on('child_removed', snapshot => {
      const note = FirebaseService.noteFromSnapshot(snapshot);
      callback(note);
    });
  }

  noteOnChildChanged(callback: (note: Note) => void): void {
    const uid = this.getUid();
    this.db.database.ref(`${uid}/notes`).on('child_changed', snapshot => {
      const note = FirebaseService.noteFromSnapshot(snapshot);
      callback(note);
    });
  }

  private static noteFromSnapshot(snapshot: firebase.database.DataSnapshot) {
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
    return new Note(
      snapshot.key,
      snapshot.val().title,
      snapshot.val().timestamp,
      snapshot.val().type,
      snapshot.val().tag,
      snapshot.val().pinned,
      snapshot.val().content,
      snapshot.val().image,
      listItems);
  }

  async updateNote(note: Note): Promise<void> {
    const uid = this.getUid();
    note.listItems = note.listItems.filter(item => item.body !== '');
    await this.db.database.ref(`${uid}/notes/${note.key}`).update({
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
          const note: Note = FirebaseService.noteFromSnapshot(childSnapshot);
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
}
