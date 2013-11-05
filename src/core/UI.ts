class UI {

    private canvas:     HTMLCanvasElement;
    private context;
    private messages;

    constructor() {
        this.messages = [];
        this.canvas = document.createElement('canvas');
        var view = document.getElementById('viewport').getBoundingClientRect();
        this.canvas.id = 'ui-layer';
        this.canvas.width = view.width;
        this.canvas.height = view.height;
        this.canvas.style.position = 'absolute';
        this.canvas.style.left = view.left + 'px';
        this.canvas.style.top = view.top + 'px';
        document.body.appendChild(this.canvas);
        this.context = this.canvas.getContext('2d');
    }

    public draw():void {}

    public update(player: Player):void {
        this.clear();
        this.messageLog();
        this.debug(player);
    }

    private messageLog():void {
        this.context.font = '12pt monospace';
        this.context.fillStyle = 'white';
        this.context.textAlign = 'right';
        var startY = this.canvas.height - 30;
        for (var i = this.messages.length - 1; i >= 0; i--) {
            this.context.fillText(this.messages[i], this.canvas.width - 20, startY);
            startY -= 16;
        }
    }

    public addMessage(str: string):void {
        this.messages.push(str);
        if (this.messages.length > 5) {
            this.messages.splice(0, 1);
        }
    }

    private clear():void {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.canvas.width = this.canvas.width;
    }

    public debug(player: Player):void {
        var debugBuilder = new DebugBuilder();
        debugBuilder.addLine('x: ' + player.getPosition().x + ' y: ' + player.getPosition().y);
        debugBuilder.addLine('hp: ' + player.getHp() + '/' + player.getMaxHp());
        debugBuilder.addLine('armour: ' + player.getArmour());
        debugBuilder.addLine('speed: ' + player.getSpeed());
        debugBuilder.addLine('shotDelay: ' + player.getShotDelay());
        debugBuilder.addLine('shotSpeed: ' + player.getShotSpeed());
        debugBuilder.addLine('hasFired: ' + player.hasFired());
        debugBuilder.render(this.context);
    }

}

class DebugBuilder {

    private startPoint: number
    private strings;

    constructor() {
        this.strings = [];
    }

    public addLine(str: String):void {
        this.strings.push(str);
    }

    public render(context):void {
        var startY = 30;
        context.font = '12pt monospace';
        context.textAlign = 'left';
        context.fillStyle = 'white';
        for (var i = 0; i < this.strings.length; i++) {
            context.fillText(this.strings[i], 20, startY);
            startY += 14;
        }
    }
}
