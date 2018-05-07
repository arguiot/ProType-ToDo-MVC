const P = new ProType();

class MainView extends P.ViewController {
	willShow() {
		this.g = this.mountGroup(
			this.view.querySelector(".todoapp"),
			ToDo
		)
	}
}

P.autoMount(MainView)

P.set("main")
