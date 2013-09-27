var Renderer = (function () {
    function Renderer() {
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
///<reference path='../creature/Player.ts' />
var Game = (function () {
    function Game() {
        this.renderer = new Renderer();
        this.input = new Input();
        this.assets = new AssetManager();

        this.cf = new CreatureFactory();
        this.if = new ItemFactory();

        this.player = this.cf.spawnPlayer();
        console.log(this.player);

        this.loop();
    }
    Game.prototype.loop = function () {
        this.update();
        this.draw();
    };

    Game.prototype.update = function () {
        this.renderer.update();
    };

    Game.prototype.draw = function () {
        this.renderer.draw();
    };
    return Game;
})();
///<reference path='core/Game.ts' />
var g = new Game();
