import { Component, ChangeDetectionStrategy, signal, effect, computed, OnInit, ElementRef, ViewChild, WritableSignal, inject, AfterViewInit, AfterViewChecked, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Note } from './note.model';
import { NoteService } from './note.service';

declare var Quill: any;
declare var lucide: any;
declare var htmlDocx: any;
declare var html2pdf: any;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(window:keydown)': 'handleKeyboardShortcuts($event)',
    '(click)': 'onHostClick($event)',
    '(window:beforeunload)': 'saveOnExit()'
  }
})
export class AppComponent implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy {
  private noteService = inject(NoteService);
  
  @ViewChild('fileInput') fileInput?: ElementRef<HTMLInputElement>;
  @ViewChild('editorContainer') editorContainer?: ElementRef<HTMLDivElement>;
  
  notes: WritableSignal<Note[]> = signal([]);
  activeNoteId: WritableSignal<string | null> = signal(null);
  searchTerm: WritableSignal<string> = signal('');
  noteToDeleteId: WritableSignal<string | null> = signal(null);
  isSidebarOpen: WritableSignal<boolean> = signal(false);
  toastMessage: WritableSignal<string | null> = signal(null);
  isDarkMode: WritableSignal<boolean> = signal(true);
  
  private quillEditor: any;
  private iconsLoaded = false;
  private debounceSave: any;
  private toastTimeout: any;
  private editorInitialized = false;
  
  activeNote = computed(() => {
    const id = this.activeNoteId();
    return this.notes().find((n: Note) => n.id === id) ?? null;
  });
  
