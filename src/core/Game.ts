///<reference path='Renderer.ts' />
///<reference path='Input.ts' />
///<reference path='AssetManager.ts' />
///<reference path='../item/ItemFactory.ts' />
///<reference path='../creature/CreatureFactory.ts' />
///<reference path='../entities/Projectile.ts' />
///<reference path='TestWorld.ts' />

class Game {

    public  player:     Player;

    private renderer:   Renderer;
    private input:      Input;
    private assets:     AssetManager;
    private cf:         CreatureFactory;
    private if:         ItemFactory;
    private tw:         TestWorld;
    private entities;
    private width:      number;
    private height:     number;
    private tileSize:   number;

    constructor() {
        this.assets   = new AssetManager();

        this.width = 13;
        this.height = 7;
        this.tileSize = 5;

        var spawnPos = new THREE.Vector3(
            ((this.width * this.tileSize) / 2) - (this.tileSize / 2),
            ((this.height * this.tileSize) / 2) - (this.tileSize / 2),
            0
        );
        console.log(spawnPos);

        this.renderer = new Renderer(this.width, this.height, this.tileSize);
        this.input    = new Input();
        this.cf       = new CreatureFactory();
        this.if       = new ItemFactory();
        this.player   = this.cf.spawnPlayer(spawnPos);
        this.tw       = new TestWorld(THREE.ImageUtils.loadTexture('../assets/test.png'), this.width, this.height, this.tileSize);
        this.entities = [];

        this.renderer.scene.add(this.player.getModel());

        for (var y = 0; y < this.tw.height; y++) {
            for (var x = 0; x < this.tw.width; x++) {
                this.renderer.scene.add(this.tw.getModel(x, y));
            }
        }

        this.entities.push(this.player);
        this.renderer.moveCamera(this.player.getPosition());
        this.loop();
    }

    private loop():void {
        this.update();
        this.draw();
        requestAnimationFrame(this.loop.bind(this));
    }

    private draw():void {
        this.renderer.draw();
    }

    private update():void {
        this.entities.forEach(function (entity) {
            entity.update();
        });
        this.handleKeys();
        this.renderer.update();
    }

    private handleKeys():void {
        var projectile = null;
        if (this.input.isPressed('65')) {
            this.player.move(-0.3, 0);
            this.renderer.moveCamera(this.player.getPosition());
        }
        if (this.input.isPressed('68')) {
            this.player.move(0.3, 0);
            this.renderer.moveCamera(this.player.getPosition());
        }
        if (this.input.isPressed('83')) {
            this.player.move(0, -0.3);
            this.renderer.moveCamera(this.player.getPosition());
        }
        if (this.input.isPressed('87')) {
            this.player.move(0, 0.3);
            this.renderer.moveCamera(this.player.getPosition());
        }

        if (this.input.isPressed('37') && !this.player.hasFired()) {
            projectile = new Projectile(this.player.getPosition(), -this.player.getSpeed(), 0, 0);
            this.entities.push(projectile);
            this.renderer.scene.add(projectile.getModel());
            this.player.firing();
        }
        if (this.input.isPressed('39') && !this.player.hasFired()) {
            projectile = new Projectile(this.player.getPosition(), this.player.getSpeed(), 0, 0);
            this.entities.push(projectile);
            this.renderer.scene.add(projectile.getModel());
            this.player.firing();
        }
        if (this.input.isPressed('38') && !this.player.hasFired()) {
            projectile = new Projectile(this.player.getPosition(), 0, this.player.getSpeed(), 0);
            this.entities.push(projectile);
            this.renderer.scene.add(projectile.getModel());
            this.player.firing();
        }
        if (this.input.isPressed('40') && !this.player.hasFired()) {
            projectile = new Projectile(this.player.getPosition(), 0, -this.player.getSpeed(), 0);
            this.entities.push(projectile);
            this.renderer.scene.add(projectile.getModel());
            this.player.firing();
        }
    }
}
