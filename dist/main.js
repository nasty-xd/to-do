// Main application module
// Initialize the state, attach event listeners, and start rendering.
// In imports, we specify the .js suffix so that the browser ESM
// can correctly locate the compiled files in dist/ without a bundler.
import { loadTasks, saveTasks, generateId } from './storage.js';
import { renderBoard, bindDragAndDrop } from './ui.js';
// Finding UI elements
const form = document.getElementById('new-task-form');
const titleInput = document.getElementById('task-title');

const prioritySelect = document.getElementById('task-priority');

const colTesting = document.getElementById('col-testing');

const colTodo = document.getElementById('col-todo');
const colWip = document.getElementById('col-wip');
const colDone = document.getElementById('col-done');

const columns = {
    todo: colTodo,
    wip: colWip,
    testing: colTesting,
    done: colDone,
};

let tasks = loadTasks();
// Utility for re-rendering and saving
function sync() {
    renderBoard(tasks, columns);
    saveTasks(tasks);
}
// Handling the creation of a new task
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = titleInput.value.trim();
    if (!title)
        return;
    // Creating a new task: the date is automatically set to the current date
    const newTask = {
        id: generateId(),
        title,
        createdAt: new Date().toISOString(),
        status: 'todo',
        priority: prioritySelect.value,
    };
    tasks = [newTask, ...tasks];
    titleInput.value = '';
    sync();
});
// Function for moving a task between columns
function moveTask(taskId, to) {
    const idx = tasks.findIndex((t) => t.id === taskId);
    if (idx === -1)
        return;
    tasks[idx] = { ...tasks[idx], status: to };
    sync();
    // If a task is moved to the Done column, highlight its card for 1 second
    if (to === 'done') {
        const el = columns.done.querySelector(`[data-id="${taskId}"]`);
        if (el) {
            el.classList.add('flash-done');
            setTimeout(() => el.classList.remove('flash-done'), 1000);
        }
    }
}
// Drag & Drop
bindDragAndDrop(columns, moveTask);
sync();
// Deleting a task by clicking the delete button
document.addEventListener('click', (e) => {
    const target = e.target;
    if (!target)
        return;
    const delBtn = target.closest('.card-delete');
    if (!delBtn)
        return;
    e.preventDefault();
    e.stopPropagation();
    const card = delBtn.closest('.card');
    const id = card === null || card === void 0 ? void 0 : card.dataset.id;
    if (!id)
        return;
    tasks = tasks.filter((t) => t.id !== id);
    sync();
});
//# sourceMappingURL=main.js.map
