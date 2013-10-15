class Projectile implements Updatable {

    public  pos:        THREE.Vector3;
    public  model:      THREE.Object3D;
    public  velocity:   any;

    constructor(vector, velX: number, velY: number, velZ: number) {
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
    }

    public update():void {
        this.pos.x += this.velocity.x;
        this.pos.y += this.velocity.y;
        if (this.pos.z - this.velocity.z > 0) {
            this.pos.z += this.velocity.z;
        }
        this.model.position = this.pos;
    }

    public getModel():THREE.Object3D {
        return this.model;
    }

}
