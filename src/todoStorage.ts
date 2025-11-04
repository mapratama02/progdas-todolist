import type { Todo } from "./interface";

export function writeTodo(todos: Todo[]) {
    let json = JSON.stringify(todos);
    localStorage.setItem('todos', json);
}

export function readTodo(): Todo[] {
    let data = JSON.parse(localStorage.getItem('todos') || '[]') as Todo[];
    return data;
}