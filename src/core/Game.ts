///<reference path='Renderer.ts' />
///<reference path='Input.ts' />
///<reference path='AssetManager.ts' />
///<reference path='../item/ItemFactory.ts' />
///<reference path='../item/ItemPools.ts' />
///<reference path='../creature/CreatureFactory.ts' />
///<reference path='../entities/Projectile.ts' />
///<reference path='../world/World.ts' />
///<reference path='UI.ts' />

class Game {

    public  player:     Player;

    private renderer:   Renderer;
    private input:      Input;
    private assets:     AssetManager;
    private cf:         CreatureFactory;
    private world:      World;
    private entities;
    private width:      number;
    private height:     number;
    private tileSize:   number;
    private ui:         UI;
    private roomItems:  Item[];
    private itemPool;
    private collectablePool;

    constructor() {
        this.assets   = new AssetManager();
        this.eventListeners();

        this.width = 13;
        this.height = 7;
        this.tileSize = 5;

        var spawnPos = new THREE.Vector3(
            ((this.width * this.tileSize) / 2) + (this.tileSize / 2),
            ((this.height * this.tileSize) / 2) + (this.tileSize / 2),
            1.5
        );

        this.itemPool = new ItemPools().getItemPool();
        this.collectablePool = new ItemPools().getCollectablePool();

        this.renderer = new Renderer(this.width, this.height, this.tileSize);
        this.input    = new Input();
        this.cf       = new CreatureFactory();
        this.player   = this.cf.spawnPlayer(spawnPos);
        this.world    = new World(THREE.ImageUtils.loadTexture('../assets/test.png'), this.tileSize, this.itemPool, this.collectablePool);
        this.entities = [];
        this.ui       = new UI();

        this.renderer.scene.add(this.player.getModel());

        for (var y = 0; y < this.world.meshes.length; y++) {
            for (var x = 0; x < this.world.meshes[0].length; x++) {
                this.renderer.scene.add(this.world.meshes[y][x]);
            }
        }

        var currentRoom = this.world.getCurrentRoom();

        this.roomItems = this.world.getRoomItems();
        var _this = this;
        this.roomItems.forEach(function (item) {
            _this.renderer.scene.add(item.getModel());
        });

        this.loop();
    }

    private eventListeners():void {
        document.addEventListener('changeRoom', function (e) {
            console.log('game changeRoom event', e);
        });
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
        var _this = this;
        this.player.update();
        this.ui.update(this.player, this.world);
        this.entities.forEach(function (entity) {
            if (entity.checkCollision(_this.world.getObstacles())) {
                _this.entities.splice(_this.entities.indexOf(entity), 1);
                _this.renderer.scene.remove(entity.getModel());
            }
            entity.update();
        });
        this.roomItems.forEach(function (item) {
            if (item.checkCollision(_this.player)) {
                _this.roomItems.splice(_this.roomItems.indexOf(item), 1);
                _this.renderer.scene.remove(item.getModel());
                _this.player.pickupItem(item);
                _this.ui.addMessage('You picked up: ' + item.getName());
            }
            item.update();
        });
        this.handleKeys();
        this.renderer.update();
    }

    private handleKeys():void {
        var projectile = null;
        var obstacles = this.world.getObstacles();
        if (this.input.isPressed('65')) {
            this.player.move(obstacles, -this.player.speed, 0, this.world, this.renderer, this.entities);
        }
        if (this.input.isPressed('68')) {
            this.player.move(obstacles, this.player.speed, 0, this.world, this.renderer, this.entities);
        }
        if (this.input.isPressed('83')) {
            this.player.move(obstacles, 0, -this.player.speed, this.world, this.renderer, this.entities);
        }
        if (this.input.isPressed('87')) {
            this.player.move(obstacles, 0, this.player.speed, this.world, this.renderer, this.entities);
        }

        if (this.input.isPressed('74')) {
            this.renderer.camera.position.x -= 1;
        }
        if (this.input.isPressed('75')) {
            this.renderer.camera.position.y -= 1;
        }
        if (this.input.isPressed('76')) {
            this.renderer.camera.position.x += 1;
        }
        if (this.input.isPressed('73')) {
            this.renderer.camera.position.y += 1;
        }
        if (this.input.isPressed('85')) {
            this.renderer.camera.position.z += 1;
        }
        if (this.input.isPressed('79')) {
            this.renderer.camera.position.z -= 1;
        }

        if (this.input.isPressed('37') && !this.player.hasFired()) {
            projectile = new Projectile(this.player.getPosition(), -this.player.getShotSpeed(), 0, 0);
            this.entities.push(projectile);
            this.renderer.scene.add(projectile.getModel());
            this.player.firing();
        }
        if (this.input.isPressed('39') && !this.player.hasFired()) {
            projectile = new Projectile(this.player.getPosition(), this.player.getShotSpeed(), 0, 0);
            this.entities.push(projectile);
            this.renderer.scene.add(projectile.getModel());
            this.player.firing();
        }
        if (this.input.isPressed('38') && !this.player.hasFired()) {
            projectile = new Projectile(this.player.getPosition(), 0, this.player.getShotSpeed(), 0);
            this.entities.push(projectile);
            this.renderer.scene.add(projectile.getModel());
            this.player.firing();
        }
        if (this.input.isPressed('40') && !this.player.hasFired()) {
            projectile = new Projectile(this.player.getPosition(), 0, -this.player.getShotSpeed(), 0);
            this.entities.push(projectile);
            this.renderer.scene.add(projectile.getModel());
            this.player.firing();
        }
    }
}
