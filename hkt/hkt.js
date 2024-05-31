"use strict";
class TodoList {
    constructor(id, name, completed) {
        this.id = id;
        this.name = name;
        this.completed = completed;
    }
}
class TodoListMain {
    constructor() {
        const todoLocal = localStorage.getItem("todolists");
        this.todolists = todoLocal ? JSON.parse(todoLocal) : [];
    }
    // Lấy danh sách tất cả todo
    getAllTodoList() {
        return this.todolists;
    }
    saveTodoList() {
        localStorage.setItem("todolists", JSON.stringify(this.todolists));
    }
    // Hiển thị
    renderJob() {
        return this.todolists;
    }
    // Thêm mới công việc 
    createJob(newTodoList) {
        if (this.todolists.some(todo => todo.name === newTodoList.name)) {
            const nameDuplicateElement = document.getElementById('nameDuplicate');
            if (nameDuplicateElement) {
                nameDuplicateElement.style.display = 'block';
            }
        }
        else {
            const nameDuplicateElement = document.getElementById('nameDuplicate');
            if (nameDuplicateElement) {
                nameDuplicateElement.style.display = 'none';
            }
            this.todolists.push(newTodoList);
            this.saveTodoList();
            updateCompletedCount(); // Cập nhật tổng số công việc
        }
    }
    updateJob(todolistId, JobNumber) {
        const checkbox = document.querySelector(`#add input[data-id="${todolistId}"]`);
        const jobName = document.querySelector(`#add input[data-id="${todolistId}"] + a`);
        if (checkbox && jobName) {
            if (checkbox.checked) {
                jobName.style.textDecoration = "line-through";
                console.log(JobNumber);
            }
            else {
                jobName.style.textDecoration = "none";
                console.log(JobNumber);
            }
        }
    }
    deleteJob(todolistId) {
        if (confirm("Bạn có chắc chắn muốn xóa không?")) {
            this.todolists = this.todolists.filter((todolist) => todolist.id !== todolistId);
            this.saveTodoList();
        }
    }
    // Đổi trạng thái công việc
    toggleTodoStatus(todolistId) {
        const todo = this.todolists.find((todolist) => todolist.id === todolistId);
        if (todo) {
            todo.completed = !todo.completed;
            this.saveTodoList();
        }
    }
    editWork(todolistId) {
        const todo = this.todolists.find((todo) => todo.id === todolistId);
        if (todo) {
            const newName = prompt('Bạn có muốn sửa công việc này không', todo.name);
            if (newName !== null && newName.trim() !== "") {
                todo.name = newName.trim();
                todo.completed = true; // Đặt trạng thái hoàn thành là true sau khi chỉnh sửa
                this.saveTodoList();
                renderTodoLists(); // Cập nhật giao diện sau khi sửa
            }
        }
    }
}
function deleteWork(id) {
    todolistMain.deleteJob(id);
    window.location.reload();
}
function editWork(id) {
    todolistMain.editWork(id);
}
const todolistMain = new TodoListMain();
// lấy ra các element trong DOM
const btnAddTodoListElement = document.querySelector("#btn");
const inputE = document.querySelector("#input");
const listTodoElement = document.querySelector('#add');
const completedCountSpan = document.getElementById("count");
const totalCountSpan = document.getElementById("lengthValue");
// các hàm tương tác với DOM
const creatTodoList = () => {
    const newId = Math.ceil(Math.random() * 10000);
    const todolist = new TodoList(newId, inputE.value, false);
    const element = document.querySelector('#notName');
    const element2 = document.querySelector('#nameDouble');
    if (inputE.value) {
        if (element instanceof HTMLElement) {
            element.style.display = "none";
        }
        if (element2 instanceof HTMLElement) {
            element2.style.display = "none";
        }
        let flag = 0;
        if (flag === 1) {
            if (element2 instanceof HTMLElement) {
                element2.style.display = "block";
            }
        }
        else {
            if (element instanceof HTMLElement) {
                element.style.display = "none";
            }
            todolistMain.createJob(todolist);
            inputE.value = "";
            renderTodoLists();
        }
    }
    else {
        if (element instanceof HTMLElement) {
            element.style.display = "block";
        }
    }
};
function renderTodoLists() {
    const todolistHTMLs = todolistMain.getAllTodoList().map((todolist) => {
        return `
        <label class="list-group-item">
        <input class="form-check-input me-1" type="checkbox" value="" ${todolist.completed ? 'checked' : ''} onclick="toggleTodoStatus(${todolist.id})">
        <span class="${todolist.completed ? 'text-decoration-line-through' : ''}">${todolist.name}</span>
          <span class="icons">
                <i class="fa-solid fa-pen" style="color: orange;" onclick="editWork(${todolist.id})"></i>
                <i class="fa-solid fa-trash" onclick="deleteWork(${todolist.id})" style="color: red;"></i>
          </span>
      </label>
                `;
    });
    const convertToString = todolistHTMLs.join("");
    listTodoElement.innerHTML = convertToString;
    // Lắng nghe sự kiện click trên mỗi biểu tượng xóa sau khi render xong
    const deleteJobs = document.querySelectorAll('.fa-trash-can');
    deleteJobs.forEach(button => {
        button.addEventListener('click', () => {
            const isConfirmed = confirm("Bạn có chắc chắn muốn xóa công việc này?");
            if (isConfirmed) {
                const todolistId = parseInt(button.getAttribute('data-id') || "");
                console.log(todolistId);
                todolistMain.deleteJob(todolistId);
                renderTodoLists(); // Sau khi xóa, cập nhật lại giao diện
            }
        });
    });
}
// Hàm cập nhật số lượng công việc đã hoàn thành và tổng số công việc
function updateCompletedCount() {
    const totalTasks = todolistMain.getAllTodoList().length;
    const completedTasks = todolistMain.getAllTodoList().filter(todo => todo.completed).length;
    completedCountSpan.textContent = completedTasks.toString();
    totalCountSpan.textContent = totalTasks.toString();
}
// Gọi hàm updateCompletedCount() để cập nhật số lượng công việc đã hoàn thành và tổng số công việc khi trang được load
updateCompletedCount();
function toggleTodoStatus(id) {
    todolistMain.toggleTodoStatus(id);
    renderTodoLists();
    updateCompletedCount();
}
// Gọi hàm renderTodoLists để hiển thị danh sách todo khi trang được load
renderTodoLists();
// bắt sự kiện trên DOM
// bấm vào nút button thêm mới
btnAddTodoListElement.addEventListener("click", () => {
    creatTodoList();
});
