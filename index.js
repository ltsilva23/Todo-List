const form = document.querySelector('#todo-form');
const taskTitleInput = document.querySelector('#task-title-input');
const taskDescriptionInput = document.querySelector('#task-description-input');
const taskStartDateInput = document.querySelector('#task-start-date');
const taskEndDateInput = document.querySelector('#task-end-date');
const todoListUl = document.querySelector('#todo-list');

let tasks = [];

// Função para validar se a tarefa já existe
function validateTaskExists(title, startDate) {
    return tasks.some(task => task.title === title && task.startDate === startDate);
}

// Função para validar se a tarefa é válida
function validateTask(title, startDate, endDate) {
    if (title.trim().length < 3) {
        alert('O título precisa ter pelo menos 3 caracteres.');
        return false;
    }

    if (!startDate || !endDate) {
        alert('A data de início e fim são obrigatórias.');
        return false;
    }

    if (new Date(startDate) > new Date(endDate)) {
        alert('A data de início não pode ser maior que a data de fim.');
        return false;
    }

    return true;
}

// Função para renderizar as tarefas no HTML
function renderTasksHTML(task) {
    const li = document.createElement('li');
    const input = document.createElement('input');
    const titleDiv = document.createElement('div');
    const descriptionDiv = document.createElement('div');
    const datesDiv = document.createElement('div');
    const buttonDiv = document.createElement('div'); 
    const spanTitle = document.createElement('span');
    const spanDescription = document.createElement('span');
    const spanStartDate = document.createElement('span');
    const spanEndDate = document.createElement('span');
    const removeButton = document.createElement('button');
    const editButton = document.createElement('button');
    
    // Adicionar checkbox
    input.setAttribute('type', 'checkbox');
    input.checked = task.done;
    input.addEventListener('change', (event) => {
        const liToToggle = event.target.parentElement;
        const spanTitleToToggle = liToToggle.querySelector('.title');
        const spanDescriptionToToggle = liToToggle.querySelector('.description');
        const spanStartDateToToggle = liToToggle.querySelector('.start-date');
        const spanEndDateToToggle = liToToggle.querySelector('.end-date');
        
        const done = event.target.checked;

        // Aplica o risco em todos os elementos
        spanTitleToToggle.style.textDecoration = done ? 'line-through' : 'none';
        spanDescriptionToToggle.style.textDecoration = done ? 'line-through' : 'none';
        spanStartDateToToggle.style.textDecoration = done ? 'line-through' : 'none';
        spanEndDateToToggle.style.textDecoration = done ? 'line-through' : 'none';

        tasks = tasks.map(t => {
            if (t.title === task.title) {
                return { ...t, done: done }; // Atualiza a tarefa no estado
            }
            return t;
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    });

    // Adicionar título
    spanTitle.textContent = `Tarefa: ${task.title}`;
    spanTitle.classList.add('title'); // Adicionando uma classe para facilitar o acesso ao título
    titleDiv.appendChild(spanTitle);

    // Adicionar descrição
    spanDescription.textContent = ` Descrição: ${task.description}`;
    spanDescription.classList.add('description'); // Adicionando uma classe para facilitar o acesso à descrição
    descriptionDiv.appendChild(spanDescription);

    // Adicionar datas
    spanStartDate.textContent = `Início: ${task.startDate} |`;
    spanStartDate.classList.add('start-date'); // Adicionando uma classe para facilitar o acesso à data de início
    spanEndDate.textContent = `Fim: ${task.endDate}`;
    spanEndDate.classList.add('end-date'); // Adicionando uma classe para facilitar o acesso à data de fim
    datesDiv.appendChild(spanStartDate);
    datesDiv.appendChild(spanEndDate);

    // Aplicar o risco (line-through) se a tarefa estiver marcada como "done"
    if (task.done) {
        spanTitle.style.textDecoration = 'line-through';
        spanDescription.style.textDecoration = 'line-through';
        spanStartDate.style.textDecoration = 'line-through';
        spanEndDate.style.textDecoration = 'line-through';
    }

    // Botão de remover
    removeButton.innerHTML = '<i class="fa fa-trash"></i>';
    removeButton.addEventListener('click', () => {
        tasks = tasks.filter(t => t.title !== task.title);
        todoListUl.removeChild(li);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    });

    // Botão de editar
    editButton.innerHTML = '<i class="fa fa-edit"></i>';
    editButton.addEventListener('click', () => {
        taskTitleInput.value = task.title;
        taskDescriptionInput.value = task.description;
        taskStartDateInput.value = task.startDate;
        taskEndDateInput.value = task.endDate;
        
        // Remover a tarefa do HTML para ser editada
        tasks = tasks.filter(t => t.title !== task.title);
        todoListUl.removeChild(li);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    });

    // Agrupando os botões em um div
    buttonDiv.appendChild(removeButton);
    buttonDiv.appendChild(editButton);

    // Organizando a estrutura
    li.appendChild(input);
    li.appendChild(titleDiv);
    li.appendChild(descriptionDiv);
    li.appendChild(datesDiv);
    li.appendChild(buttonDiv); // Adicionando o div com os botões
    todoListUl.appendChild(li);
}

// Carregar tarefas do localStorage ao iniciar a página
window.onload = () => {
    const tasksJSON = localStorage.getItem('tasks');
    if (tasksJSON) {
        tasks = JSON.parse(tasksJSON);
        tasks.forEach(renderTasksHTML); // Renderiza todas as tarefas no carregamento da página
    }
};

// Evento de envio do formulário
form.addEventListener('submit', (event) => {
    event.preventDefault();

    const title = taskTitleInput.value;
    const description = taskDescriptionInput.value;
    const startDate = taskStartDateInput.value;
    const endDate = taskEndDateInput.value;

    // Validar os campos
    if (!validateTask(title, startDate, endDate)) {
        return;
    }

    if (validateTaskExists(title)) {
        alert('Já existe uma tarefa com esse título.');
        return;
    }

    const newTask = {
        title,
        description,
        startDate,
        endDate,
        done: false,
    };

    tasks.push(newTask);
    localStorage.setItem('tasks', JSON.stringify(tasks));

    renderTasksHTML(newTask);

    // Limpar os campos após adicionar a tarefa
    taskTitleInput.value = '';
    taskDescriptionInput.value = '';
    taskStartDateInput.value = '';
    taskEndDateInput.value = '';
});
