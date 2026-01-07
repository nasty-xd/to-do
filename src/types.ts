
export type Status = 'todo' | 'wip' | "testing" | 'done';

export interface Task {
    id: string;
    title: string;
    createdAt:string;
    status: Status;
     priority: "low" | "medium" | "high";
}