  filteredAndSortedNotes = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const filtered = this.notes().filter((note: Note) => {
      const title = note.title.toLowerCase();
      const content = this.stripHtml(note.content).toLowerCase();
      return title.includes(term) || content.includes(term);
    });
    return filtered.sort((a: Note, b: Note) => {
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
      return b.updatedAt - a.updatedAt;
    });
  });
  
  wordCount = computed(() => {
    const note = this.activeNote();
    if (!note) return 0;
    const text = this.stripHtml(note.content);
    return text.trim().split(/\s+/).filter(Boolean).length;
  });
  
  charCount = computed(() => {
    const note = this.activeNote();
    if (!note) return 0;
    const text = this.stripHtml(note.content);
    return text.length;
  });

  wordCountProgress = computed(() => {
    const note = this.activeNote();
    const goal = note?.wordCountGoal ?? 0;
    if (!goal || goal <= 0) return 0;
    const count = this.wordCount();
    return Math.min((count / goal) * 100, 100);
  });
  
  constructor() {
    effect((onCleanup: (cleanup: () => void) => void) => {
      const notesToSave = this.notes();
      if (!this.quillEditor || !this.activeNote()) return;
      
      clearTimeout(this.debounceSave);
      
      this.debounceSave = setTimeout(() => {
        this.noteService.saveNotes(notesToSave);
        this.showToast('Note auto-saved!');
      }, 1500);
      
      onCleanup(() => clearTimeout(this.debounceSave));
    });
    
    effect(() => {
      const note = this.activeNote();
      if (this.quillEditor && note) {
        const editorContent = this.quillEditor.root.innerHTML;
        if (editorContent !== note.content) {
          const selection = this.quillEditor.getSelection();
          this.quillEditor.root.innerHTML = note.content;
          if (selection) {
            setTimeout(() => {
              try {
                this.quillEditor.setSelection(selection);
              } catch (e) {
                // Selection may be invalid after content change
              }
            }, 0);
          }
        }
      }
    });
  }
  
  saveOnExit(): void {
    clearTimeout(this.debounceSave);
    if(this.notes().length > 0) {
      this.noteService.saveNotes(this.notes());
    }
  }
  
  ngOnInit(): void {
    this.loadLucideScript();
    const notesFromStorage = this.noteService.getNotes();
    
    const migratedNotes = notesFromStorage.map((note: any) => {
        const newNote: Note = {...note};
        if (typeof newNote.wordCountGoal === 'undefined') {
            newNote.wordCountGoal = 0;
        }
        if (typeof (note as any).title === 'undefined' || !note.content.includes('<p>')) {
            const lines = note.content.split('\n');
            const titleLine = lines.find((l: string) => l.startsWith('# '));
            const title = titleLine ? titleLine.substring(2).trim() : 'Untitled Note';
            const content = lines
              .filter((l: string) => !l.startsWith('# '))
              .map((line: string) => line.trim() === '' ? '<p><br></p>' : `<p>${line}</p>`)
              .join('');
            newNote.title = title;
            newNote.content = content;
        }
        return newNote;
    });
    
    this.notes.set(migratedNotes);
    if (this.notes().length > 0) {
      this.selectNote(this.filteredAndSortedNotes()[0]?.id);
    }
    this.isSidebarOpen.set(window.innerWidth >= 1024);
  }
  
  ngAfterViewInit(): void {
    // Editor will be initialized when a note is selected
  }
  
  private initializeEditor(): void {
    if (this.editorInitialized) return;
    
    setTimeout(() => {
      const editorEl = this.editorContainer?.nativeElement || document.getElementById('editor-container');
      
      if (!editorEl) {
        console.warn('Editor container not ready yet');
        return;
      }
      
      if (typeof Quill === 'undefined') {
        console.error('Quill is not loaded');
        return;
      }

      try {
        const Font = Quill.import('formats/font');
        Font.whitelist = ['serif', 'monospace'];
        Quill.register(Font, true);

        const Size = Quill.import('attributors/style/size');
        Size.whitelist = ['small', 'large', 'huge'];
        Quill.register(Size, true);

        this.quillEditor = new Quill(editorEl, {
          modules: {
            toolbar: {
              container: '#editor-toolbar',
              handlers: {
                'undo': () => this.quillEditor.history.undo(),
                'redo': () => this.quillEditor.history.redo(),
                'clean': () => {
                  const range = this.quillEditor.getSelection();
                  if (range) {
                    this.quillEditor.removeFormat(range.index, range.length);
                  }
                }
              }
            },
            history: { delay: 1000, maxStack: 100, userOnly: true }
          },
          theme: 'snow',
          placeholder: 'Start writing your note...'
        });
        
        this.quillEditor.on('text-change', (_delta: any, _oldDelta: any, source: string) => {
          if (source === 'user') {
            this.updateNoteContent(this.quillEditor.root.innerHTML);
          }
        });
        
        // Load initial content
        const note = this.activeNote();
        if (note) {
          this.quillEditor.root.innerHTML = note.content;
        }
        
        this.editorInitialized = true;
        console.log('✅ Quill editor initialized successfully');
      } catch (error) {
        console.error('Error initializing Quill editor:', error);
      }
    }, 150);
  }
  
  ngAfterViewChecked(): void {
    if (this.iconsLoaded && typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }
  
  ngOnDestroy(): void {
    this.saveOnExit();
    clearTimeout(this.toastTimeout);
  }
  
  private loadLucideScript(): void {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/lucide@latest/dist/umd/lucide.min.js';
    script.onload = () => {
      this.iconsLoaded = true;
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
    };
    script.onerror = () => console.error('Failed to load Lucide icons script.');
    document.head.appendChild(script);
  }
  
  stripHtml(html: string): string {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  }
  
  toggleSidebar(): void {
    this.isSidebarOpen.update((v: boolean) => !v);
  }
  
  toggleTheme(): void {
    this.isDarkMode.update((v: boolean) => !v);
    document.body.classList.toggle('dark');
  }
  
  onHostClick(event: MouseEvent): void {
    if (this.noteToDeleteId() && !(event.target as HTMLElement).closest('.delete-confirm-dialog, .delete-btn')) {
      this.noteToDeleteId.set(null);
    }
  }
  
  selectNote(id: string | null): void {
    if (id) {
      this.activeNoteId.set(id);
      this.noteToDeleteId.set(null);
      if (window.innerWidth < 1024) {
        this.isSidebarOpen.set(false);
      }
      
      // Initialize editor if not already done
      if (!this.editorInitialized) {
        this.initializeEditor();
      } else if (this.quillEditor) {
        // Load content into existing editor
        const note = this.notes().find((n: Note) => n.id === id);
        if (note) {
          this.quillEditor.root.innerHTML = note.content;
        }
      }
    }
  }
  
  newNote(): void {
    const newNote: Note = {
      id: crypto.randomUUID(),
      title: 'New Note',
      content: '<p><br></p>',
      isPinned: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      wordCountGoal: 0,
    };
    this.notes.update((notes: Note[]) => [newNote, ...notes]);
    this.selectNote(newNote.id);
  }
  
  startDelete(event: MouseEvent, id: string): void {
    event.stopPropagation();
    this.noteToDeleteId.set(id);
  }
  
  confirmDelete(event: MouseEvent): void {
    event.stopPropagation();
    const idToDelete = this.noteToDeleteId();
    if (idToDelete) {
      this.notes.update((notes: Note[]) => notes.filter((n: Note) => n.id !== idToDelete));
      if (this.activeNoteId() === idToDelete) {
        this.activeNoteId.set(this.filteredAndSortedNotes()[0]?.id ?? null);
      }
    }
    this.noteToDeleteId.set(null);
  }
  
  cancelDelete(event: MouseEvent): void {
    event.stopPropagation();
    this.noteToDeleteId.set(null);
  }
  
  updateNoteContent(content: string): void {
    const id = this.activeNoteId();
    if (id) {
      this.notes.update((notes: Note[]) =>
        notes.map((n: Note) =>
          n.id === id ? { ...n, content: content, updatedAt: Date.now() } : n
        )
      );
    }
  }
  
  updateNoteTitle(newTitle: string): void {
    const id = this.activeNoteId();
    if (id) {
      this.notes.update((notes: Note[]) =>
        notes.map((n: Note) => (n.id === id ? { ...n, title: newTitle, updatedAt: Date.now() } : n))
      );
    }
  }

  updateWordCountGoal(goal: string): void {
    const id = this.activeNoteId();
    const goalNum = parseInt(goal, 10);
    if (id && !isNaN(goalNum) && goalNum >= 0) {
        this.notes.update((notes: Note[]) =>
            notes.map((n: Note) => n.id === id ? { ...n, wordCountGoal: goalNum } : n)
        );
    }
  }
  
  showToast(message: string): void {
    this.toastMessage.set(message);
    clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      this.toastMessage.set(null);
    }, 3000);
  }
  
  forceSave(): void {
    clearTimeout(this.debounceSave);
    this.noteService.saveNotes(this.notes());
    this.showToast('Note Saved! ✓');
  }
  
  togglePin(event: MouseEvent, id: string): void {
    event.stopPropagation();
    this.notes.update((notes: Note[]) =>
      notes.map((n: Note) =>
        n.id === id ? { ...n, isPinned: !n.isPinned, updatedAt: Date.now() } : n
      )
    );
  }
  
  getNoteTitle(note: Note): string {
    return note.title || 'Untitled Note';
  }
  
  getNoteSummary(note: Note): string {
    const text = this.stripHtml(note.content).trim();
    return text.substring(0, 100) || 'No additional content';
  }
  
  formatDate(timestamp: number): string {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
    }).format(new Date(timestamp));
  }
  
  async exportNote(format: 'docx' | 'pdf'): Promise<void> {
    const note = this.activeNote();
    if (!note) return;
    
    const titleForFilename = note.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const fullContent = `
      <div style="font-family: 'Inter', sans-serif; line-height: 1.6;">
        <h1>${note.title}</h1>
        ${note.content}
      </div>
    `;
    
    if (format === 'docx') {
      const fileBuffer = await htmlDocx.asBlob(fullContent, {
        orientation: 'portrait',
        margins: { top: 720, bottom: 720, left: 720, right: 720 }
      });
      const url = URL.createObjectURL(fileBuffer);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${titleForFilename}.docx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      const opt = {
        margin: 0.5,
        filename: `${titleForFilename}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
      };
      
      html2pdf().from(fullContent).set(opt).save();
    }
  }
  
  triggerImport(): void {
    this.fileInput?.nativeElement.click();
  }
  
  importNote(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const content = e.target?.result as string;
      const title = file.name.replace(/\.(txt|html|md)$/i, '');
      const newNote: Note = {
        id: crypto.randomUUID(),
        title: title,
        content: content.includes('<p>') ? content : `<p>${content}</p>`,
        isPinned: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        wordCountGoal: 0,
      };
      this.notes.update((notes: Note[]) => [newNote, ...notes]);
      this.selectNote(newNote.id);
    };
    reader.onerror = () => {
      console.error('Failed to read file');
    };
    reader.readAsText(file);
    (event.target as HTMLInputElement).value = '';
  }
  
  handleKeyboardShortcuts(event: KeyboardEvent): void {
    if (event.ctrlKey || event.metaKey) {
      switch (event.key) {
        case 'n':
          event.preventDefault();
          this.newNote();
          break;
        case 's':
          event.preventDefault();
          this.forceSave();
          break;
      }
    }
  }
}