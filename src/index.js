import './style.css';

const todoinput = document.getElementById("input");
const addbutton = document.getElementById("addpro");
const projects = document.getElementById("project");

// Load projects from local storage
document.addEventListener('DOMContentLoaded', () => {
  const storedProjects = JSON.parse(localStorage.getItem('projects')) || [];
  storedProjects.forEach(projectData => loadProjectFromStorage(projectData));
});

// Function to save projects to local storage
function saveProjectsToLocalStorage() {
  const projectsData = [];
  document.querySelectorAll('.project').forEach(projectDiv => {
    const projectData = {
      name: projectDiv.querySelector('h3').textContent,
      todos: []
    };
    projectDiv.querySelectorAll('.todo-item').forEach(todoDiv => {
      projectData.todos.push({
        title: todoDiv.querySelector('h4').textContent,
        description: todoDiv.querySelector('textarea').value,
        dueDate: todoDiv.querySelector('input[type="date"]').value,
        priority: todoDiv.querySelector('select').value,
        notes: todoDiv.querySelector('textarea').value,
      });
    });
    projectsData.push(projectData);
  });
  localStorage.setItem('projects', JSON.stringify(projectsData));
}

// Function to load a project from storage
function loadProjectFromStorage(projectData) {
  const projectDiv = createProjectElement(projectData.name);
  projectData.todos.forEach(todoData => addTodoToProject(projectDiv, todoData));
  projects.appendChild(projectDiv);
}

function addproject() {
  const projectname = todoinput.value.trim();
  if (projectname !== "") {
    const projectDiv = createProjectElement(projectname);
    projects.appendChild(projectDiv);
    todoinput.value = '';
    saveProjectsToLocalStorage();
  } else {
    alert("Please enter a project name");
  }
}

function createProjectElement(projectname) {
  const projectDiv = document.createElement("div");
  projectDiv.classList.add('project');

  const projectTitle = document.createElement("h3");
  projectTitle.textContent = projectname;

  const projectInput = document.createElement("input");
  const projectButton = document.createElement("button");
  projectInput.placeholder = `add a to do ${projectname}`;
  projectButton.textContent = 'Add To-Do';

  const todolist = document.createElement("ul");
  projectDiv.appendChild(projectTitle);
  projectDiv.appendChild(projectInput);
  projectDiv.appendChild(projectButton);
  projectDiv.appendChild(todolist);

  projectButton.addEventListener('click', () => addTodoToProject(projectDiv));
  projectInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') addTodoToProject(projectDiv); });

  return projectDiv;
}

function addTodoToProject(projectDiv, todoData = {}) {
  const projectInput = projectDiv.querySelector("input");
  const text = todoData.title || projectInput.value.trim();

  if (text !== "") {
    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo-item");

    const title = document.createElement("h4");
    title.textContent = text;

    const description = document.createElement("textarea");
    description.placeholder = 'Description';
    description.value = todoData.description || '';

    const duedate = document.createElement("input");
    duedate.type = "date";
    duedate.value = todoData.dueDate || '';

    const prioritySelect = document.createElement("select");
    ["Low", "Medium", "High"].forEach(priority => {
      const option = document.createElement("option");
      option.value = priority;
      option.textContent = priority;
      if (priority === todoData.priority) option.selected = true;
      prioritySelect.appendChild(option);
    });

    const notesInput = document.createElement("textarea");
    notesInput.placeholder = "Notes";
    notesInput.value = todoData.notes || '';

    todoDiv.appendChild(title);
    todoDiv.appendChild(description);
    todoDiv.appendChild(duedate);
    todoDiv.appendChild(prioritySelect);
    todoDiv.appendChild(notesInput);

    projectDiv.querySelector("ul").appendChild(todoDiv);
    projectInput.value = '';

    saveProjectsToLocalStorage();
  } else {
    alert("Please add the to-do");
  }
}

addbutton.addEventListener('click', addproject);
todoinput.addEventListener('keydown', (e) => { if (e.key === 'Enter') addproject(); });
