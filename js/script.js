//GET
const fetchTasks = async () => { 
  const response = await fetch('http://localhost:3333/tasks');
  const tasks = await response.json();

  return tasks;
};

//POST
const addTasks = async (event) => { 
  event.preventDefault();

  const inputTask = document.querySelector('.input-task').value;
  const task = { title: inputTask };

  await fetch('http://localhost:3333/tasks', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task)
  });

  inputTask.value = '';
  loadTasks();
  alert("Nova tarefa criada com sucesso!");
}

//PUT
const updateTask = async ({id, title, status}) => {

  await fetch(`http://localhost:3333/tasks/${id}`, {
    method: 'put',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({title, status})
  });
  loadTasks();
  alert("Task alterada com sucesso!");
}

//DELETE
const deleteTask = async (id) => {
  await fetch(`http://localhost:3333/tasks/${id}`, {
    method: 'delete',
  });
  loadTasks();
  alert("Tarefa excluída com sucesso!");
}




/* ------------------- Funções Auxiliares ------------------- */

// carregar todas as tasks
const loadTasks = async () => {
  const tbody = document.querySelector('tbody');
  const tasks = await fetchTasks();

  const rows = tasks.map((task) => {
    const {id, title, created_at, status} = task;
    return createRow(id, title, created_at, status);
  })
  tbody.innerHTML = rows.join("");

}

// criar uma nova linha na tabela
const createRow = (id, title, created_at, status) => {

  const pendenteSelected = status === 'pentente' ? 'selected' : '';
  const concluidoSelected = status === 'concluido' ? 'selected' : '';
  const andamentoSelected = status === 'andamento' ? 'selected' : '';

  const row = `
    <tr id="row-${id}">
      <td>
        <p id="text-edit-${id}">${title}</p>
        <form id="form-edit-${id}" onSubmit="onSubmit(${this})" class="form-edit">
          <input value="${title}" id="input-edit-${id}"/>
          <button type="button"  class="btn-action" onClick="onSubmit(${id},'${status}')">
          <span class="material-symbols-outlined"> done </span>
        </button>
        </form>
      </td>
      <td>${formatDate(created_at)}</td>
      <td>
        <select onChange="editStatus(${id}, '${title}')" id="select-${id}">
          <option value="pendente" ${pendenteSelected}>Pendente</option>
          <option value="em-andamento" ${andamentoSelected}>Em andamento</option>
          <option value="concluido" ${concluidoSelected}>Concluído</option>
        </select>
      </td>
      <td>
        <button type="button" class="btn-action" onClick="editTask(${id})">
          <span class="material-symbols-outlined"> edit </span>
        </button>
        <button type="button"  class="btn-action" onClick="deleteTask(${id})">
          <span class="material-symbols-outlined"> delete </span>
        </button>
      </td>
    </tr>`;

  return row;
}

// formatar data de criação
const formatDate = (dateUTC) => {
  const option = { dateStyle: 'long', timeStyle: 'short'}
  const date = new Date(dateUTC).toLocaleString('pt-br', option);
  return date;
}

// alterar status
const editStatus = async (id, title) => {
  const status = document.querySelector(`#select-${id}`).value;

  const task = { id, title, status}
  await updateTask(task);
}

// ação botão editar
const editTask = (id) => {
  document.getElementById(`form-edit-${id}`).style.display = "flex";
  document.getElementById(`text-edit-${id}`).style.display = "none";
}

// ação botão de salvar
const onSubmit = async (id, status) => {
  const title = document.querySelector(`#input-edit-${id}`).value;
  
  const task = { id, title, status};
  await updateTask(task);

  document.getElementById(`form-edit-${id}`).style.display = "none";
  document.getElementById(`text-edit-${id}`).style.display = "block";
}

document.querySelector('.add-form').addEventListener('submit', addTasks);
loadTasks();