# A to do list / notes web application
### Манкевич Артём, гр. 953504
Application is similar to Microsoft To Do app or Google Keep. The user is able to create notes with regular text and pictures, to-do lists to break tasks down, set reminders, and integrate their notes with Google Calendar.

## Deployed via Heroku [here](https://itanddp-lab6.herokuapp.com/)
## [Mock up](https://www.figma.com/file/B4SmhKwgY1Mk6t0xCcvLfC/To-Do-app?node-id=0%3A1)
## Main functions
1. Creation of basic text notes.
2. Notes can be supplemented with pictures
3. Creation of to-do lists
4. Reminders with notifications in the web app
5. Grouping of notes and lists by tags
6. Integration with Google Calendar for reminders
7. Sorting of notes by date or importance

## Data models
- Users. User's model used for authentication.
- Notes. Note's model used for notes, lists and reminders.
- Pictures. Pictures table used for storing notes pictures.
- Tags. Used as a foreign key for notes grouping.
