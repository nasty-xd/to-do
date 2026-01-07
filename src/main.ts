// Main application module
// Initialize state, attach event listeners, and start rendering

import type { Task, Status } from './types';
import { loadTasks, saveTasks, generateId } from './storage.js';
import { renderBoard, bindDragAndDrop } from './ui.js';
const form = document.getElementById('new-task-form') as HTMLFormElement;
const titleInput = document.getElementById('task-title') as HTMLInputElement;

const prioritySelect = document.getElementById('task-priority') as HTMLSelectElement;

const colTesting = document.getElementById('col-testing') as HTMLElement;



const colTodo = document.getElementById('col-todo') as HTMLElement;
const colWip = document.getElementById('col-wip') as HTMLElement;
const colDone = document.getElementById('col-done') as HTMLElement;

const columns: Record<Status, HTMLElement> = {
    todo: colTodo,
    wip: colWip,
    testing: colTesting,
    done: colDone,
};

let tasks: Task[] = loadTasks();

function sync() {
    renderBoard(tasks, columns);
    saveTasks(tasks);
}

// Handling the creation of a new task
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = titleInput.value.trim();
    if (!title) return;

    const newTask: Task = {
        id: generateId(),
        title,
        createdAt: new Date().toISOString(),
        status: 'todo',
        priority: prioritySelect.value as "low" | "medium" | "high",
    };

    tasks = [newTask, ...tasks];
    titleInput.value = '';
    sync();
});

// Function for moving a task between columns
function moveTask(taskId: string, to: Status) {
    const idx = tasks.findIndex((t) => t.id === taskId);
    if (idx === -1) return;
    tasks[idx] = { ...tasks[idx], status: to };
    sync();
    if (to === 'done') {
        const el = columns.done.querySelector(`[data-id="${taskId}"]`) as HTMLElement | null;
        if (el) {
            el.classList.add('flash-done');
            setTimeout(() => el.classList.remove('flash-done'), 1000);
        }
    }
}

// Drag & Drop
bindDragAndDrop(columns, moveTask);

// Initial render on startup
sync();

// Deleting a task by clicking the delete button
// Delegated to the entire document since the cards are created dynamically
document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement | null;
    if (!target) return;
    const delBtn = target.closest('.card-delete') as HTMLElement | null;
    if (!delBtn) return;
    e.preventDefault();
    e.stopPropagation();
    const card = delBtn.closest('.card') as HTMLElement | null;
    const id = card?.dataset.id;
    if (!id) return;
    tasks = tasks.filter((t) => t.id !== id);
    sync();
});
