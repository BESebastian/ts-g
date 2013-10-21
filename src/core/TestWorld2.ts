class TestWorld2 {

    public  tileSize:   number;
    public  meshes:     THREE.Object3D[][];
    public  map;
    private texture:    THREE.Texture;
    private obstacles;

    constructor(texture, tileSize) {
        this.tileSize = tileSize;
        this.texture = texture;

        this.map = [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ];

        this.meshes = [];
        this.obstacles = [];

        for (var i = 0; i < this.map.length; i++) {
            this.meshes[i] = [];
        }

        this.generateMeshes();
    }

    private generateMeshes():void {
        var geometry = new THREE.CubeGeometry(this.tileSize, this.tileSize, this.tileSize);
        var material = new THREE.MeshPhongMaterial();
        for (var y = 0; y < this.map.length; y++) {
            for (var x = 0; x < this.map[0].length; x++) {
                var pos = (this.map[y][x] === 1)
                    ? new THREE.Vector3(x * this.tileSize, y * this.tileSize, 1)
                    : new THREE.Vector3(x * this.tileSize, y * this.tileSize, -3);
                this.meshes[y][x] = THREE.SceneUtils.createMultiMaterialObject(geometry, [material]);
                this.meshes[y][x].position = pos;
                this.meshes[y][x].receiveShadow = true;
                this.meshes[y][x].castShadow = true;
                if (this.map[y][x] === 1) {
                    this.obstacles.push(this.meshes[y][x]);
                }
            }
        }
    }

    public getObstacles() {
        return this.obstacles;
    }

    public testUpdate() {
        this.meshes.forEach(function (mesh) {
            mesh.forEach(function (m) {
                m.rotation.x -= 0.01;
                m.rotation.y -= 0.01;
            })
        });
    }

    public getModel(x: number, y: number):THREE.Object3D {
        return this.meshes[y][x];
    }
}
