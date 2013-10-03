class TestWorld {

    private model:  THREE.Mesh;
    public  bound:  number;
    public  world;
    public  meshes: THREE.Mesh[][];

    constructor() {
        this.bound = 5;

        var geometry = new THREE.PlaneGeometry(40, 20);
        var material = new THREE.MeshPhongMaterial({ color: 0x777777 });
        this.model = new THREE.Mesh(geometry, material);
        this.model.receiveShadow = true;
        this.model.castShadow = true;

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
        var geometry = new THREE.CubeGeometry(5, 5, 5);
        var material = new THREE.MeshPhongMaterial({ color: 0xffffff });
        for (var x = 0; x < this.bound; x++) {
            for (var y = 0; y < this.bound; y++) {
                this.meshes[x][y] = new THREE.Mesh(geometry, material);
                this.meshes[x][y].position = new THREE.Vector3(x * 5, y * 5, -5);
                this.meshes[x][y].receiveShadow = true;
                this.meshes[x][y].castShadow = true;
            }
        }
    }

    public getModel(x: number, y: number):THREE.Mesh {
        return this.meshes[x][y];
    }


}
