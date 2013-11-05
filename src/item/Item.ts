class Item implements Drawable, Updatable {

    private model:  THREE.Object3D;
    private pos:    THREE.Vector3;
    private speed:  number;
    private hp:     number;
    private maxHp:  number;
    private name:   string;

    constructor(name: string) {
        this.name = name;
        this.speed = 0;
        this.hp = 0;

        var geometry = new THREE.CubeGeometry(1, 1, 1);
        var material = new THREE.MeshPhongMaterial({ color: 0xFF0000 });
        this.model = THREE.SceneUtils.createMultiMaterialObject(geometry, [material]);
    }

    public draw():void {}

    public update():void {
        this.model.position = this.pos;
        this.model.rotation.x += 0.01;
        this.model.rotation.y += 0.01;
    }

    public checkCollision(player: Player):boolean {
        return false;
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

}
