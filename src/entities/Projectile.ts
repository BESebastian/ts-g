class Projectile {

    public  pos:        THREE.Vector3;
    public  model:      THREE.Mesh;
    public  velocity:   any;

    constructor(vector, velX: number, velY: number, velZ: number) {
        this.pos = new THREE.Vector3(vector.x, vector.y, vector.z);
        var geometry = new THREE.CubeGeometry(0.5, 0.5, 0.5);
        var material = new THREE.MeshPhongMaterial({ color: 0xff0000 });
        this.model = new THREE.Mesh(geometry, material);
        this.model.position = this.pos;
        this.model.castShadow = true;
        this.model.receiveShadow = true;
        this.velocity = {
            x: velX,
            y: velY,
            z: velZ
        };
    }

    public update():void {
        this.pos.x += this.velocity.x;
        this.pos.y += this.velocity.y;
        if (this.pos.z - this.velocity.z > 0) {
            this.pos.z += this.velocity.z;
        }
        if (this.velocity.x > this.velocity.y) {
            this.model.rotation.x += 0.3;
        } else {
            this.model.rotation.y += 0.3;
        }
        this.model.position = this.pos;
    }

    public getModel():THREE.Mesh {
        return this.model;
    }

}
