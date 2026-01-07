// Module responsible for interacting with the DOM
import type { Task, Status } from './types';

// Date formatting utility for user display
export function formatDate(iso: string): string {
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit'
    });
}

// Creating a DOM element for a task card
export function createTaskElement(task: Task): HTMLElement {
    const card = document.createElement('article');
    card.className = 'card';
    card.setAttribute('role', 'listitem');
    card.draggable = true;
    card.dataset.id = task.id;

    // Delete card button
    const delBtn = document.createElement('button');
    delBtn.className = 'card-delete';
    delBtn.type = 'button';
    delBtn.title = 'Delete task';
    delBtn.setAttribute('aria-label', 'Delete task');
    delBtn.textContent = 'x';

    // Task title
    const titleEl = document.createElement('div');
    titleEl.className = 'card-title';
    titleEl.textContent = task.title;

    // Metadata: creation date
    const metaEl = document.createElement('div');
    metaEl.className = 'card-meta';
    metaEl.textContent = `Created: ${formatDate(task.createdAt)}`;

    const priorityEl = document.createElement('div');
    priorityEl.className = 'card-priority';
    priorityEl.textContent = `Priority: ${task.priority}`;

    card.append(delBtn, titleEl, metaEl, priorityEl);


    card.append(delBtn, titleEl, metaEl);
    return card;
}

// Drag & Drop
export function bindDragAndDrop(
    columns: Record<Status, HTMLElement>,
    onMove: (taskId: string, to: Status) => void
): void {
    (Object.keys(columns) as Status[]).forEach((status) => {
        const col = columns[status];

        col.addEventListener('dragover', (e) => {
            e.preventDefault();
            col.classList.add('drag-over');
        });

        col.addEventListener('dragleave', () => {
            col.classList.remove('drag-over');
        });

        col.addEventListener('drop', (e) => {
            e.preventDefault();
            col.classList.remove('drag-over');
            const id = e.dataTransfer?.getData('text/plain');
            if (id) onMove(id, status);
        });
    });

    document.addEventListener('dragstart', (e) => {
        const target = e.target as HTMLElement | null;
        if (!target) return;
        const card = target.closest('.card') as HTMLElement | null;
        if (card && card.dataset.id) {
            e.dataTransfer?.setData('text/plain', card.dataset.id);
            card.style.opacity = '0.6';
        }
    });

    document.addEventListener('dragend', (e) => {
        const target = e.target as HTMLElement | null;
        if (!target) return;
        const card = target.closest('.card') as HTMLElement | null;
        if (card) {
            card.style.opacity = '';
        }
    });
}

    // Render tasks into their respective columns
export function renderBoard(tasks: Task[], columns: Record<Status, HTMLElement>): void {
    (Object.keys(columns) as Status[]).forEach((status) => {
        columns[status].innerHTML = '';
    });

    // Create cards and add them to the appropriate column
    tasks.forEach((task) => {
        const el = createTaskElement(task);
        columns[task.status].appendChild(el);
    });
}

