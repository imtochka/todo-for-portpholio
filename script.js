AColorPicker.from(".picker").on("change", (picker, color) => {
  document.body.style.backgroundColor = color;
});

let input = document.querySelector(".input");
add = document.querySelector(".add_button");
todo = document.querySelector(".main_block");
trashTodo = document.querySelector(".main_trash");
todoList = [];
colorList = [];

palette = document.querySelector(".palette-svg");
trash = document.querySelector(".trash-svg");
colorOne = "";
colorTwo = "";

if (localStorage.getItem("todo")) {
  todoList = JSON.parse(localStorage.getItem("todo"));
  howToBildRefresh();
}

if (localStorage.getItem("color")) {
  colorList = JSON.parse(localStorage.getItem("color"));
  console.log(colorList);
  colorOne = colorList.colorOne;
  colorTwo = colorList.colorTwo;
  coloristics();
} else {
  console.log("нет цвета в локалке");
  colorOne = "#998bff";
  colorTwo = "#8eedff";
  let colorObj = {
    colorOne: colorOne,
    colorTwo: colorTwo,
  };
  colorList = colorObj;
  localStorage.setItem("color", JSON.stringify(colorList));
  coloristics();
}

add.addEventListener("click", function () {
  let newTodo = {
    todo: input.value.trim(),
    id: Math.abs(String(input.value + new Date().getTime()).hashCode()),
    active: false,
    trash: false,
  };
  input.value = "";
  todoList.push(newTodo);
  howToBild(newTodo.id, newTodo.todo, newTodo.active, newTodo.trash);

  localStorage.setItem("todo", JSON.stringify(todoList));
});

function howToBild(id, todo, active, trash) {
  if (trash === false) {
    const div = document.createElement("div");
    const text = document.createElement("input");
    const line = document.createElement("div");
    const btn = document.createElement("div");
    const del = document.createElement("button");
    const done = document.createElement("button");

    line.className = "line";
    text.className = "text";
    text.value = todo;
    div.className = "block";
    btn.className = "btn";
    del.className = "del";
    del.innerHTML = "✕";
    done.className = "done";
    done.innerHTML = "✓";
    div.id = id;

    div.prepend(text);
    div.append(btn);
    btn.append(line);
    btn.prepend(del);
    btn.append(done);
    del.addEventListener("click", function (el) {
      todoList.find((item) => {
        // item.id == id;
        if (item.id == id) {
          if (item.trash === false) {
            item.trash = true;
            div.remove();
            howToBild(id, todo, active, item.trash);
          }
        }

        //проверка тот ли это элемент по клику
      });

      // localStorage.setItem("todo", JSON.stringify(todo));
      // todoList = todoList.filter((item) => item.id !== id);
      localStorage.setItem("todo", JSON.stringify(todoList));
    });

    done.addEventListener("click", function (el) {
      div.classList.toggle("active");
      // localStorage.setItem("active", JSON.stringify(todoList));
      todoList.find((item) => {
        // item.id == id;
        if (item.id == id) {
          if (item.active == false) {
            item.active = true;
          } else {
            item.active = false;
          }
        }

        //проверка тот ли это элемент по клику
      });
      localStorage.setItem("todo", JSON.stringify(todoList)); //сохранение класса эктив в ЛОКАЛКЕ
    });

    if (todo) {
      main_block.append(div);
      if (active) {
        div.classList.add("active");
      }
    }

    text.addEventListener("input", function (el) {
      todoList.find((item) => {
        // item.id == id;
        if (item.id == id) {
          item.todo = el.target.value;
        }
        //проверка редактирвоания
      });
      localStorage.setItem("todo", JSON.stringify(todoList));
    });
  } else if (trash === true) {
    const div = document.createElement("div");
    const text = document.createElement("input");
    const line = document.createElement("div");
    const btn = document.createElement("div");
    const del = document.createElement("button");
    const back = document.createElement("button");

    line.className = "trash-line";
    text.className = "trash-text";
    text.value = todo;
    div.className = "trash-block";
    btn.className = "trash-btn";
    del.className = "trash-del";
    del.innerHTML = "✕";
    back.className = "trash-back";
    back.innerHTML = "↻";

    div.prepend(text);
    div.append(btn);
    btn.append(line);
    btn.prepend(del);
    btn.append(back);

    if (trashTodo) {
      trashTodo.prepend(div);
    }

    document
      .querySelector(".trash-del")
      .addEventListener("click", function (el) {
        todoList.find((item, index) => {
          if (item.id == id) {
            div.remove();
            console.log(item);
            todoList.splice(index, 1); // удалить элемент с найденным индексом из массива
            return true; // завершить поиск
          }
        });

        todoList.forEach((el) => {
          if (el.todo.length < 1) {
            delete todoList.el;
          }
        });
        localStorage.setItem("todo", JSON.stringify(todoList)); //сохранение класса эктив в ЛОКАЛКЕ
      });

    text.addEventListener("input", function (el) {
      todoList.find((item) => {
        // item.id == id;
        if (item.id == id) {
          item.todo = el.target.value;
        }
        //проверка редактирвоания
      });
      localStorage.setItem("todo", JSON.stringify(todoList));
    });

    back.addEventListener("click", function (el) {
      todoList.find((item) => {
        if (item.id == id) {
          if (item.trash === true) {
            item.trash = false;
            div.remove();

            todoList.push(todoList.splice(todoList.indexOf(item), 1)[0]);
            howToBild(id, todo, active, item.trash);
          }
        }
        //проверка тот ли это элемент по клику
      });
      localStorage.setItem("todo", JSON.stringify(todoList));
    });
  }

  String.prototype.hashCode = function () {
    var hash = 0,
      i = 0,
      len = this.length;
    while (i < len) {
      hash = ((hash << 5) - hash + this.charCodeAt(i++)) << 0;
    }
    return hash;
  };
  coloristics();
}

