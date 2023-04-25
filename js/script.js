const toastLiveExample = document.getElementById('toast');
const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);

//GET
const fetchTasks = async () => { 
  const response = await fetch('http://localhost:3333/tasks');
  const tasks = await response.json();

  return tasks;
};

//POST
const addTasks = async () => { 
  const inputTask = document.querySelector('#input-task').value;
  const task = { title: inputTask };

  await fetch('http://localhost:3333/tasks', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task)
  }).then((response) => {
    if(response.ok){
      fetchTasks()
      loadTasks();
      messageToast('create');
      document.querySelector('#input-task').value = '';
    } else {
      messageToast('error');
      console.log(error.statusText);
    }
  }).catch(() => {
    console.log('error');
  });
}

//PUT
const updateTask = async ({id, title, status}) => {

  await fetch(`http://localhost:3333/tasks/${id}`, {
    method: 'put',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({title, status})
  }).then((response) => {
    if(response.ok){
      loadTasks();
      messageToast('edit');
    } else {
      messageToast('error');
    }
  }).catch(()=> {
    console.log('error');
  })

}

//DELETE
const deleteTask = async (id) => {
  await fetch(`http://localhost:3333/tasks/${id}`, {
    method: 'delete',
  }).then((response) => {
    if(response.ok){
      loadTasks();
      messageToast('delete');
    } else {
      messageToast('error');
    }
  }).catch(() => {
    console.log('error');
  })
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
  const progressoSelected = status === 'progresso' ? 'selected' : '';

  const statusColor = {
    pendente: "text-bg-warning",
    concluido: "text-bg-success",
    progresso: "text-bg-primary",
  }

  const row = `
    <tr id="row-${id}">
      <td>
        <p id="text-edit-${id}">${title}</p>
        <form id="form-edit-${id}" onSubmit="onSubmit(${id},'${status}')" class="row g-3 form-edit">
          <div class="col-auto">
            <input class="form-control form-control-sm" value="${title}" id="input-edit-${id}"/>
          </div>
        </form>
      </td>
      <td>
        <select class="form-control form-control-sm select-status" onChange="editStatus(${id}, '${title}')" id="select-${id}">
          <option value="pendente" ${pendenteSelected}>Pendente</option>
          <option value="progresso" ${progressoSelected}>Progresso</option>
          <option value="concluido" ${concluidoSelected}>Concluído</option>
        </select>
        <p class="badge ${statusColor[status]} text-capitalize fw-bold" id="tag-${id}">${status}</p>
      </td>
      <td>
        ${formatDate(created_at)}
      </td>
      
      <td>
        <button type="button" class="btn btn-primary btn-sm" onClick="editTask(${id})" title="Editar">
          <span class="material-symbols-outlined icon-table"> edit </span>
        </button>
        <button type="button"  class="btn btn-danger btn-sm" onClick="deleteTask(${id})" title="Excluir">
          <span class="material-symbols-outlined icon-table"> delete </span>
        </button>
      </td>
    </tr>`;

  return row;
}

// formatar data de criação
const formatDate = (dateUTC) => {
  const option = { dateStyle: 'short'}
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
  document.getElementById(`form-edit-${id}`).classList.toggle('formEditFlex');
  document.getElementById(`text-edit-${id}`).classList.toggle('formEditNone');

  document.getElementById(`select-${id}`).classList.toggle('formEditFlex');
  document.getElementById(`tag-${id}`).classList.toggle('formEditNone');
}

// ação botão de salvar
const onSubmit = async (id, status) => {
  const title = document.querySelector(`#input-edit-${id}`).value;
  
  const task = { id, title, status};
  await updateTask(task);

  document.getElementById(`form-edit-${id}`).classList.toggle('formEditNone');
  document.getElementById(`text-edit-${id}`).classList.toggle('formEditFlex');

  document.getElementById(`select-${id}`).classList.toggle('formEditNone');
  document.getElementById(`tag-${id}`).classList.toggle('formEditFlex');
}

// mensagem personalizada 
const messageToast = (status) => {
  const message = {
    error: 'Ocorreu um erro inesperado!',
    create: 'Nova tarefa criada com sucesso!',
    delete: 'Tarefa excluída com sucesso!',
    edit: 'Tarefa editada com sucesso!'
  }

  document.querySelector('#message-task').innerHTML = message[status];

  if(status === 'error'){
    document.querySelector('#toast').classList.remove('bg-success');
    document.querySelector('#toast').classList.add('bg-danger');
  } else {
    document.querySelector('#toast').classList.add('bg-success');
    document.querySelector('#toast').classList.remove('bg-danger');
  }
  toastBootstrap.show();
}

document.querySelector('#add-form').addEventListener('submit', addTasks);
loadTasks();