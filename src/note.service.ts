
import { Injectable } from '@angular/core';
import { Note } from './note.model';

@Injectable({
  providedIn: 'root',
})
export class NoteService {
  private readonly STORAGE_KEY = 'zen-notes';

  getNotes(): Note[] {
    try {
      const notesJson = localStorage.getItem(this.STORAGE_KEY);
      return notesJson ? JSON.parse(notesJson) : [];
    } catch (e) {
      console.error('Error reading notes from localStorage', e);
      return [];
    }
  }

  saveNotes(notes: Note[]): boolean {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(notes));
      return true;
    } catch (e) {
      console.error('Error saving notes to localStorage', e);
      return false;
    }
  }
}
