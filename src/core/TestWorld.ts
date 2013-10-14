class TestWorld {

    public  bound:      number;
    public  width:      number;
    public  height:     number;
    public  world:      number[][];
    public  meshes:     THREE.Object3D[][];
    private texture:    THREE.Texture;

    constructor(texture: THREE.Texture, width, height, tileSize) {
        this.bound = tileSize;
        this.width = width;
        this.height = height;
        this.texture = texture;

        this.world = [];
        this.meshes = [];

        for (var i = 0; i < this.height; i++) {
            this.world[i] = [];
            this.meshes[i] = [];
        }

        this.generateWorld();
        this.generateMeshes();
    }

    private generateWorld():void {
        for (var y = 0; y < this.height; y++) {
            for (var x = 0; x < this.width; x++) {
                this.world[y][x] = 1;
            }
        }
    }

    private generateMeshes():void {
        var geometry = new THREE.CubeGeometry(this.bound, this.bound, 1);
        var material = new THREE.MeshPhongMaterial({ map: this.texture });
        var material2 = new THREE.MeshBasicMaterial({ wireframe: true, wireframeLinewidth: 3 });
        for (var y = 0; y < this.height; y++) {
            for (var x = 0; x < this.width; x++) {
                this.meshes[y][x] = THREE.SceneUtils.createMultiMaterialObject(geometry, [material, material2]);
                this.meshes[y][x].position = new THREE.Vector3(x * this.bound, y * this.bound, -5);
                this.meshes[y][x].receiveShadow = true;
                this.meshes[y][x].castShadow = true;
            }
        }
    }

    public getModel(x: number, y: number):THREE.Object3D {
        return this.meshes[y][x];
    }


}
