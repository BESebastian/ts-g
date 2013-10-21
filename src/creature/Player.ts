///<reference path='Creature.ts'/>

class Player extends Creature implements Collider {

    private fired:          boolean;
    private firingCooldown: number;
    private shotSpeed:      number;
    public  rays;
    public  distance:       number;
    public  caster:         THREE.Raycaster;

    constructor() {
        super();
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

        this.caster = new THREE.Raycaster();
        this.distance = 5;
        this.rays = [
            new THREE.Vector3(-1, 0, 0),
            new THREE.Vector3(1, 0, 0),
            new THREE.Vector3(0, 1, 0),
            new THREE.Vector3(0, -1, 0)
        ];
    }

    public checkCollision(obstacles):boolean {
        return false;
    }

    public update():void {
        if (this.firingCooldown > 0) {
            this.firingCooldown -= 1;
        } else {
            this.fired = false;
        }
        this.model.rotation.x += 0.01;
        this.model.rotation.y += 0.01;
        this.model.position = this.pos;
    }

    public move(obstacles, x: number, y: number):void {
        var collisions = [];
        for (var i = 0; i < this.rays.length; i++) {
            this.caster.set(this.model.position, this.rays[i]);
            collisions = this.caster.intersectObjects(obstacles, true);
            if (collisions.length > 0 && collisions[0].distance <= this.distance) {
                console.log(collisions);
            }
        }
        this.pos.x += x;
        this.pos.y += y;
    }

    public hasFired():boolean {
        return this.fired;
    }

    public firing():void {
        this.firingCooldown = 50;
        this.fired = true;
    }

    public getShotSpeed():number {
        return this.shotSpeed;
    }

}
