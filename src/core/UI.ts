class UI {

    private hp:         number;
    private prevHp:     number;
    private objs;
    private canvas:     HTMLCanvasElement;
    private context;

    constructor() {
        this.hp = 0;
        this.objs = [];
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

    public draw():void {

    }

    public update(scene: THREE.Scene, hp: number):void {
        this.prevHp = this.hp;
        this.hp = hp;
    }

    private clear():void {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.canvas.width = this.canvas.width;
    }

    public debug(player: Player):void {
        this.clear();
        this.context.font = "12pt monospace";
        this.context.fillStyle = "white";
        this.context.fillText('x: ' + player.getPosition().x + ' y: ' + player.getPosition().y, 20, 30);
        this.context.fillText('hp: ' + player.getHp(), 20, 40);
        this.context.fillText('armour: ' + player.getArmour(), 20, 50);
        this.context.fillText('speed: ' + player.getSpeed(), 20, 60);
        this.context.fillText('shotSpeed: ' + player.getShotSpeed(), 20, 70);
        this.context.fillText('hasFired: ' + player.hasFired(), 20, 80);
    }

    public getItems() {
        return this.objs;
    }

}
