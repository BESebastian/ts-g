///<reference path="../entities/UIHealthItem.ts" />

class UI {

    private hp:         number;
    private prevHp:     number;
    private hpGeometry: THREE.CubeGeometry;
    private hpMaterial: THREE.MeshPhongMaterial;
    private defaultPos: THREE.Vector3;

    constructor() {
        this.hp = 0;

        this.hpGeometry = new THREE.CubeGeometry(2, 2, 2);
        this.hpMaterial = new THREE.MeshPhongMaterial();
        this.hpMaterial.color.setHex(0xFF0000);
        this.defaultPos = new THREE.Vector3(20, 20, 1);
    }

    public draw():void {
        //this.drawHp();
    }

    public update(scene: THREE.Scene, hp: number):void {
        this.prevHp = this.hp;
        this.hp = hp;
        if (this.hp !== this.prevHp) {
            for (var i = 0; i < this.hp; i++) {
                var mesh = new UIHealthItem().getModel();
                mesh.position = this.defaultPos;
                mesh.position.x += i * 2;
                scene.add(mesh);
            }
        }
    }

}
