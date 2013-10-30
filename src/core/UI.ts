class UI {

    private hp: number;
    private hpMesh;

    constructor() {
        this.hp = 0;

        var geometry = new THREE.CubeGeometry(2, 2, 2);
        var material = new THREE.MeshPhongMaterial();
        material.color.setHex(0xFF0000);
        this.hpMesh = THREE.SceneUtils.createMultiMaterialObject(geometry, [material]);
        this.hpMesh.position = new THREE.Vector3(20, 20, 1);
    }

    public draw():void {
        //this.drawHp();
    }

    public update(scene: THREE.Scene, hp: number):void {
        this.hp = hp;
        for (var i = 0; i < this.hp; i++) {
            scene.add(this.hpMesh);
        }
        this.hpMesh.rotation.x += 0.01;
        this.hpMesh.rotation.y += 0.01;
    }

}
