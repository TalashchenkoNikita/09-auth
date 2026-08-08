# NoteHub (Next.js)

Рефакторинг проєкту NoteHub (05-notehub) на Next.js з багатосторінковою структурою (App Router),
SSR-префетчем через TanStack Query та гідратацією кешу.

## Маршрути

- `/` — головна сторінка
- `/notes` — список нотаток (SSR-префетч + клієнтський пошук/пагінація/створення)
- `/notes/[id]` — деталі нотатки (SSR-префетч по id)

## Структура

```
app/                     # Маршрути Next.js (App Router)
  layout.tsx             # Глобальний layout: Header + Footer + TanStackProvider
  page.tsx                # Головна сторінка (/)
  loading.tsx             # Спільний loading-стан для всіх маршрутів
  notes/
    page.tsx               # SSR-сторінка /notes (prefetch + hydration)
    Notes.client.tsx        # Клієнтська логіка списку нотаток
    error.tsx                # Обробка помилок для /notes
    [id]/
      page.tsx                 # SSR-сторінка /notes/[id] (prefetch по id)
      NoteDetails.client.tsx    # Клієнтська логіка деталей нотатки
      error.tsx                  # Обробка помилок для /notes/[id]
components/              # Header, Footer, TanStackProvider, Modal, NoteForm, NoteList, Pagination, SearchBox
lib/api.ts               # Робота з бекендом (fetchNotes, fetchNoteById, createNote, deleteNote)
types/note.ts            # Типи Note / CreateNoteRequest / NoteTag
```
