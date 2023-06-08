import { useState, useEffect } from "react";
import "./App.css";

const API_BASE = "http://localhost:3001";

function App() {
  const [todos, setTodos] = useState([]);
  const [popupActive, setPopupActive] = useState(false);
  const [newTodo, setNewTodo] = useState("");
  const [updatedTodo, setUpdatedTodo] = useState("");
  const [updatePopup, setUpdatePopup] = useState(false);
  const [updateTodoId,setUpdateTodoId]=useState(null)

  useEffect(() => {
    GetTodos();
  }, [todos]);

  const GetTodos = () => {
    fetch(API_BASE + "/todos")
      .then((res) => res.json())
      .then((data) => setTodos(data))
      .catch((err) => console.error("Error:", err));
  };
  const completeTodo = async (id) => {
    const data = await fetch(API_BASE + "/todo/complete/" + id).then((res) =>
      res.json()
    );

    setTodos((todos) =>
      todos.map((todo) => {
        if (todo._id === data._id) {
          todo.complete = data.complete;
        }
        return todo;
      })
    );
  };
  const deleteTodo = async (id) => {
    const data = await fetch(API_BASE + "/todo/delete/" + id, {
      method: "DELETE",
    }).then((res) => res.json());
    setTodos((todos) => todos.filter((todo) => todo._id !== data._id));
  };

  const addTodo = async () => {
    const data = await fetch(API_BASE + "/todo/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: newTodo,
      }),
    }).then((res) => res.json());
    setNewTodo("");
    setTodos([...todos, data]);
    setPopupActive(false);
  };
  const openUpdatePopup=(id)=>{
       setUpdateTodoId(id);
       setUpdatedTodo('')
       setUpdatePopup(true)
  }
  const updateTodo = async () => {
    const data = await fetch(API_BASE + "/todos/updated/" + updateTodoId, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: updatedTodo,
      }),
    }).then((res) => res.json());

    setTodos((todos) =>
      todos.map((todo) => {
        if (todo._id === data._id) {
          todo.text = data.text;
        }
        return todo;
      })
    );
     setUpdatePopup(false)
  };

  return (
    <div className="App">
      <h1>Welcome </h1>
      <h2>Your tasks</h2>
      <div className="todos">
        {todos.map((todo) => (
          <div
            className={"todo " + (todo.complete ? "is-complete" : "")}
            key={todo._id}
          >
            <div
              className="checkbox"
              onClick={() => completeTodo(todo._id)}
            ></div>
            <div className="text">{todo.text}</div>
            <button
              className="update-todo"
              onClick={() => {
                openUpdatePopup(todo._id)
              }}
            >
              Update
            </button>
            <div className="delete-todo" onClick={() => deleteTodo(todo._id)}>
              x
            </div>
          </div>
        ))}
      </div>
      <div className="addPopup" onClick={() => setPopupActive(true)}>
        +
      </div>
      {popupActive ? (
        <div className="popup">
          <div className="closePopup" onClick={() => setPopupActive(false)}>
            x
          </div>
          <div className="content">
            <h3>Add Task</h3>
            <input
              type="text"
              className="add-todo-input"
              onChange={(e) => setNewTodo(e.target.value)}
              value={newTodo}
            ></input>
            <button className="button" onClick={addTodo}>
              Create Task
            </button>
          </div>
        </div>
      ) : (
        ""
      )}
      {updatePopup ? (
        <div className="popup">
          <div className="closePopup" onClick={() => setUpdatePopup(false)}>
            x
          </div>
          <div className="content">
            <h3>Add Task</h3>
            <input
              type="text"
              className="add-todo-input"
              onChange={(e) => setUpdatedTodo(e.target.value)}
              value={updatedTodo}
            ></input>
            <button className="button" onClick={updateTodo}>
              Update Task
            </button>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default App;
