///<reference path='Creature.ts'/>

class Player extends Creature {

    private fired:          boolean;
    private firingCooldown: number;
    private shotSpeed:      number;
    private shotDelay:      number;
    private bombs:          number;
    private keys:           number;
    private inventory:      Item[];
    public  rays:           any[];
    public  distance:       number;
    public  caster:         THREE.Raycaster;
    private changeCooldown: number;

    constructor() {
        super();
        this.eventListeners();
        var size = 4;
        var geometry = new THREE.CubeGeometry(size, size, size);
        var material = new THREE.MeshPhongMaterial({ color: 0x00FF00 });
        this.changeCooldown = 0;
        this.model = new THREE.Mesh(geometry, material);
        this.pos = new THREE.Vector3(12.5, 12.5, 2);
        this.speed = 0.3;
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

    private eventListeners():void {
        document.addEventListener('changeRoom', function (e) {
            console.log('player changeRoom event', e);
        });
    }

    public update():void {
        if (this.firingCooldown > 0) {
            this.firingCooldown -= 0.02;
        } else {
            this.fired = false;
        }
        if (this.changeCooldown > 0) {
            this.changeCooldown -= 1;
        }
        this.model.position = this.pos;
    }

    public move(obstacles, x: number, y: number, world, renderer, entities):void {
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
                            if (collision.object.position.x === 35 && _this.changeCooldown === 0) {
                                _this.changeRoom('n', world, renderer, entities);
                            }
                        } else if (collision.faceIndex === 2 && y < 0) {
                            velY = 0
                            if (collision.object.position.x === 35 && _this.changeCooldown === 0) {
                                _this.changeRoom('s', world, renderer, entities);
                            }
                        } else if (collision.faceIndex === 0 && x < 0) {
                            velX = 0;
                            if (collision.object.position.y === 20 && _this.changeCooldown === 0) {
                                _this.changeRoom('w', world, renderer, entities);
                            }
                        } else if (collision.faceIndex === 1 && x > 0) {
                            velX = 0;
                            if (collision.object.position.y === 20 && _this.changeCooldown === 0) {
                                _this.changeRoom('e', world, renderer, entities);
                            }
                        }
                    }
                });
            }
        }
        this.pos.x += velX;
        this.pos.y += velY;
    }

    private changeRoom(direction: string, world, renderer, entities) {
        var exits = world.getCurrentRoom().getExits();
        var x = world.getPosition().x;
        var y = world.getPosition().y;
        switch (direction) {
            case 'n':
                if (x === exits[0][0] && y - 1 === exits[0][1]) {
                    world.changeRoom(x, y - 1, renderer, entities);
                    this.changeCooldown = 20;
                    this.pos.y = 5;
                    this.pos.x = 35;
                }
                break;
            case 'e':
                if (x + 1 === exits[2][0] && y === exits[2][1]) {
                    world.changeRoom(x + 1, y, renderer, entities);
                    this.changeCooldown = 20;
                    this.pos.x = 5;
                    this.pos.y = 20;
                }
                break;
            case 's':
                if (x === exits[1][0] && y + 1 === exits[1][1]) {
                    world.changeRoom(x, y + 1, renderer, entities);
                    this.changeCooldown = 20;
                    this.pos.y = 35;
                    this.pos.x = 35;
                }
                break;
            case 'w':
                if (x - 1 === exits[3][0] && y === exits[3][1]) {
                    world.changeRoom(x - 1, y, renderer, entities);
                    this.changeCooldown = 20;
                    this.pos.x = 65;
                    this.pos.y = 20;
                }
                break;
        }
    }

    public hasFired():boolean {
        return this.fired;
    }

    public firing():void {
        this.firingCooldown = this.shotDelay;
        this.fired = true;
    }

    public getShotSpeed():number {
        return this.shotSpeed;
    }

    public getShotDelay():number {
        return this.shotDelay;
    }

    public addToInventory(item: Item):void {
        this.inventory.push(item);
    }

    public pickupItem(item):void {
        this.speed += item.speed;
        this.bombs += item.bombs;
        this.keys += item.keys;
        this.shotSpeed += item.shotSpeed;
        this.maxHp += item.maxHp;
        this.shotDelay += item.shotDelay;

        this.hp = (this.hp + item.hp >= this.maxHp)
            ? this.hp = this.maxHp
            : this.hp += item.hp

        this.armour += item.armour;
        this.addToInventory(item);
    }

    public getInventory() {
        return this.inventory;
    }

    public getBombs():number {
        return this.bombs;
    }

    public getKeys():number {
        return this.keys;
    }

    public getChangeCooldown():number {
        return this.changeCooldown;
    }
}
