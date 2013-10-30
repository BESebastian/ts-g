class UIHealthItem extends Entity {

    constructor() {
        super();
        var geometry = new THREE.CubeGeometry(2, 2, 2);
        var material = new THREE.MeshPhongMaterial();
        material.color.setHex(0xFF0000);
        this.pos = new THREE.Vector3(20, 20, 1);
        this.model = THREE.SceneUtils.createMultiMaterialObject(geometry, [material]);
    }

}
