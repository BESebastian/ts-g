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
        this.renderer.shadowMapType = THREE.PCFSoftShadowMap;

        this.renderer.domElement.id = 'viewport';
        this.camera.position.set(35, 27, 69);

        this.light = new THREE.SpotLight(0xffffff, 0.8);
        this.light.castShadow = true;
        this.light.position.set(35, 20, 100);
        this.light.shadowDarkness = 1;
        this.light.target.position.x = 35;
        this.light.target.position.y = 20;
        this.scene.add(this.light);
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
        this.shotSpeed = 0;
        this.shotDelay = 0;
        this.keys = 0;
        this.bombs = 0;
        this.cash = 0;
        this.isShopItem = false;
        this.cost = 0;

        this.caster = new THREE.Raycaster();
        this.distance = 1.5;
        this.rays = [
            new THREE.Vector3(-1, 0, 0),
            new THREE.Vector3(1, 0, 0),
            new THREE.Vector3(0, 1, 0),
            new THREE.Vector3(0, -1, 0)
        ];

        var geometry = new THREE.CubeGeometry(1, 1, 1);
        var material = new THREE.MeshPhongMaterial();
        this.model = new THREE.Mesh(geometry, material);
        this.model.castShadow = true;
        this.model.receiveShadow = true;
    }
    Item.prototype.draw = function () {
    };

    Item.prototype.update = function () {
        this.model.position = this.pos;
        this.model.rotation.x += 0.01;
        this.model.rotation.y += 0.01;
    };

    Item.prototype.handlePickup = function (player) {
        var returnVal = true;
        if (this.maxHp === 0 && this.hp > 0 && player.getHp() === player.getMaxHp()) {
            return false;
        }
        return true;
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
                        returnVal = _this.handlePickup(player);
                    }
                });
            }
        }
        return returnVal;
    };

    Item.prototype.getName = function () {
        return this.name;
    };

    Item.prototype.setModel = function (model) {
        this.model = model || this.model;
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

    Item.prototype.setShotSpeed = function (amt) {
        this.shotSpeed = amt;
        return this;
    };

    Item.prototype.setShotDelay = function (amt) {
        this.shotDelay = amt;
        return this;
    };

    Item.prototype.setBombs = function (amt) {
        this.bombs = amt;
        return this;
    };

    Item.prototype.setKeys = function (amt) {
        this.keys = amt;
        return this;
    };

    Item.prototype.setCash = function (amt) {
        this.cash = amt;
        return this;
    };

    Item.prototype.getCash = function () {
        return this.cash;
    };

    Item.prototype.setIsShopItem = function () {
        this.isShopItem = true;
        return this;
    };

    Item.prototype.setCost = function (amt) {
        this.cost = amt;
        return this;
    };
    return Item;
})();
var ItemFactory = (function () {
    function ItemFactory(itemPool, collectablePool) {
        this.itemPool = itemPool;
        this.collectablePool = collectablePool;
    }
    ItemFactory.prototype.itemPoolRandom = function () {
        var r = Math.floor(Math.random() * this.itemPool.length);
        var rand = this.itemPool[r];
        var item = new Item(rand.name || 'undefined').setHp(rand.hp || 0).setSpeed(rand.speed || 0).setShotSpeed(rand.shotSpeed || 0).setShotDelay(rand.shotDelay || 0).setArmour(rand.armour || 0).setMaxHp(rand.maxHp || 0).setModel(rand.model);
        this.itemPool.splice(r, 1);
        return item;
    };

    ItemFactory.prototype.collectablePoolRandom = function () {
        var r = Math.floor(Math.random() * this.collectablePool.length);
        var rand = this.collectablePool[r];
        var item = new Item(rand.name || 'undefined').setHp(rand.hp || 0).setArmour(rand.armour || 0).setBombs(rand.bombs || 0).setKeys(rand.keys || 0).setCash(rand.cash || 0).setModel(rand.model());
        return item;
    };
    return ItemFactory;
})();
var ItemPools = (function () {
    function ItemPools() {
    }
    ItemPools.prototype.getItemPool = function () {
        return [
            {
                name: 'Dinner',
                maxHp: 1,
                hp: 1
            },
            {
                name: 'Breakfast',
                maxHp: 1,
                hp: 1
            },
            {
                name: 'Lunch',
                maxHp: 1,
                hp: 1
            },
            {
                name: 'Lard',
                maxHp: 2,
                hp: 2,
                speed: -0.1
            },
            {
                name: 'Shot Speed',
                shotSpeed: 0.1
            },
            {
                name: 'Shot Delay',
                shotDelay: -0.2
            }
        ];
    };

    ItemPools.prototype.getCollectablePool = function () {
        return [
            {
                name: 'Hp',
                hp: 1,
                model: function () {
                    var geometry = new THREE.CubeGeometry(1, 1, 1);
                    var material = new THREE.MeshPhongMaterial({ color: 0xFF0000 });
                    var model = new THREE.Mesh(geometry, material);
                    model.castShadow = true;
                    model.receiveShadow = true;
                    return model;
                }
            },
            {
                name: 'Armour',
                armour: 1,
                model: function () {
                    var geometry = new THREE.CubeGeometry(1, 1, 1);
                    var material = new THREE.MeshPhongMaterial({ color: 0x0000FF });
                    var model = new THREE.Mesh(geometry, material);
                    model.castShadow = true;
                    model.receiveShadow = true;
                    return model;
                }
            },
            {
                name: 'Bomb',
                bombs: 1,
                model: function () {
                    var geometry = new THREE.CubeGeometry(1, 1, 1);
                    var material = new THREE.MeshPhongMaterial({ color: 0x999999 });
                    var model = new THREE.Mesh(geometry, material);
                    model.castShadow = true;
                    model.receiveShadow = true;
                    return model;
                }
            },
            {
                name: 'Key',
                keys: 1,
                model: function () {
                    var geometry = new THREE.CubeGeometry(1, 1, 1);
                    var material = new THREE.MeshPhongMaterial({ color: 0xFFFFFF });
                    var model = new THREE.Mesh(geometry, material);
                    model.castShadow = true;
                    model.receiveShadow = true;
                    return model;
                }
            },
            {
                name: 'Cash',
                cash: 1,
                model: function () {
                    var geometry = new THREE.CubeGeometry(1, 1, 1);
                    var material = new THREE.MeshPhongMaterial({ color: 0xFFA500 });
                    var model = new THREE.Mesh(geometry, material);
                    model.castShadow = true;
                    model.receiveShadow = true;
                    return model;
                }
            }
        ];
    };
    return ItemPools;
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

    Creature.prototype.move = function (obstacles, x, y, world, renderer, entities, roomItems) {
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
        this.eventListeners();
        var size = 4;
        var geometry = new THREE.CubeGeometry(size, size, size);
        var material = new THREE.MeshPhongMaterial({ color: 0x00FF00 });
        this.changeCooldown = 0;
        this.model = new THREE.Mesh(geometry, material);
        this.pos = new THREE.Vector3(12.5, 12.5, 2);
        this.speed = 0.32;
        this.shotSpeed = 0.7;
        this.model.position = this.pos;
        this.model.castShadow = true;
        this.model.receiveShadow = true;
        this.fired = false;
        this.firingCooldown = 0;
        this.maxHp = 5;
        this.shotDelay = 1;
        this.hp = this.maxHp;
        this.bombs = 1;
        this.keys = 0;
        this.cash = 0;
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
    Player.prototype.eventListeners = function () {
        document.addEventListener('changeRoom', function (e) {
        });
    };

    Player.prototype.update = function () {
        if (this.firingCooldown > 0) {
            this.firingCooldown -= 0.02;
        } else {
            this.fired = false;
        }
        if (this.changeCooldown > 0) {
            this.changeCooldown -= 1;
        }
        this.model.position = this.pos;
    };

    Player.prototype.move = function (obstacles, x, y, world, renderer, entities, roomItems) {
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
                            if (collision.object.position.x === 35 && collision.object.position.y === 41 && _this.changeCooldown === 0) {
                                _this.changeRoom('n', world, renderer, entities, roomItems);
                            }
                        } else if (collision.faceIndex === 2 && y < 0) {
                            velY = 0;
                            if (collision.object.position.x === 35 && collision.object.position.y === -1 && _this.changeCooldown === 0) {
                                _this.changeRoom('s', world, renderer, entities, roomItems);
                            }
                        } else if (collision.faceIndex === 0 && x < 0) {
                            velX = 0;
                            if (collision.object.position.y === 20 && collision.object.position.x === -1 && _this.changeCooldown === 0) {
                                _this.changeRoom('w', world, renderer, entities, roomItems);
                            }
                        } else if (collision.faceIndex === 1 && x > 0) {
                            velX = 0;
                            if (collision.object.position.y === 20 && collision.object.position.x === 71 && _this.changeCooldown === 0) {
                                _this.changeRoom('e', world, renderer, entities, roomItems);
                            }
                        }
                    }
                });
            }
        }
        this.pos.x += velX;
        this.pos.y += velY;
    };

    Player.prototype.changeRoom = function (direction, world, renderer, entities, roomItems) {
        var exits = world.getCurrentRoom().getExits();
        var x = world.getPosition().x;
        var y = world.getPosition().y;
        switch (direction) {
            case 'n':
                if (x === exits[0][0] && y - 1 === exits[0][1]) {
                    world.changeRoom(x, y - 1, renderer, entities, roomItems);
                    this.changeCooldown = 20;
                    this.pos.y = 5;
                    this.pos.x = 35;
                }
                break;
            case 'e':
                if (x + 1 === exits[2][0] && y === exits[2][1]) {
                    world.changeRoom(x + 1, y, renderer, entities, roomItems);
                    this.changeCooldown = 20;
                    this.pos.x = 5;
                    this.pos.y = 20;
                }
                break;
            case 's':
                if (x === exits[1][0] && y + 1 === exits[1][1]) {
                    world.changeRoom(x, y + 1, renderer, entities, roomItems);
                    this.changeCooldown = 20;
                    this.pos.y = 35;
                    this.pos.x = 35;
                }
                break;
            case 'w':
                if (x - 1 === exits[3][0] && y === exits[3][1]) {
                    world.changeRoom(x - 1, y, renderer, entities, roomItems);
                    this.changeCooldown = 20;
                    this.pos.x = 65;
                    this.pos.y = 20;
                }
                break;
        }
    };

    Player.prototype.hasFired = function () {
        return this.fired;
    };

    Player.prototype.firing = function () {
        this.firingCooldown = this.shotDelay;
        this.fired = true;
    };

    Player.prototype.getShotSpeed = function () {
        return this.shotSpeed;
    };

    Player.prototype.getShotDelay = function () {
        return this.shotDelay;
    };

    Player.prototype.addToInventory = function (item) {
        this.inventory.push(item);
    };

    Player.prototype.pickupItem = function (item) {
        this.speed += item.speed;
        this.bombs += item.bombs;
        this.keys += item.keys;
        this.shotSpeed += item.shotSpeed;
        this.maxHp += item.maxHp;
        this.shotDelay += item.shotDelay;
        this.cash += item.cash;

        this.hp = (this.hp + item.hp >= this.maxHp) ? this.hp = this.maxHp : this.hp += item.hp;

        this.armour += item.armour;
        this.addToInventory(item);
    };

    Player.prototype.getInventory = function () {
        return this.inventory;
    };

    Player.prototype.getBombs = function () {
        return this.bombs;
    };

    Player.prototype.getCash = function () {
        return this.cash;
    };

    Player.prototype.getKeys = function () {
        return this.keys;
    };

    Player.prototype.getChangeCooldown = function () {
        return this.changeCooldown;
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
        var material = new THREE.MeshPhongMaterial({ color: 0xFF0000 });
        this.model = new THREE.Mesh(geometry, material);

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
var Room = (function () {
    function Room(position, itemFactory, layoutFactory, floorLayout) {
        this.completed = false;
        this.seen = false;
        this.explored = false;
        this.position = position;
        this.layout = [];
        this.obstacles = [];
        this.meshes = [];
        this.items = [];

        if (this.getRoomCode(floorLayout) === 9) {
            this.layout = layoutFactory.getSpawnRoom();
            this.isSpawn = true;
        } else if (this.getRoomCode(floorLayout) === 2) {
            this.layout = layoutFactory.getShop();
            this.isShop = true;
        } else if (this.getRoomCode(floorLayout) === 3) {
            this.layout = layoutFactory.getItemRoom();
            this.isItemRoom = true;
        } else if (this.getRoomCode(floorLayout) === 4) {
            this.layout = layoutFactory.getBossRoom();
            this.isBossRoom = true;
        } else {
            this.layout = layoutFactory.getRandomLayout();
            this.isSpawn = false;
            this.isShop = false;
            this.isItemRoom = false;
            this.isBossRoom = false;
        }

        this.itemFactory = itemFactory;
        this.tileSize = 5;
        this.locked = (this.isShop || this.isItemRoom);
        this.exits = this.findExits(floorLayout);

        for (var y = 0; y < this.layout.length; y++) {
            this.meshes[y] = [];
            this.meshes[y].length = this.layout[0].length;
        }

        this.generateMeshes();
    }
    Room.prototype.getRoomCode = function (floorLayout) {
        return floorLayout[this.position.y][this.position.x];
    };

    Room.prototype.findExits = function (floorLayout) {
        var directions = [
            [this.position.x, this.position.y - 1],
            [this.position.x, this.position.y + 1],
            [this.position.x + 1, this.position.y],
            [this.position.x - 1, this.position.y]
        ];
        var neighbours = [];
        for (var i = 0; i < directions.length; i++) {
            if (!this.isInvalid(directions[i][0], directions[i][1], floorLayout)) {
                neighbours[i] = directions[i];
            } else {
                neighbours[i] = 0;
            }
        }
        ;
        return neighbours;
    };

    Room.prototype.getExits = function () {
        return this.exits;
    };

    Room.prototype.isInvalid = function (x, y, floorLayout) {
        if (x < 0 || y < 0 || x >= floorLayout[0].length || y >= floorLayout.length) {
            return true;
        }
        return (floorLayout[y][x] === 0);
    };

    Room.prototype.getLayout = function () {
        return this.layout;
    };

    Room.prototype.getCompleted = function () {
        return this.completed;
    };

    Room.prototype.getSeen = function () {
        return this.seen;
    };

    Room.prototype.getExplored = function () {
        return this.explored;
    };

    Room.prototype.setExplored = function () {
        this.explored = true;
        return this;
    };

    Room.prototype.setSeen = function () {
        this.seen = true;
        return this;
    };

    Room.prototype.enterRoom = function () {
        return this;
    };

    Room.prototype.completeRoom = function () {
        this.completed = true;
        return this;
    };

    Room.prototype.generateMeshes = function () {
        var geometry = new THREE.CubeGeometry(this.tileSize, this.tileSize, this.tileSize);
        var material = new THREE.MeshPhongMaterial();
        var darkMaterial = new THREE.MeshPhongMaterial({ color: 0x555555 });
        var doorMaterial = new THREE.MeshPhongMaterial({ color: 0x7A5230 });
        for (var y = 0; y < this.layout.length; y++) {
            for (var x = 0; x < this.layout[0].length; x++) {
                if (this.layout[y][x] !== 1) {
                    var pos = new THREE.Vector3(x * this.tileSize, y * this.tileSize, -3);
                    this.meshes[y][x] = new THREE.Mesh(geometry, material);
                    this.meshes[y][x].position = pos;
                    this.meshes[y][x].castShadow = false;
                    this.meshes[y][x].receiveShadow = true;
                } else {
                    var pos = new THREE.Vector3();
                    if (x === 7 && y === 8 && this.exits[0] !== 0) {
                        pos = new THREE.Vector3(x * this.tileSize, (y * this.tileSize) + 1, 1);
                        this.meshes[y][x] = new THREE.Mesh(new THREE.CubeGeometry(this.tileSize, this.tileSize - 2, this.tileSize), doorMaterial);
                    } else if (x === 7 && y === 0 && this.exits[1] !== 0) {
                        pos = new THREE.Vector3(x * this.tileSize, (y * this.tileSize) - 1, 1);
                        this.meshes[y][x] = new THREE.Mesh(new THREE.CubeGeometry(this.tileSize, this.tileSize - 2, this.tileSize), doorMaterial);
                    } else if (x === 0 && y === 4 && this.exits[3] !== 0) {
                        pos = new THREE.Vector3((x * this.tileSize) - 1, y * this.tileSize, 1);
                        this.meshes[y][x] = new THREE.Mesh(new THREE.CubeGeometry(this.tileSize - 2, this.tileSize, this.tileSize), doorMaterial);
                    } else if (x === 14 && y === 4 && this.exits[2] !== 0) {
                        pos = new THREE.Vector3((x * this.tileSize) + 1, y * this.tileSize, 1);
                        this.meshes[y][x] = new THREE.Mesh(new THREE.CubeGeometry(this.tileSize - 2, this.tileSize, this.tileSize), doorMaterial);
                    } else {
                        pos = new THREE.Vector3(x * this.tileSize, y * this.tileSize, 1);
                        this.meshes[y][x] = new THREE.Mesh(geometry, darkMaterial);
                    }
                    this.meshes[y][x].position = pos;
                    this.meshes[y][x].castShadow = true;
                    this.meshes[y][x].receiveShadow = true;
                    this.obstacles.push(this.meshes[y][x]);
                }

                if (this.layout[y][x] === 2) {
                    var pos = new THREE.Vector3(x * this.tileSize, y * this.tileSize, 1);
                    var item = this.itemFactory.itemPoolRandom();
                    item.setPosition(pos);
                    this.items.push(item);
                    this.layout[y][x] = 0;
                }
                if (this.layout[y][x] === 3) {
                    var pos = new THREE.Vector3(x * this.tileSize, y * this.tileSize, 1);
                    var item = this.itemFactory.collectablePoolRandom();
                    item.getModel().position = pos;
                    item.setPosition(pos);
                    this.items.push(item);
                }
            }
        }
    };

    Room.prototype.removeItem = function (item) {
        this.items.splice(this.items.indexOf(item), 1);
    };

    Room.prototype.unlockRoom = function () {
        this.locked = false;
    };

    Room.prototype.getItems = function () {
        return this.items;
    };

    Room.prototype.getObstacles = function () {
        return this.obstacles;
    };

    Room.prototype.getMeshes = function () {
        return this.meshes;
    };

    Room.prototype.setIsSpawn = function () {
        this.isSpawn = true;
        return this;
    };

    Room.prototype.getIsSpawn = function () {
        return this.isSpawn;
    };

    Room.prototype.setIsShop = function () {
        this.isShop = true;
        return this;
    };

    Room.prototype.getIsShop = function () {
        return this.isShop;
    };

    Room.prototype.setIsItemRoom = function () {
        this.isItemRoom = true;
        return this;
    };

    Room.prototype.getIsItemRoom = function () {
        return this.isItemRoom;
    };

    Room.prototype.getIsBossRoom = function () {
        return this.isBossRoom;
    };

    Room.prototype.setIsBossRoom = function () {
        this.isBossRoom = true;
        return this;
    };
    return Room;
})();
var Utils = (function () {
    function Utils() {
    }
    Utils.prototype.shuffleArray = function (array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    };
    return Utils;
})();
var RoomLayoutBuilder = (function () {
    function RoomLayoutBuilder() {
    }
    RoomLayoutBuilder.prototype.getSpawnRoom = function () {
        return [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ];
    };

    RoomLayoutBuilder.prototype.getBossRoom = function () {
        return [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ];
    };

    RoomLayoutBuilder.prototype.getItemRoom = function () {
        return [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ];
    };

    RoomLayoutBuilder.prototype.getShop = function () {
        return [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 2, 3, 3, 3, 3, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ];
    };

    RoomLayoutBuilder.prototype.getRandomLayout = function () {
        var possible = [
            [
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
            ],
            [
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
                [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
                [1, 0, 0, 0, 0, 0, 3, 0, 3, 0, 0, 0, 0, 0, 1],
                [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
                [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
            ],
            [
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
            ],
            [
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 1, 1, 3, 1, 1, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
            ]
        ];
        return possible[Math.floor(Math.random() * possible.length)];
    };
    return RoomLayoutBuilder;
})();
var FloorGenerator = (function () {
    function FloorGenerator(w, h, max, itemFactory) {
        this.width = w;
        this.height = h;
        this.maxRooms = max;
        this.rooms = [];
        this.layout = this.initLayout();
        this.itemFactory = itemFactory;
        this.layoutBuilder = new RoomLayoutBuilder();

        var spawnLocation = new Utils().shuffleArray([
            [2, 4],
            [2, 5],
            [2, 6],
            [3, 4],
            [3, 5],
            [3, 6]
        ])[0];

        this.spawn = {
            x: spawnLocation[1],
            y: spawnLocation[0]
        };
    }
    FloorGenerator.prototype.getSpawn = function () {
        return new THREE.Vector2(this.spawn.x, this.spawn.y);
    };

    FloorGenerator.prototype.generate = function () {
        this.layout[this.spawn.y][this.spawn.x] = 1;
        this.rooms.push([this.spawn.x, this.spawn.y]);
        this.makeRoom(this.spawn.x, this.spawn.y);
        this.layout[this.spawn.y][this.spawn.x] = 9;
        return this;
    };

    FloorGenerator.prototype.build = function () {
        var floor = this.initLayout();
        for (var y = 0; y < this.height; y++) {
            for (var x = 0; x < this.width; x++) {
                if (this.layout[y][x] !== 0) {
                    floor[y][x] = new Room(new THREE.Vector2(x, y), this.itemFactory, this.layoutBuilder, this.layout);
                }
            }
        }
        return floor;
    };

    FloorGenerator.prototype.makeRoom = function (x, y) {
        if (this.rooms.length >= this.maxRooms) {
            return;
        }
        var neighbours = this.getNeighbours(x, y);
        var chanceIt = true;
        if (neighbours.length > 2) {
            chanceIt = (Math.floor(Math.random() * 10) < 5);
        }
        if (neighbours[0] !== undefined && chanceIt) {
            var nx = neighbours[0][0];
            var ny = neighbours[0][1];
            this.layout[ny][nx] = 1;
            this.rooms.push([nx, ny]);
        }
        var next = this.getNextRoom();
        this.makeRoom(next[0], next[1]);
    };

    FloorGenerator.prototype.getNextRoom = function () {
        return this.rooms[Math.floor(Math.random() * this.rooms.length)];
    };

    FloorGenerator.prototype.getNeighbours = function (x, y) {
        var directions = new Utils().shuffleArray([
            [x, y - 1],
            [x, y + 1],
            [x + 1, y],
            [x - 1, y]
        ]);
        var neighbours = [];
        var _this = this;
        directions.forEach(function (direction) {
            if (!_this.isInvalid(direction[0], direction[1])) {
                neighbours.push(direction);
            }
        });
        return neighbours;
    };

    FloorGenerator.prototype.initLayout = function () {
        var a = [];
        a.length = this.height;
        for (var y = 0; y < this.height; y++) {
            a[y] = [];
            a[y].length = this.width;
            for (var x = 0; x < this.width; x++) {
                a[y][x] = 0;
            }
        }
        return a;
    };

    FloorGenerator.prototype.isInvalid = function (x, y) {
        if (x < 0 || y < 0 || x >= this.width || y >= this.height) {
            return true;
        }
        return (this.layout[y][x] === 1);
    };
    return FloorGenerator;
})();
var Floor = (function () {
    function Floor(itemFactory) {
        var fg = new FloorGenerator(9, 6, 10, itemFactory);
        this.layout = fg.generate().build();
        this.spawn = fg.getSpawn();
    }
    Floor.prototype.getSpawn = function () {
        return this.spawn;
    };

    Floor.prototype.getRoom = function (x, y) {
        return this.layout[y][x];
    };

    Floor.prototype.getLayout = function () {
        return this.layout;
    };
    return Floor;
})();
var World = (function () {
    function World(texture, tileSize, itemPool, collectablePool) {
        this.roomOffsets = new THREE.Vector2(70, 40);
        this.tileSize = tileSize;
        this.texture = texture;

        this.itemFactory = new ItemFactory(itemPool, collectablePool);
        this.items = [];

        this.depth = 0;
        this.maxDepth = 1;

        this.floors = [];
        for (var d = 0; d < this.maxDepth; d++) {
            this.floors[d] = new Floor(this.itemFactory);
        }

        this.mapPos = this.getSpawnRoom();

        this.meshes = [];
        this.obstacles = [];

        this.generateRoomMeshes(this.floors[this.depth], this.mapPos.x, this.mapPos.y);
        this.setNeighboursSeen(this.getCurrentRoom());
        this.getCurrentRoom().setSeen().setExplored();
    }
    World.prototype.getPosition = function () {
        return this.mapPos;
    };

    World.prototype.removeItem = function (item) {
        this.items.splice(this.items.indexOf(item), 1);
    };

    World.prototype.changeRoom = function (x, y, renderer, entities, roomItems) {
        this.meshes.forEach(function (mesh) {
            mesh.forEach(function (submesh) {
                renderer.scene.remove(submesh);
            });
        });
        entities.forEach(function (mesh) {
            renderer.scene.remove(mesh.getModel());
        });
        roomItems.forEach(function (item) {
            renderer.scene.remove(item.getModel());
        });

        entities = [];
        roomItems = [];

        this.mapPos = new THREE.Vector2(x, y);
        this.meshes = [];
        this.obstacles = [];
        this.items = [];

        this.generateRoomMeshes(this.floors[this.depth], this.mapPos.x, this.mapPos.y);
        this.getCurrentRoom().setExplored();
        this.setNeighboursSeen(this.getCurrentRoom());
        for (var y = 0; y < this.meshes.length; y++) {
            for (var x = 0; x < this.meshes[0].length; x++) {
                renderer.scene.add(this.meshes[y][x]);
            }
        }
        var event = document.createEvent('CustomEvent');
        event.initEvent('changeRoom', true, true);
        document.dispatchEvent(event);
    };

    World.prototype.setNeighboursSeen = function (room) {
        var exits = room.getExits();
        var _this = this;
        exits.forEach(function (exit) {
            if (exit === 0) {
                return;
            }
            _this.floors[_this.depth].getRoom(exit[0], exit[1]).setSeen();
        });
    };

    World.prototype.getSpawnRoom = function () {
        return this.floors[this.depth].getSpawn();
    };

    World.prototype.generateRoomMeshes = function (floor, x, y) {
        var room = floor.getRoom(x, y);
        this.meshes = room.getMeshes();
        this.obstacles = room.getObstacles();
        this.items = room.getItems();
    };

    World.prototype.getCurrentRoom = function () {
        return this.floors[this.depth].getRoom(this.mapPos.x, this.mapPos.y);
    };

    World.prototype.getCurrentFloor = function () {
        return this.floors[this.depth];
    };

    World.prototype.getObstacles = function () {
        return this.obstacles;
    };

    World.prototype.getModel = function (x, y) {
        return this.meshes[y][x];
    };

    World.prototype.getRoomItems = function () {
        return this.items;
    };
    return World;
})();
var UI = (function () {
    function UI() {
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
    UI.prototype.draw = function () {
    };

    UI.prototype.update = function (player, world) {
        this.clear();
        this.background();
        this.messageLog();
        this.miniMap(world);
        this.debug(player);
    };

    UI.prototype.background = function () {
        this.context.fillStyle = '#1a1917';
        this.context.fillRect(0, 0, this.canvas.width, 185);
        this.context.fillRect(0, 0, 170, this.canvas.height);
        this.context.fillRect(this.canvas.width - 170, 0, 170, this.canvas.height);
        this.context.fill();
    };

    UI.prototype.messageLog = function () {
        this.context.font = '12pt monospace';
        this.context.fillStyle = 'white';
        this.context.textAlign = 'right';
        var startY = this.canvas.height - 30;
        for (var i = this.messages.length - 1; i >= 0; i--) {
            this.context.fillText(this.messages[i], this.canvas.width - 20, startY);
            startY -= 16;
        }
    };

    UI.prototype.miniMap = function (world) {
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
    };

    UI.prototype.addMessage = function (str) {
        this.messages.push(str);
        if (this.messages.length > 5) {
            this.messages.splice(0, 1);
        }
    };

    UI.prototype.clear = function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.canvas.width = this.canvas.width;
    };

    UI.prototype.debug = function (player) {
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
        context.textAlign = 'left';
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
        this.eventListeners();

        this.width = 13;
        this.height = 7;
        this.tileSize = 5;

        var spawnPos = new THREE.Vector3(((this.width * this.tileSize) / 2) + (this.tileSize / 2), ((this.height * this.tileSize) / 2) + (this.tileSize / 2), 1.5);

        this.itemPool = new ItemPools().getItemPool();
        this.collectablePool = new ItemPools().getCollectablePool();

        this.renderer = new Renderer(this.width, this.height, this.tileSize);
        this.input = new Input();
        this.cf = new CreatureFactory();
        this.player = this.cf.spawnPlayer(spawnPos);
        this.world = new World(THREE.ImageUtils.loadTexture('../assets/test.png'), this.tileSize, this.itemPool, this.collectablePool);
        this.entities = [];
        this.ui = new UI();

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
    Game.prototype.eventListeners = function () {
        var _this = this;
        document.addEventListener('changeRoom', function (e) {
            _this.roomItems = _this.world.getRoomItems();
            _this.roomItems.forEach(function (item) {
                _this.renderer.scene.add(item.getModel());
            });
        });
    };

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
    };

    Game.prototype.handleKeys = function () {
        var projectile = null;
        var obstacles = this.world.getObstacles();
        if (this.input.isPressed('65')) {
            this.player.move(obstacles, -this.player.speed, 0, this.world, this.renderer, this.entities, this.roomItems);
        }
        if (this.input.isPressed('68')) {
            this.player.move(obstacles, this.player.speed, 0, this.world, this.renderer, this.entities, this.roomItems);
        }
        if (this.input.isPressed('83')) {
            this.player.move(obstacles, 0, -this.player.speed, this.world, this.renderer, this.entities, this.roomItems);
        }
        if (this.input.isPressed('87')) {
            this.player.move(obstacles, 0, this.player.speed, this.world, this.renderer, this.entities, this.roomItems);
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
    };
    return Game;
})();
var g = new Game();
