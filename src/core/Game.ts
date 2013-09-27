///<reference path='Renderer.ts' />
///<reference path='Input.ts' />
///<reference path='AssetManager.ts' />
///<reference path='../item/ItemFactory.ts' />
///<reference path='../creature/CreatureFactory.ts' />
///<reference path='../creature/Player.ts' />

class Game {

    private renderer:Renderer;
    private input:Input;
    private assets:AssetManager;

    private cf:CreatureFactory;
    private if:ItemFactory;

    private player:Player;

    constructor() {
        this.renderer = new Renderer();
        this.input = new Input();
        this.assets = new AssetManager();

        this.cf = new CreatureFactory();
        this.if = new ItemFactory();

        this.player = this.cf.spawnPlayer();
        console.log(this.player);

        this.loop();
    }

    private loop():void {
        this.update();
        this.draw();
    }

    private update():void {
        this.renderer.update();
    }

    private draw():void {
        this.renderer.draw();
    }

}
