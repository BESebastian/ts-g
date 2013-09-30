///<reference path='Renderer.ts' />
///<reference path='Input.ts' />
///<reference path='AssetManager.ts' />
///<reference path='../item/ItemFactory.ts' />
///<reference path='../creature/CreatureFactory.ts' />

class Game {

    public  player:     Player;

    private renderer:   Renderer;
    private input:      Input;
    private assets:     AssetManager;
    private cf:         CreatureFactory;
    private if:         ItemFactory;

    constructor() {
        this.renderer = new Renderer();
        this.input    = new Input();
        this.assets   = new AssetManager();
        this.cf       = new CreatureFactory();
        this.if       = new ItemFactory();
        this.player   = this.cf.spawnPlayer();

        this.loop();
    }

    private loop():void {
        this.update();
        this.draw();
    }

    private update():void {
        this.input.update();
        this.renderer.update();
    }

    private draw():void {
        this.renderer.draw();
    }

}
