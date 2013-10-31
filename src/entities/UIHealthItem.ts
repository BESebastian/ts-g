///<reference path="Thing.ts" />

class UIHealthItem extends Thing {

    constructor() {
        super();
        var geometry = new THREE.CubeGeometry(1, 1, 1);
        var material = new THREE.MeshPhongMaterial();
        material.color.setHex(0xFF0000);
        this.pos = new THREE.Vector3(20, 20, 1);
        this.model = THREE.SceneUtils.createMultiMaterialObject(geometry, [material]);
    }

    public update():void {
        console.log('update');
        this.model.rotation.x += 0.01;
        this.model.rotation.y += 0.01;
    }

    public checkCollision():void {
    
    }

}