function howToBildRefresh() {
  todoList.forEach((el) => {
    howToBild(el.id, el.todo, el.active, el.trash);
  });
}

String.prototype.hashCode = function () {
  var hash = 0,
    i = 0,
    len = this.length;
  while (i < len) {
    hash = ((hash << 5) - hash + this.charCodeAt(i++)) << 0;
  }
  return hash;
};

document.addEventListener("keydown", function (e) {
  if (e.keyCode == 13 && e.target.className !== "add_button") {
    let newTodo = {
      todo: input.value,
      id: Math.abs(String(input.value + new Date().getTime()).hashCode()),
      active: false,
      trash: false,
    };
    input.value = "";
    todoList.push(newTodo);
    howToBild(newTodo.id, newTodo.todo, newTodo.active, newTodo.trash);
    localStorage.setItem("todo", JSON.stringify(todoList));
  }
}); //ДОБАВИТЬ ПО ENTER

palette.addEventListener("click", function () {
  document.getElementById("color").classList.toggle("hidden");
  document.getElementById("save-color").classList.toggle("hidden");
});

trash.addEventListener("click", function () {
  document.getElementById("trash").classList.toggle("hidden");
  document.getElementById("color").classList.add("hidden");
  document.getElementById("save-color").classList.add("hidden");
});

document.getElementById("trash-esc").addEventListener("click", () => {
  document.getElementById("trash").classList.add("hidden");
  document.getElementById("trash").classList.add("hidden");
});

function howToColorTrash() {
  document.querySelector(
    ".trash-text"
  ).style.background = `linear-gradient(to right, ${colorOne}, ${colorTwo})`;
}

function changeGradientColor() {
  document.querySelector(".color-one").style.background = colorOne;

  document.querySelector(".color-two").style.background = colorTwo;

  document.querySelector(
    ".body-background"
  ).style.background = `linear-gradient(to right, ${colorOne}, ${colorTwo})`;

  localStorage.setItem("color", JSON.stringify(colorList));
}

document.querySelector(".color-block").addEventListener("click", (event) => {
  if (event.target.classList.contains("color-one")) {
    colorOne = document.querySelector('[nameref="RGBHEX"]').value;

    colorList.colorOne = colorOne;

    changeGradientColor();
  }
  if (event.target.classList.contains("color-two")) {
    colorTwo = document.querySelector('[nameref="RGBHEX"]').value;
    colorList.colorTwo = colorTwo;

    changeGradientColor();

    // todolist.push(newTodo);
    // localStorage.setItem(".color-two", JSON.stringify(todoList));
  }
});

function coloristics(colorTwo) {
  document.querySelector(
    ".body-background"
  ).style.background = `linear-gradient(to right, ${colorList.colorOne}, ${colorList.colorTwo})`;
  document.querySelector(".color-one").style.background = colorList.colorOne;
  document.querySelector(".color-two").style.background = colorList.colorTwo;

  const trashDelList = document.querySelectorAll(".trash-del");
  const trashLineList = document.querySelectorAll(".trash-line");
  const trashBackList = document.querySelectorAll(".trash-back");
  const trashTextList = document.querySelectorAll(".trash-text");
  trashTextList.forEach((trashText) => {
    trashText.style.background = `linear-gradient(to right, ${colorList.colorOne}, ${colorList.colorTwo})`;
  });

  trashDelList.forEach((item) => {
    item.style.color = colorList.colorTwo;
  });

  trashLineList.forEach((item) => {
    item.style.backgroundColor = colorList.colorTwo;
  });

  trashBackList.forEach((item) => {
    item.style.color = colorList.colorTwo;
  });
}

function colorEvent() {
  document.getElementById("save-color").addEventListener("click", (el) => {
    if (el.target == document.querySelector(".save-color1")) {
      (colorList.colorOne = "#998bff"), (colorList.colorTwo = "#8eedff");
      console.log("1");
    }
    if (el.target == document.querySelector(".save-color2")) {
      (colorList.colorOne = "#ffad98"), (colorList.colorTwo = "#fffb93");
      console.log("2");
    }
    if (el.target == document.querySelector(".save-color3")) {
      (colorList.colorOne = "#ffa8a8"), (colorList.colorTwo = "#fca0ff");
      console.log("3");
    }
    if (el.target == document.querySelector(".save-color4")) {
      (colorList.colorOne = " #414141"), (colorList.colorTwo = "#ebebeb");

      console.log("4");
    }
    coloristics();
    localStorage.setItem("color", JSON.stringify(colorList));
  });
}
colorEvent();

// document.querySelector(".threebars").addEventListener("click", (el) => {
//   document.getElementById("mobile-menu").classList.toggle("hidden");
// });
// document.querySelector(".menu-esc").addEventListener("click", (el) => {
//   document.getElementById("mobile-menu").classList.add("hidden");
// });
