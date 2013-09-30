///<reference path='../lib/three.d.ts' />
var Renderer = (function () {
    function Renderer() {
        this.WIDTH = 400;
        this.HEIGHT = 300;
        this.VIEW_ANGLE = 45;
        this.ASPECT = this.WIDTH / this.HEIGHT;
        this.NEAR = 0.1;
        this.FAR = 10000;
        this.container = document.body;
        this.renderer = new THREE.WebGLRenderer();
        this.camera = new THREE.PerspectiveCamera(this.VIEW_ANGLE, this.ASPECT, this.NEAR, this.FAR);
        this.scene = new THREE.Scene();

        this.scene.add(this.camera);
        this.camera.position.z = 300;
        this.renderer.setSize(this.WIDTH, this.HEIGHT);
        this.container.appendChild(this.renderer.domElement);

        var radius = 50;
        var segments = 16;
        var rings = 16;
        var sphereMaterial = new THREE.MeshLambertMaterial({ color: 0xCC0000 });
        var sphere = new THREE.Mesh(new THREE.SphereGeometry(radius, segments, rings), sphereMaterial);
        this.scene.add(sphere);

        var pointLight = new THREE.PointLight(0xFFFFFF);
        pointLight.position.x = 10;
        pointLight.position.y = 50;
        pointLight.position.z = 130;
        this.scene.add(pointLight);

        this.renderer.render(this.scene, this.camera);
    }
    Renderer.prototype.draw = function () {
    };

    Renderer.prototype.update = function () {
    };
    return Renderer;
})();
var Input = (function () {
    function Input() {
    }
    Input.prototype.update = function () {
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
        this.pos = {
            x: 0,
            y: 0,
            z: 0
        };
    }
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
    function Player(name) {
        _super.call(this);
        this.name = name;
    }
    return Player;
})(Creature);
///<reference path='Player.ts'/>
var CreatureFactory = (function () {
    function CreatureFactory() {
    }
    CreatureFactory.prototype.spawnPlayer = function () {
        var player = new Player('dickbutt');
        return player;
    };
    return CreatureFactory;
})();
///<reference path='Renderer.ts' />
///<reference path='Input.ts' />
///<reference path='AssetManager.ts' />
///<reference path='../item/ItemFactory.ts' />
///<reference path='../creature/CreatureFactory.ts' />
var Game = (function () {
    function Game() {
        this.renderer = new Renderer();
        this.input = new Input();
        this.assets = new AssetManager();
        this.cf = new CreatureFactory();
        this.if = new ItemFactory();
        this.player = this.cf.spawnPlayer();

        this.loop();
    }
    Game.prototype.loop = function () {
        this.update();
        this.draw();
    };

    Game.prototype.update = function () {
        this.input.update();
        this.renderer.update();
    };

    Game.prototype.draw = function () {
        this.renderer.draw();
    };
    return Game;
})();
///<reference path='core/Game.ts' />
var g = new Game();
