class ToDo extends P.Group {
	init() {
		this.state = {
			todos: [],
			page: 0
		}
		if (!localStorage.getItem("todo")) {
			localStorage.setItem("todo", JSON.stringify(this.state))
		} else {
			this.state = JSON.parse(localStorage.getItem("todo"))
		}

		this._addEventListener()
	}
	changeHandler() {
		if (this.state.todos.length > 0) {
			this.group.querySelector(".main").style.display = "block";
			this.renderToDos()
		} else {
			this.group.querySelector(".main").style.display = "none";
		}
	}

	_addEventListener() {
		let input = this.group.querySelector(".new-todo")
		input.addEventListener("change", e => {
			const todos = this.state.todos
			todos.unshift({
				content: input.value,
				active: true
			})
			input.value = ""
			this.state = {
				todos: todos,
				page: this.state.page
			}
			this.changeHandler()
		})

		const a = this.group.querySelectorAll(".filters > li > a")
		a.forEach(el => {
			el.addEventListener("click", e => {
				const target = e.target.innerHTML
				let page;
				switch (target) {
					case "All":
						page = 0
						break;
					case "Active":
						page = 1
						break;
					case "Completed":
						page = 2
						break;
				}
				this.state = {
					todos: this.state.todos,
					page: page
				}
				this.changeHandler()
				this.group.querySelector(".selected").classList.remove("selected")
				e.target.classList.add("selected")
			})
		})
		this.group.querySelector(".clear-completed").addEventListener("click", e => {
			for (let i = this.state.todos.length - 1; i > -1 ; i--) {
				if (!this.state.todos[i].active) {
					this.state.todos.splice(i, 1)
				}
			}
			this.changeHandler()
		})
		this.group.querySelector(".toggle-all").addEventListener("click", e => {
			for (let i = 0; i < this.state.todos.length; i++) {
				this.state.todos[i].active = !e.target.checked
			}
			this.changeHandler()
		})
		window.addEventListener("beforeunload", e => {
			localStorage.setItem("todo", JSON.stringify(this.state))
		})
		this.changeHandler()
	}

	renderToDos() {
		const todos = this.state.todos;
		const list = this.group.querySelector(".todo-list")
		list.innerHTML = "";
		for (let i = 0; i < todos.length; i++) {
			const t = todos[i]
			const html = `
			<li class="todos ${t.active ? "" : "completed"}" i="${i}">
				<div class="view">
					<input class="toggle" type="checkbox" ${t.active ? "" : "checked"}>
					<label>${t.content}</label>

					<button class="destroy"></button>
				</div>
				<input class="edit" value="${t.content}">
			</li>`
			if (t.active === false && this.state.page == 2) {
				list.innerHTML += html
			} else if (t.active === true && this.state.page == 1) {
				list.innerHTML += html
			} else if (this.state.page == 0){
				list.innerHTML += html
			}
		}
		this.listenEl()
	}
	listenEl() {
		const list = this.group.querySelectorAll(".todo-list > li")
		list.forEach(el => {
			el.querySelector(".toggle").addEventListener("click", e => {
				const checked = e.target.checked
				const i = parseInt(e.target.parentNode.parentNode.getAttribute("i"))
				const state = checked ? false : true
				this.state.todos[i].active = state
				this.changeHandler()
			})
			el.querySelector(".destroy").addEventListener("click", e => {
				const i = parseInt(e.target.parentNode.parentNode.getAttribute("i"))
				this.state.todos.splice(i, 1)
				this.changeHandler()
			})
			el.addEventListener("dblclick", e => {
				const target = e.currentTarget
				const view = target.querySelector(".view")
				view.style.display = "none";
				const input = target.querySelector(".edit")
				input.style.display = "block"
				input.value = view.querySelector("label").innerHTML
				input.addEventListener("keypress", e => {
					if (e.which == 13 || e.keyCode == 13) {
						const i = parseInt(target.getAttribute("i"))
						this.state.todos[i].content = input.value;
						this.changeHandler()
					}
				})
			})
		})
	}
}
