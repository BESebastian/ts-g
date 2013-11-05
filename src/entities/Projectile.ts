///<reference path="Thing.ts" />

class Projectile extends Thing {

    public  pos:        THREE.Vector3;
    public  velocity:   any;
    public  rays;
    public  distance:   number;
    public  caster:     THREE.Raycaster;

    constructor(vector, velX: number, velY: number, velZ: number) {
        super();
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

        // Collision detection guff
        this.caster = new THREE.Raycaster();
        this.distance = 1;
        this.rays = [
            new THREE.Vector3(1, 0, 0),
            new THREE.Vector3(-1, 0, 0),
            new THREE.Vector3(0, 1, 0),
            new THREE.Vector3(0, -1, 0),
        ];
    }

    public checkCollision(obstacles):boolean {
        var collisions = [];
        for (var i = 0; i < this.rays.length; i++) {
            this.caster.set(this.model.position, this.rays[i]);
            collisions = this.caster.intersectObjects(obstacles, true);
            if (collisions.length > 0 && collisions[0].distance <= this.distance) {
                return true;
            }
        }
        return false;
    }

    public update():void {
        this.pos.x += this.velocity.x;
        this.pos.y += this.velocity.y;
        if (this.pos.z - this.velocity.z > 0) {
            this.pos.z += this.velocity.z;
        }
        this.model.position = this.pos;
    }
}
