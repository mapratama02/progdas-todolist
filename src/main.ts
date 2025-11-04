// Masukkan style ke dalam script
import './style.css'
import type { Todo } from './interface';
import { readTodo, writeTodo } from './todoStorage';

// Ambil elemen form
const todoForm = document.getElementById('todoForm')! as HTMLFormElement;
// Ambil elemen untuk menampilkan pesan error
const errorMsg = document.getElementById('errorMsg')! as HTMLParagraphElement;
// Ambil elemen <ul> untuk nantinya menampilkan data todos
const todos = document.getElementById('todos')! as HTMLUListElement;

const todosArr: Todo[] = readTodo();

// Function ini digunakan untuk mengenerate string acak untuk digunakan sebagai ID sebuah note
function IdGenerator(): string {
	// Tampung seluruh karakter yang dibutuhkan
	const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-';
	// Buat variabel untuk menampung hasil string
	let result = '';
	// Masukkan karakter random ke dalam variabel result dan ulangi langkahnya sebanyak 20 kali
	for (let i = 0; i < 20; i++) {
		result += chars.charAt(Math.floor(Math.random() * chars.length));
	}

	// Kemablikan hasilnya
	return result;
}

function render() {
	const todoElement = todosArr.map(t => {
		return `<li class="todo-item" data-id="${t.id}" data-complete="${t.completed}">
    <div class="todo-wrapper">
      <p>${t.text}</p>
    </div>
    <button class="complete" data-target="${t.id}">
      <i class="fa-solid fa-check"></i>
    </button>
    <button class="delete" data-target="${t.id}">
      <i class="fa-regular fa-trash-can"></i>
    </button>
  </li>`;
	}).join('');

	todos.innerHTML = todoElement;

	const deleteButtons = document.querySelectorAll<HTMLButtonElement>('.delete')!;
	deleteButtons.forEach(button => deleteButton(button));

	const completeButtons = document.querySelectorAll<HTMLButtonElement>('.complete')!;
	completeButtons.forEach(button => completeButton(button));
}

function deleteButton(button: HTMLButtonElement) {
	button.onclick = () => {
		if (confirm('Hapus todo?')) {
			const id = button.dataset.target!;
			const index = todosArr.findIndex(t => t.id === id);

			todosArr.splice(index, 1);
			writeTodo(todosArr);
			render();
		}
	}
}

function completeButton(button: HTMLButtonElement) {
	button.onclick = () => {
		const id = button.dataset.target!;
		const todoItem = todosArr.find(t => t.id === id)!;

		if (todoItem) {
			todoItem.completed = !todoItem.completed;
			document
				.querySelector<HTMLLIElement>(`.todo-item[data-id="${id}"]`)!
				.setAttribute('data-complete', todoItem.completed.toString());
			writeTodo(todosArr);
		}
	}
}

todoForm.onsubmit = (ev) => {
	ev.preventDefault();

	const formData = new FormData(todoForm);
	const todoInput = formData.get('todoInput')!.toString().trim();

	if (todoInput !== '') {
		todosArr.push({ id: IdGenerator(), text: todoInput, completed: false });
		errorMsg.style.display = 'none';
		writeTodo(todosArr);
	} else {
		errorMsg.style.display = 'block';
		errorMsg.textContent = 'Tidak boleh kosong';
	};

	todoForm.reset();
	render();
};

render();
