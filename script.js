document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const priorityInput = document.getElementById('priority-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');
    const dateTime = document.getElementById('date-time');
    const taskCount = document.getElementById('task-count');
    const filterBtns = document.querySelectorAll('.filter-btn');

    // Display the current date and time
    function updateDateTime() {
        const now = new Date();
        dateTime.innerText = now.toLocaleString();
    }
    setInterval(updateDateTime, 1000);
    updateDateTime();

    // Load tasks from local storage
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    addTaskBtn.addEventListener('click', addTask);
    filterBtns.forEach(btn => btn.addEventListener('click', filterTasks));

    function addTask() {
        const taskText = taskInput.value.trim();
        const taskPriority = priorityInput.value;
        if (taskText === '') return;

        const task = { text: taskText, priority: taskPriority, completed: false };
        tasks.push(task);
        saveTasks();
        renderTasks();
        taskInput.value = '';
    }

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function renderTasks(filter = 'all') {
        taskList.innerHTML = '';
        let filteredTasks = tasks;

        if (filter === 'completed') {
            filteredTasks = tasks.filter(task => task.completed);
        } else if (filter === 'pending') {
            filteredTasks = tasks.filter(task => !task.completed);
        }

        filteredTasks.forEach((task, index) => {
            const taskItem = document.createElement('li');
            taskItem.classList.add(task.priority);
            if (task.completed) taskItem.classList.add('completed');
            taskItem.innerHTML = `
                <span>${task.text}</span>
                <div class="task-buttons">
                    <button class="complete-btn"><img src="check-icon.png" alt="Complete"></button>
                    <button class="edit-btn"><img src="edit-icon.png" alt="Edit"></button>
                    <button class="delete-btn"><img src="delete-icon.png" alt="Delete"></button>
                </div>
            `;

            taskList.appendChild(taskItem);

            const completeBtn = taskItem.querySelector('.complete-btn');
            const editBtn = taskItem.querySelector('.edit-btn');
            const deleteBtn = taskItem.querySelector('.delete-btn');

            completeBtn.addEventListener('click', () => {
                task.completed = !task.completed;
                saveTasks();
                renderTasks(filter);
            });
            editBtn.addEventListener('click', () => editTask(taskItem, index));
            deleteBtn.addEventListener('click', () => {
                tasks.splice(index, 1);
                saveTasks();
                renderTasks(filter);
            });
        });

        taskCount.innerText = `Total Tasks: ${tasks.length}`;
    }

    function editTask(taskItem, index) {
        const task = tasks[index];
        taskInput.value = task.text;
        priorityInput.value = task.priority;
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
    }

    function filterTasks(event) {
        const filter = event.target.id.replace('filter-', '');
        renderTasks(filter);
    }

    renderTasks();
});
