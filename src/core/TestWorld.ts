class TestWorld {

    private model: THREE.Mesh;

    constructor() {
        var geometry = new THREE.PlaneGeometry(40, 20);
        var material = new THREE.MeshPhongMaterial({ color: 0x777777 });
        this.model = new THREE.Mesh(geometry, material);
        this.model.receiveShadow = true;
        this.model.castShadow = true;
    }

    public getModel():THREE.Mesh {
        return this.model;
    }


}
