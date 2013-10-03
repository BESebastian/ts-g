class TestWorld {

    public  bound:      number;
    public  world:      number[][];
    public  meshes:     THREE.Object3D[][];
    private texture:    THREE.Texture;

    constructor(texture: THREE.Texture) {
        this.bound = 5;
        this.texture = texture;

        this.world = [];
        this.meshes = [];

        for (var i = 0; i < this.bound; i++) {
            this.world[i] = [];
            this.meshes[i] = [];
        }

        this.generateWorld();
        this.generateMeshes();
    }

    private generateWorld():void {
        for (var x = 0; x < this.bound; x++) {
            for (var y = 0; y < this.bound; y++) {
                this.world[x][y] = 1;
            }
        }
    }

    private generateMeshes():void {
        var geometry = new THREE.CubeGeometry(this.bound, this.bound, 1);
        var material = new THREE.MeshPhongMaterial({ map: this.texture });
        for (var x = 0; x < this.bound; x++) {
            for (var y = 0; y < this.bound; y++) {
                this.meshes[x][y] = THREE.SceneUtils.createMultiMaterialObject(geometry, [material]);
                this.meshes[x][y].position = new THREE.Vector3(x * this.bound, y * this.bound, -5);
                this.meshes[x][y].receiveShadow = true;
                this.meshes[x][y].castShadow = true;
            }
        }
    }

    public getModel(x: number, y: number):THREE.Object3D {
        return this.meshes[x][y];
    }


}
