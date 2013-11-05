class TestWorld2 {

    public  tileSize:       number;
    public  meshes:         THREE.Object3D[][];
    public  map;
    private texture:        THREE.Texture;
    private obstacles;
    private items;
    private itemFactory:    ItemFactory;

    constructor(texture, tileSize) {
        this.tileSize = tileSize;
        this.texture = texture;

        this.itemFactory = new ItemFactory();
        this.items = [];

        this.map = [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 1],
            [1, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 1],
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
                if (this.map[y][x] === 0 || this.map[y][x] === 2 || this.map[y][x] === 3) {
                    var pos = new THREE.Vector3(x * this.tileSize, y * this.tileSize, -3);
                    this.meshes[y][x] = new THREE.Mesh(geometry, material);
                    this.meshes[y][x].position = pos;
                    this.meshes[y][x].castShadow = true;
                    this.meshes[y][x].receiveShadow = true;
                } else if (this.map[y][x] === 1) {
                    var pos = new THREE.Vector3(x * this.tileSize, y * this.tileSize, 1)
                    this.meshes[y][x] = new THREE.Mesh(geometry, material);
                    this.meshes[y][x].position = pos;
                    this.meshes[y][x].castShadow = true;
                    this.meshes[y][x].receiveShadow = true;
                    this.obstacles.push(this.meshes[y][x]);
                }

                // Item guff
                if (this.map[y][x] === 2) {
                    var pos = new THREE.Vector3(x * this.tileSize, y * this.tileSize, 1);
                    var item = this.itemFactory.spawnShotDelay();
                    item.setPosition(pos);
                    this.items.push(item);
                }
                if (this.map[y][x] === 3) {
                    var pos = new THREE.Vector3(x * this.tileSize, y * this.tileSize, 1);
                    var item = this.itemFactory.spawnArmour();
                    item.setPosition(pos);
                    this.items.push(item);
                }
            }
        }
    }

    public getObstacles() {
        return this.obstacles;
    }

    public getModel(x: number, y: number):THREE.Object3D {
        return this.meshes[y][x];
    }

    public getRoomItems():Item[] {
        return this.items;
    }
}
