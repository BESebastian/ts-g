///<reference path='../lib/three.d.ts' />
var Renderer = (function () {
    function Renderer() {
        this.container = document.getElementById('container');
        this.WIDTH = this.container.offsetWidth;
        this.HEIGHT = this.container.offsetHeight;
        this.VIEW_ANGLE = 45;
        this.ASPECT = this.WIDTH / this.HEIGHT;
        this.NEAR = 0.1;
        this.FAR = 10000;
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.camera = new THREE.PerspectiveCamera(this.VIEW_ANGLE, this.ASPECT, this.NEAR, this.FAR);
        this.scene = new THREE.Scene();

        this.container.appendChild(this.renderer.domElement);

        this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);

        //this.renderer.shadowMapEnabled = true;
        //this.renderer.shadowMapSoft = true;
        //this.renderer.shadowCameraNear = 3;
        //this.renderer.shadowCameraFar = this.camera.far;
        //this.renderer.shadowCameraFov = 50;
        //this.renderer.shadowMapBias = 0.0039;
        //this.renderer.shadowMapDarkness = 0.5;
        //this.renderer.shadowMapWidth = 1024;
        //this.renderer.shadowMapHeight = 1024;
        var light = new THREE.SpotLight(0xffffff, 0.8);
        light.angle = Math.PI / 2;
        light.castShadow = true;
        light.position.set(0, 0, 100);
        this.scene.add(light);

        this.camera.position.set(0, 0, 20);
    }
    Renderer.prototype.draw = function () {
        this.renderer.render(this.scene, this.camera);
    };

    Renderer.prototype.update = function () {
    };
    return Renderer;
})();
var Input = (function () {
    function Input() {
        this.keys = [];
        document.addEventListener('keydown', this.keyDown.bind(this), false);
        document.addEventListener('keyup', this.keyUp.bind(this), false);
    }
    Input.prototype.keyDown = function (event) {
        event.preventDefault();
        this.keys[event.keyCode] = true;
    };

    Input.prototype.keyUp = function (event) {
        event.preventDefault();
        this.keys[event.keyCode] = false;
    };

    Input.prototype.isPressed = function (keyCode) {
        return this.keys[keyCode];
    };
    return Input;
})();
var AssetManager = (function () {
    function AssetManager() {
    }
    return AssetManager;
})();
var Item = (function () {
    function Item() {
    }
    return Item;
})();
///<reference path='Item.ts'/>
var ItemFactory = (function () {
    function ItemFactory() {
    }
    return ItemFactory;
})();
var Creature = (function () {
    function Creature() {
    }
    Creature.prototype.update = function () {
    };

    Creature.prototype.draw = function () {
    };

    Creature.prototype.getModel = function () {
        return this.model;
    };

    Creature.prototype.getPosition = function () {
        return this.pos;
    };

    Creature.prototype.move = function (x, y) {
        this.pos.x += x;
        this.pos.y += y;
    };
    return Creature;
})();
///<reference path='Creature.ts'/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Player = (function (_super) {
    __extends(Player, _super);
    function Player() {
        _super.call(this);
        var geometry = new THREE.TorusKnotGeometry(1, 0.5, 150, 18);
        var material = new THREE.MeshPhongMaterial();
        this.model = new THREE.Mesh(geometry, material);
        this.pos = new THREE.Vector3(1, 1, 2);
        this.model.position = this.pos;
        this.model.castShadow = true;
        this.model.receiveShadow = true;
        this.fired = false;
        this.firingCooldown = 0;
    }
    Player.prototype.update = function () {
        if (this.firingCooldown > 0) {
            this.firingCooldown -= 1;
        } else {
            this.fired = false;
        }
        this.model.position = this.pos;
    };

    Player.prototype.hasFired = function () {
        return this.fired;
    };

    Player.prototype.firing = function () {
        this.firingCooldown = 50;
        this.fired = true;
    };
    return Player;
})(Creature);
///<reference path='Player.ts'/>
var CreatureFactory = (function () {
    function CreatureFactory() {
    }
    CreatureFactory.prototype.spawnPlayer = function () {
        var player = new Player();
        return player;
    };
    return CreatureFactory;
})();
var Projectile = (function () {
    function Projectile(vector, velX, velY, velZ) {
        this.pos = new THREE.Vector3(vector.x, vector.y, vector.z);
        var geometry = new THREE.CubeGeometry(0.5, 0.5, 0.5);
        var material = new THREE.MeshPhongMaterial({ color: 0xff0000 });
        this.model = new THREE.Mesh(geometry, material);
        this.model.position = this.pos;
        this.model.castShadow = true;

        //this.modelreceiveShadow = true;
        this.velocity = {
            x: velX,
            y: velY,
            z: velZ
        };
    }
    Projectile.prototype.update = function () {
        this.pos.x += this.velocity.x;
        this.pos.y += this.velocity.y;
        if (this.pos.z - this.velocity.z > 0) {
            this.pos.z += this.velocity.z;
        }
        if (this.velocity.x > this.velocity.y) {
            this.model.rotation.x += 0.3;
        } else {
            this.model.rotation.y += 0.3;
        }
        this.model.position = this.pos;
    };

    Projectile.prototype.getModel = function () {
        return this.model;
    };
    return Projectile;
})();
var TestWorld = (function () {
    function TestWorld() {
        var geometry = new THREE.PlaneGeometry(40, 20);
        var material = new THREE.MeshPhongMaterial({ color: 0x777777 });
        this.model = new THREE.Mesh(geometry, material);
        this.model.receiveShadow = true;
        this.model.castShadow = true;
    }
    TestWorld.prototype.getModel = function () {
        return this.model;
    };
    return TestWorld;
})();
///<reference path='Renderer.ts' />
///<reference path='Input.ts' />
///<reference path='AssetManager.ts' />
///<reference path='../item/ItemFactory.ts' />
///<reference path='../creature/CreatureFactory.ts' />
///<reference path='../entities/Projectile.ts' />
///<reference path='TestWorld.ts' />
var Game = (function () {
    function Game() {
        this.renderer = new Renderer();
        this.input = new Input();
        this.assets = new AssetManager();
        this.cf = new CreatureFactory();
        this.if = new ItemFactory();
        this.player = this.cf.spawnPlayer();
        this.tw = new TestWorld();
        this.entities = [];

        this.renderer.scene.add(this.player.getModel());
        this.renderer.scene.add(this.tw.getModel());

        this.entities.push(this.player);

        this.loop();
    }
    Game.prototype.loop = function () {
        this.update();
        this.draw();
        requestAnimationFrame(this.loop.bind(this));
    };

    Game.prototype.update = function () {
        this.entities.forEach(function (entity) {
            entity.update();
        });

        var projectile = null;
        if (this.input.isPressed('65')) {
            this.player.move(-0.1, 0);
        }
        if (this.input.isPressed('68')) {
            this.player.move(0.1, 0);
        }
        if (this.input.isPressed('83')) {
            this.player.move(0, -0.1);
        }
        if (this.input.isPressed('87')) {
            this.player.move(0, 0.1);
        }
        if (this.input.isPressed('37')) {
            this.player.model.rotation.y -= 0.1;
        }
        if (this.input.isPressed('39')) {
            this.player.model.rotation.y += 0.1;
        }
        if (this.input.isPressed('38')) {
            this.player.model.rotation.x -= 0.1;
        }
        if (this.input.isPressed('40')) {
            this.player.model.rotation.x += 0.1;
        }

        if (this.input.isPressed('37') && !this.player.hasFired()) {
            projectile = new Projectile(this.player.getPosition(), -0.3, 0, -0.03);
            this.entities.push(projectile);
            this.renderer.scene.add(projectile.getModel());
            this.player.firing();
        }
        if (this.input.isPressed('39') && !this.player.hasFired()) {
            projectile = new Projectile(this.player.getPosition(), 0.3, 0, -0.03);
            this.entities.push(projectile);
            this.renderer.scene.add(projectile.getModel());
            this.player.firing();
        }
        if (this.input.isPressed('38') && !this.player.hasFired()) {
            projectile = new Projectile(this.player.getPosition(), 0, 0.3, -0.03);
            this.entities.push(projectile);
            this.renderer.scene.add(projectile.getModel());
            this.player.firing();
        }
        if (this.input.isPressed('40') && !this.player.hasFired()) {
            projectile = new Projectile(this.player.getPosition(), 0, -0.3, -0.03);
            this.entities.push(projectile);
            this.renderer.scene.add(projectile.getModel());
            this.player.firing();
        }

        this.renderer.update();
    };

    Game.prototype.draw = function () {
        this.renderer.draw();
    };
    return Game;
})();
///<reference path='core/Game.ts' />
var g = new Game();
