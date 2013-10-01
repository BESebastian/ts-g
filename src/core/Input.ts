class Input {

    private keys;

    constructor() {
        this.keys = [];
        document.addEventListener('keydown', this.keyDown.bind(this), false);
        document.addEventListener('keyup', this.keyUp.bind(this), false);
    }

    private keyDown(event):void {
        event.preventDefault();
        this.keys[event.keyCode] = true;
    }

    private keyUp(event):void {
        event.preventDefault();
        this.keys[event.keyCode] = false;
    }

    public isPressed(keyCode):boolean {
        return this.keys[keyCode];
    }

}
