var Renderer = (function () {
    function Renderer(width, height, tileSize) {
        this.container = document.getElementById('container');
        this.WIDTH = 1280;
        this.HEIGHT = 720;
        this.VIEW_ANGLE = 45;
        this.ASPECT = this.WIDTH / this.HEIGHT;
        this.NEAR = 0.1;
        this.FAR = 10000;
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.camera = new THREE.PerspectiveCamera(this.VIEW_ANGLE, this.ASPECT, this.NEAR, this.FAR);
        this.scene = new THREE.Scene();

        this.container.appendChild(this.renderer.domElement);

        this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
        this.renderer.shadowMapEnabled = true;
        this.renderer.shadowMapSoft = true;

        this.renderer.domElement.id = 'viewport';

        var light = new THREE.SpotLight(0xffffff, 0.8);
        light.angle = Math.PI / 2;
        light.castShadow = true;
        light.position.set(width * tileSize, height * tileSize, 100);
        this.scene.add(light);

        this.camera.position.set(0, 0, 50);
    }
    Renderer.prototype.draw = function () {
        this.renderer.render(this.scene, this.camera);
    };

    Renderer.prototype.moveCamera = function (vector) {
        this.camera.position.x = vector.x;
        this.camera.position.y = vector.y;
    };

    Renderer.prototype.update = function () {
    };
    return Renderer;
})();
var Input = (function () {
    function Input() {
        this.keys = [];
        this.reserved = [65, 68, 83, 87, 37, 39, 38, 40];
        document.addEventListener('keydown', this.keyDown.bind(this), false);
        document.addEventListener('keyup', this.keyUp.bind(this), false);
    }
    Input.prototype.inReserved = function (code) {
        return (this.reserved.indexOf(code) !== -1);
    };

    Input.prototype.keyDown = function (event) {
        if (this.inReserved(event.keyCode)) {
            event.preventDefault();
        }
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
    function Item(name) {
        this.name = name;
        this.speed = 0;
        this.hp = 0;
        this.maxHp = 0;
        this.armour = 0;

        this.caster = new THREE.Raycaster();
        this.distance = 1.5;
        this.rays = [
            new THREE.Vector3(-1, 0, 0),
            new THREE.Vector3(1, 0, 0),
            new THREE.Vector3(0, 1, 0),
            new THREE.Vector3(0, -1, 0)
        ];

        var geometry = new THREE.CubeGeometry(1, 1, 1);
        var material = new THREE.MeshPhongMaterial({ color: 0xFF0000 });
        this.model = THREE.SceneUtils.createMultiMaterialObject(geometry, [material]);
    }
    Item.prototype.draw = function () {
    };

    Item.prototype.update = function () {
        this.model.position = this.pos;
        this.model.rotation.x += 0.01;
        this.model.rotation.y += 0.01;
    };

    Item.prototype.checkCollision = function (player) {
        var collisions = [];
        var _this = this;
        var returnVal = false;
        for (var i = 0; i < this.rays.length; i++) {
            this.caster.set(this.model.position, this.rays[i]);
            collisions = this.caster.intersectObject(player.getModel(), true);
            if (collisions.length > 0) {
                collisions.forEach(function (collision) {
                    if (collision.distance <= _this.distance) {
                        returnVal = true;
                    }
                });
            }
        }
        return returnVal;
    };

    Item.prototype.setModel = function (model) {
        this.model = model;
        return this;
    };

    Item.prototype.getModel = function () {
        return this.model;
    };

    Item.prototype.setPosition = function (vector) {
        this.pos = vector;
        return this;
    };

    Item.prototype.setSpeed = function (amt) {
        this.speed = amt;
        return this;
    };

    Item.prototype.setHp = function (amt) {
        this.hp = amt;
        return this;
    };

    Item.prototype.setMaxHp = function (amt) {
        this.maxHp = amt;
        return this;
    };

    Item.prototype.setArmour = function (amt) {
        this.armour = amt;
        return this;
    };
    return Item;
})();
var ItemFactory = (function () {
    function ItemFactory() {
    }
    ItemFactory.prototype.spawnHp = function () {
        var item = new Item('Hp Restore');
        item.setHp(1);
        return item;
    };

    ItemFactory.prototype.spawnHpUp = function () {
        var item = new Item('Hp+');
        item.setMaxHp(1);
        return item;
    };

    ItemFactory.prototype.spawnArmour = function () {
        var item = new Item('Armour+');
        item.setArmour(1);
        var geometry = new THREE.CubeGeometry(1, 1, 1);
        var material = new THREE.MeshPhongMaterial({ color: 0x0000FF });
        item.setModel(THREE.SceneUtils.createMultiMaterialObject(geometry, [material]));
        return item;
    };
    return ItemFactory;
})();
var Creature = (function () {
    function Creature() {
    }
    Creature.prototype.draw = function () {
    };
    Creature.prototype.update = function () {
    };

    Creature.prototype.getModel = function () {
        return this.model;
    };

    Creature.prototype.getPosition = function () {
        return this.pos;
    };

    Creature.prototype.setPosition = function (pos) {
        this.pos = pos;
    };

    Creature.prototype.getSpeed = function () {
        return this.speed;
    };

    Creature.prototype.checkCollision = function (obstacles) {
        return false;
    };

    Creature.prototype.move = function (obstacles, x, y) {
        this.pos.x += x;
        this.pos.y += y;
    };

    Creature.prototype.getHp = function () {
        return this.hp;
    };

    Creature.prototype.getMaxHp = function () {
        return this.maxHp;
    };

    Creature.prototype.getArmour = function () {
        return this.armour;
    };
    return Creature;
})();
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
        var size = 4;
        var geometry = new THREE.CubeGeometry(size, size, size);
        var shadeMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.5 });
        var edgeMat = new THREE.MeshBasicMaterial({ color: 0x00FF00, wireframe: true, transparent: true, wireframeLinewidth: 3 });
        this.model = THREE.SceneUtils.createMultiMaterialObject(geometry, [shadeMat, edgeMat]);
        this.pos = new THREE.Vector3(12.5, 12.5, 2);
        this.speed = 0.3;
        this.shotSpeed = 0.7;
        this.model.position = this.pos;
        this.model.castShadow = true;
        this.model.receiveShadow = true;
        this.fired = false;
        this.firingCooldown = 0;
        this.maxHp = 5;
        this.hp = this.maxHp;
        this.armour = 0;
        this.inventory = [];
        this.caster = new THREE.Raycaster();
        this.distance = 2.3;
        this.rays = [
            new THREE.Vector3(-1, 0, 0),
            new THREE.Vector3(1, 0, 0),
            new THREE.Vector3(0, 1, 0),
            new THREE.Vector3(0, -1, 0)
        ];
    }
    Player.prototype.checkCollision = function (obstacles) {
        return false;
    };

    Player.prototype.update = function () {
        if (this.firingCooldown > 0) {
            this.firingCooldown -= 1;
        } else {
            this.fired = false;
        }
        this.model.position = this.pos;
    };

    Player.prototype.move = function (obstacles, x, y) {
        var collisions = [];
        var _this = this;
        var velX = x;
        var velY = y;
        for (var i = 0; i < this.rays.length; i++) {
            this.caster.set(this.model.position, this.rays[i]);
            collisions = this.caster.intersectObjects(obstacles, true);
            if (collisions.length > 0) {
                collisions.forEach(function (collision) {
                    if (collision.distance <= _this.distance) {
                        if (collision.faceIndex === 3 && y > 0) {
                            velY = 0;
                        } else if (collision.faceIndex === 2 && y < 0) {
                            velY = 0;
                        } else if (collision.faceIndex === 0 && x < 0) {
                            velX = 0;
                        } else if (collision.faceIndex === 1 && x > 0) {
                            velX = 0;
                        }
                    }
                });
            }
        }
        this.pos.x += velX;
        this.pos.y += velY;
    };

    Player.prototype.hasFired = function () {
        return this.fired;
    };

    Player.prototype.firing = function () {
        this.firingCooldown = 50;
        this.fired = true;
    };

    Player.prototype.getShotSpeed = function () {
        return this.shotSpeed;
    };

    Player.prototype.addToInventory = function (item) {
        this.inventory.push(item);
    };

    Player.prototype.pickupItem = function (item) {
        this.speed += item.speed;

        this.hp = (this.hp + item.hp >= this.maxHp) ? this.hp = this.maxHp : this.hp += item.hp;

        this.armour += item.armour;
        this.maxHp += item.maxHp;
        this.addToInventory(item);
    };

    Player.prototype.getInventory = function () {
        return this.inventory;
    };
    return Player;
})(Creature);
var CreatureFactory = (function () {
    function CreatureFactory() {
    }
    CreatureFactory.prototype.spawnPlayer = function (vector) {
        var player = new Player();
        player.setPosition(vector);
        return player;
    };
    return CreatureFactory;
})();
var Thing = (function () {
    function Thing() {
    }
    Thing.prototype.update = function () {
        this.model.rotation.x += 0.01;
        this.model.rotation.y += 0.01;
    };

    Thing.prototype.getModel = function () {
        return this.model;
    };
    return Thing;
})();
var Projectile = (function (_super) {
    __extends(Projectile, _super);
    function Projectile(vector, velX, velY, velZ) {
        _super.call(this);
        this.pos = new THREE.Vector3(vector.x, vector.y, vector.z);
        var geometry = new THREE.SphereGeometry(1, 10, 10);
        var shadeMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.5 });
        var edgeMat = new THREE.MeshBasicMaterial({ color: 0xFF0000, wireframe: true, transparent: true, wireframeLinewidth: 3 });
        this.model = THREE.SceneUtils.createMultiMaterialObject(geometry, [shadeMat, edgeMat]);

        this.model.position = this.pos;
        this.model.castShadow = true;
        this.model.receiveShadow = true;
        this.velocity = {
            x: velX,
            y: velY,
            z: 0
        };

        this.caster = new THREE.Raycaster();
        this.distance = 1;
        this.rays = [
            new THREE.Vector3(1, 0, 0),
            new THREE.Vector3(-1, 0, 0),
            new THREE.Vector3(0, 1, 0),
            new THREE.Vector3(0, -1, 0)
        ];
    }
    Projectile.prototype.checkCollision = function (obstacles) {
        var collisions = [];
        for (var i = 0; i < this.rays.length; i++) {
            this.caster.set(this.model.position, this.rays[i]);
            collisions = this.caster.intersectObjects(obstacles, true);
            if (collisions.length > 0 && collisions[0].distance <= this.distance) {
                return true;
            }
        }
        return false;
    };

    Projectile.prototype.update = function () {
        this.pos.x += this.velocity.x;
        this.pos.y += this.velocity.y;
        if (this.pos.z - this.velocity.z > 0) {
            this.pos.z += this.velocity.z;
        }
        this.model.position = this.pos;
    };
    return Projectile;
})(Thing);
var TestWorld2 = (function () {
    function TestWorld2(texture, tileSize) {
        this.tileSize = tileSize;
        this.texture = texture;

        this.itemFactory = new ItemFactory();
        this.items = [];

        this.map = [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 1],
            [1, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ];

        this.meshes = [];
        this.obstacles = [];

        for (var i = 0; i < this.map.length; i++) {
            this.meshes[i] = [];
        }

        this.generateMeshes();
    }
    TestWorld2.prototype.generateMeshes = function () {
        var geometry = new THREE.CubeGeometry(this.tileSize, this.tileSize, this.tileSize);
        var material = new THREE.MeshPhongMaterial();
        for (var y = 0; y < this.map.length; y++) {
            for (var x = 0; x < this.map[0].length; x++) {
                if (this.map[y][x] === 0 || this.map[y][x] === 2 || this.map[y][x] === 3) {
                    var pos = new THREE.Vector3(x * this.tileSize, y * this.tileSize, -3);
                    this.meshes[y][x] = THREE.SceneUtils.createMultiMaterialObject(geometry, [material]);
                    this.meshes[y][x].position = pos;
                    this.meshes[y][x].receiveShadow = true;
                    this.meshes[y][x].castShadow = true;
                } else if (this.map[y][x] === 1) {
                    var pos = new THREE.Vector3(x * this.tileSize, y * this.tileSize, 1);
                    this.meshes[y][x] = THREE.SceneUtils.createMultiMaterialObject(geometry, [material]);
                    this.meshes[y][x].position = pos;
                    this.meshes[y][x].receiveShadow = true;
                    this.meshes[y][x].castShadow = true;
                    this.obstacles.push(this.meshes[y][x]);
                }

                if (this.map[y][x] === 2) {
                    var pos = new THREE.Vector3(x * this.tileSize, y * this.tileSize, 1);
                    var item = this.itemFactory.spawnHpUp();
                    item.setPosition(pos);
                    this.items.push(item);
                }
                if (this.map[y][x] === 3) {
                    var pos = new THREE.Vector3(x * this.tileSize, y * this.tileSize, 1);
                    var item = this.itemFactory.spawnArmour();
                    item.setPosition(pos);
                    this.items.push(item);
                }
            }
        }
    };

    TestWorld2.prototype.getObstacles = function () {
        return this.obstacles;
    };

    TestWorld2.prototype.getModel = function (x, y) {
        return this.meshes[y][x];
    };

    TestWorld2.prototype.getRoomItems = function () {
        return this.items;
    };
    return TestWorld2;
})();
var UI = (function () {
    function UI() {
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
    UI.prototype.draw = function () {
    };

    UI.prototype.update = function () {
    };

    UI.prototype.clear = function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.canvas.width = this.canvas.width;
    };

    UI.prototype.debug = function (player) {
        this.clear();
        var debugBuilder = new DebugBuilder();
        debugBuilder.addLine('x: ' + player.getPosition().x + ' y: ' + player.getPosition().y);
        debugBuilder.addLine('hp: ' + player.getHp() + '/' + player.getMaxHp());
        debugBuilder.addLine('armour: ' + player.getArmour());
        debugBuilder.addLine('speed: ' + player.getSpeed());
        debugBuilder.addLine('shotSpeed: ' + player.getShotSpeed());
        debugBuilder.addLine('hasFired: ' + player.hasFired());
        debugBuilder.render(this.context);
    };
    return UI;
})();

