///<reference path='Creature.ts'/>

class Player extends Creature {

    private fired:          boolean;
    private firingCooldown: number;

    constructor() {
        super();
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

    public update():void {
        if (this.firingCooldown > 0) {
            this.firingCooldown -= 1;
        } else {
            this.fired = false;
        }
        this.model.position = this.pos;
    }

    public hasFired():boolean {
        return this.fired;
    }

    public firing():void {
        this.firingCooldown = 50;
        this.fired = true;
    }

}
