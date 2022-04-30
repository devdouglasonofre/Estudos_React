import React, { useState } from "react";
import ReactDOM from "react-dom/client";

function Todo(props) {
  const [todo, setToDo] = useState(props.todo.content);
  const [editMode, setEditMode] = useState(false);

  function handleUpdate(todo) {
    props.onUpdate(todo, todo);
  }

  function toggleEditMode(value) {
    setEditMode(value);
  }

  function saveEdit(e, todo) {
    if (e.key === "Enter") {
      toggleEditMode(false);
      handleUpdate(todo);
    }
  }

  return (
    <div>
      <input
        type="checkbox"
        checked={props.todo.isFinished}
        onChange={(e) => props.onChange(e.target.checked, props.todo)}
      />
      {!editMode ? (
        <label onClick={() => toggleEditMode(true)}>{todo}</label>
      ) : (
        <input
          type="text"
          onKeyDown={(e) => saveEdit(e, props.todo)}
          onChange={(e) => setToDo(e.target.value)}
          value={todo}
        />
      )}

      <button type="button" onClick={() => props.delete(props.todo)}>
        Delete
      </button>
    </div>
  );
}

function CreateTodoField(props) {
  const [todoContent, setToDo] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    setToDo("");
    props.onSubmit(todoContent);
  }

  return (
    <form onSubmit={(e) => handleSubmit(e)}>
      <input
        type="text"
        onChange={(e) => setToDo(e.target.value)}
        value={todoContent}
      />
      <button type="submit">Create Task</button>
    </form>
  );
}

function Home() {
  const [todoList, setTodoList] = useState([]);
  const [doneList, setDoneList] = useState([]);

  function handleTodoCheck(value, todo) {
    let todoListFresh = todoList.slice();
    let doneListFresh = doneList.slice();
    if (value) {
      todoListFresh[todo.id] = null;
      doneListFresh[todo.id] = todo;
      doneListFresh[todo.id].isFinished = true;
    } else {
      doneListFresh[todo.id] = null;
      todoListFresh[todo.id] = todo;
      todoListFresh[todo.id].isFinished = false;
    }
    setDoneList(doneListFresh);
    setTodoList(todoListFresh);
  }

  function updateTodo(todo, content) {
    let todoListFresh = todoList.slice();
    let doneListFresh = doneList.slice();
    if (!todo.isFinished) {
      todoListFresh[todo.id].content = content;
    } else {
      doneListFresh[todo.id].content = content;
    }
    setDoneList(doneListFresh);
    setTodoList(todoListFresh);
  }

  function createTodo(content) {
    let todoListFresh = todoList.slice();
    let newTodo = {
      id: todoListFresh.length,
      content: content,
      isFinished: false,
    };
    todoListFresh.push(newTodo);
    setTodoList(todoListFresh);
  }

  function deleteTodo(todo) {
    let todoListFresh = todoList.slice();
    let doneListFresh = doneList.slice();
    if (!todo.isFinished) {
      todoListFresh[todo.id] = null;
    } else {
      doneListFresh[todo.id] = null;
    }
    setDoneList(doneListFresh);
    setTodoList(todoListFresh);
  }

  return (
    <div>
      <h1>To Do</h1>
      {todoList.map((todo) => {
        return (
          todo &&
          <Todo
            key={todo.id}
            todo={todo}
            onChange={(e) => handleTodoCheck(e, todo)}
            delete={deleteTodo}
            onUpdate={updateTodo}
          />
        );
      })}
      <h1>Done</h1>
      {doneList.map((item) => {
          return (
            item &&
            <Todo
              key={item.id}
              todo={item}
              onChange={(e) => handleTodoCheck(e, item)}
              delete={deleteTodo}
              onUpdate={updateTodo}
            />
          );
      })}
      <hr />
      <CreateTodoField onSubmit={createTodo} />
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Home />);