var DebugBuilder = (function () {
    function DebugBuilder() {
        this.strings = [];
    }
    DebugBuilder.prototype.addLine = function (str) {
        this.strings.push(str);
    };

    DebugBuilder.prototype.render = function (context) {
        var startY = 30;
        context.font = '12pt monospace';
        context.fillStyle = 'white';
        for (var i = 0; i < this.strings.length; i++) {
            context.fillText(this.strings[i], 20, startY);
            startY += 14;
        }
    };
    return DebugBuilder;
})();
var Game = (function () {
    function Game() {
        this.assets = new AssetManager();

        this.width = 13;
        this.height = 7;
        this.tileSize = 5;

        var spawnPos = new THREE.Vector3(((this.width * this.tileSize) / 2) + (this.tileSize / 2), ((this.height * this.tileSize) / 2) + (this.tileSize / 2), 1.5);

        this.renderer = new Renderer(this.width, this.height, this.tileSize);
        this.input = new Input();
        this.cf = new CreatureFactory();
        this.if = new ItemFactory();
        this.player = this.cf.spawnPlayer(spawnPos);
        this.world = new TestWorld2(THREE.ImageUtils.loadTexture('../assets/test.png'), this.tileSize);
        this.entities = [];
        this.ui = new UI();

        this.renderer.scene.add(this.player.getModel());

        for (var y = 0; y < this.world.map.length; y++) {
            for (var x = 0; x < this.world.map[0].length; x++) {
                this.renderer.scene.add(this.world.getModel(x, y));
            }
        }

        this.roomItems = this.world.getRoomItems();

        var _this = this;

        this.roomItems.forEach(function (item) {
            _this.renderer.scene.add(item.getModel());
        });

        this.renderer.moveCamera(this.player.getPosition());
        this.loop();
    }
    Game.prototype.loop = function () {
        this.update();
        this.draw();
        requestAnimationFrame(this.loop.bind(this));
    };

    Game.prototype.draw = function () {
        this.renderer.draw();
    };

    Game.prototype.update = function () {
        var _this = this;
        this.player.update();
        this.ui.update();
        this.ui.debug(this.player);
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
            }
            item.update();
        });
        this.handleKeys();
        this.renderer.update();
    };

    Game.prototype.handleKeys = function () {
        var projectile = null;
        var obstacles = this.world.getObstacles();
        if (this.input.isPressed('65')) {
            this.player.move(obstacles, -this.player.speed, 0);
        }
        if (this.input.isPressed('68')) {
            this.player.move(obstacles, this.player.speed, 0);
        }
        if (this.input.isPressed('83')) {
            this.player.move(obstacles, 0, -this.player.speed);
        }
        if (this.input.isPressed('87')) {
            this.player.move(obstacles, 0, this.player.speed);
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
    };
    return Game;
})();
var g = new Game();
