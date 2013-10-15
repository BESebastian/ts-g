class Input {

    private keys;
    private reserved;

    constructor() {
        this.keys = [];
        this.reserved = [65, 68, 83, 87, 37, 39, 38, 40];
        document.addEventListener('keydown', this.keyDown.bind(this), false);
        document.addEventListener('keyup', this.keyUp.bind(this), false);
    }

    private inReserved(code):boolean {
        return (this.reserved.indexOf(code) !== -1);
    }

    private keyDown(event):void {
        if (this.inReserved(event.keyCode)) {
            event.preventDefault();
        }
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
