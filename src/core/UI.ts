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

    public update(player: Player, world: World):void {
        this.clear();
        this.background();
        this.messageLog();
        this.miniMap(world);
        this.debug(player);
    }

    private background():void {
        this.context.fillStyle = '#1a1917';
        this.context.fillRect(0, 0, this.canvas.width, 185);
        this.context.fillRect(0, 0, 170, this.canvas.height);
        this.context.fillRect(this.canvas.width - 170, 0, 170, this.canvas.height);
        this.context.fill();
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

    private miniMap(world: World):void {
        var floor = world.getCurrentFloor().getLayout();
        var roomSizeWidth = 34;
        var roomSizeHeight = 24;
        var startX = this.canvas.width - 326;
        var startY = 20;
        this.context.lineWidth = 2;
        for (var y = 0; y < floor.length; y++) {
            for (var x = 0; x < floor[0].length; x++) {
                if (floor[y][x] === 0) {
                    this.context.fillStyle = 'transparent';
                    this.context.strokeStyle = 'transparent';
                } else if (floor[y][x].getExplored()) {
                    this.context.fillStyle = '#727272';
                    this.context.strokeStyle = '#000';
                } else if (floor[y][x].getSeen()) {
                    this.context.fillStyle = '#343534';
                    this.context.strokeStyle = '#000';
                } else {
                    this.context.fillStyle = 'transparent';
                    this.context.strokeStyle = 'transparent';
                }
                if (world.getPosition().x === x && world.getPosition().y === y) {
                    this.context.fillStyle = '#fff';
                    this.context.strokeStyle = '#000';
                }
                this.context.fillRect(startX + x * roomSizeWidth, startY + y * roomSizeHeight, roomSizeWidth, roomSizeHeight);
                this.context.strokeRect(startX + x * roomSizeWidth, startY + y * roomSizeHeight, roomSizeWidth, roomSizeHeight);
            }
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
        debugBuilder.addLine('bombs: ' + player.getBombs());
        debugBuilder.addLine('keys: ' + player.getKeys());
        debugBuilder.addLine('cash: ' + player.getCash());
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
