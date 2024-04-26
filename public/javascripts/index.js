const insertTodoInList = (todo) => {
    if (todo.text) {
        const copy = document.getElementById("todo_template").cloneNode()
        copy.removeAttribute("id") // otherwise this will be hidden as well
        copy.innerText = todo.text
        copy.setAttribute("data-todo-id", todo.id)

        // Insert sorted on string text order - ignoring case
        const todolist = document.getElementById("todo_list")
        const children = todolist.querySelectorAll("li[data-todo-id]")
        let inserted = false
        for (let i = 0; (i < children.length) && !inserted; i++) {
            const child = children[i]
            const copy_text = copy.innerText.toUpperCase()
            const child_text = child.innerText.toUpperCase()
            if (copy_text < child_text) {
                todolist.insertBefore(copy, child)
                inserted = true
            }
        }
        if (!inserted) { // Append child
            todolist.appendChild(copy)
        }
    }
}