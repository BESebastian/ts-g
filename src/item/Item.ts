class Item implements Drawable, Updatable {

    private model:      THREE.Object3D;
    private pos:        THREE.Vector3;
    private speed:      number;
    private hp:         number;
    private maxHp:      number;
    private armour:     number;
    private shotSpeed:  number;
    private shotDelay:  number;
    private name:       string;
    private rays;
    private distance:   number;
    private caster:     THREE.Raycaster;

    constructor(name: string) {
        this.name = name;
        this.speed = 0;
        this.hp = 0;
        this.maxHp = 0;
        this.armour = 0;
        this.shotSpeed = 0;
        this.shotDelay = 0;

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

    public draw():void {}

    public update():void {
        this.model.position = this.pos;
        this.model.rotation.x += 0.01;
        this.model.rotation.y += 0.01;
    }

    private handlePickup(player: Player):boolean {
        var returnVal = true;
        if (this.maxHp === 0 && this.hp > 0 && player.getHp() === player.getMaxHp()) {
            return false;
        }
        return true;
    }

    public checkCollision(player: Player):boolean {
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
    }

    public getName():string {
        return this.name;
    }

    public setModel(model: THREE.Object3D):Item {
        this.model = model || this.model;
        return this;
    }

    public getModel():THREE.Object3D {
        return this.model;
    }

    public setPosition(vector: THREE.Vector3):Item {
        this.pos = vector;
        return this;
    }

    public setSpeed(amt: number):Item {
        this.speed = amt;
        return this;
    }

    public setHp(amt: number):Item {
        this.hp = amt;
        return this;
    }

    public setMaxHp(amt: number):Item {
        this.maxHp = amt;
        return this;
    }

    public setArmour(amt: number):Item {
        this.armour = amt;
        return this;
    }

    public setShotSpeed(amt: number):Item {
        this.shotSpeed = amt;
        return this;
    }

    public setShotDelay(amt: number):Item {
        this.shotDelay = amt;
        return this;
    }

}
