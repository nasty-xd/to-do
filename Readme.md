# TS Todo List

## Project Description

**TS Todo List** is a simple and modern web application for task management (ToDo), written in TypeScript and plain JavaScript without a bundler.  
The project allows you to create tasks with a priority, move them between columns (`Todo`, `Work in Progress`, `Testing`, `Done`) using Drag & Drop, and automatically saves the state in `localStorage`.

Each task has:
- Title
- Priority: `low`, `medium`, `high`
- Status: determines the column the task is in
- Delete option
- Highlight when moved to the "Done" column

---

## Technologies

- **TypeScript 5.9.3** — strict typing and modern language features
- **HTML5 & CSS3** — structure and styling
- **ES Modules** — modular architecture without a bundler
- **Drag & Drop API** — moving tasks between columns
- **LocalStorage** — saving tasks between sessions

---

## Installation and Running

1. Clone the repository:

```bash
git clone https://github.com/nasty-xd/to-do.git
```

2. Install dependencies:
npm install

3. Build the project:
npm run build

4. Open index.html in a browser.
