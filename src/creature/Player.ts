///<reference path='Creature.ts'/>

class Player extends Creature {

    private fired:          boolean;
    private firingCooldown: number;

    constructor() {
        super();
        var geometry = new THREE.CubeGeometry(1, 1, 1);
        var shadeMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.5 });
        var edgeMat = new THREE.MeshBasicMaterial({ color: 0x00FF00, wireframe: true, transparent: true, wireframeLinewidth: 3 });
        this.model = THREE.SceneUtils.createMultiMaterialObject(geometry, [shadeMat, edgeMat]);
        this.pos = new THREE.Vector3(12.5, 12.5, 2);
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
