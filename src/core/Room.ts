class Room {

    private obstacles;
    private meshes;
    private items;
    private layout:         any[][];
    private seen:           boolean;
    private completed:      boolean;
    private position:       THREE.Vector2;
    private tileSize:       number;
    private itemFactory:    ItemFactory;

    constructor(position: THREE.Vector2, itemFactory) {
        this.completed = false;
        this.seen = false;
        this.obstacles = [];
        this.meshes = [];
        this.items = [];
        this.itemFactory = itemFactory;

        this.tileSize = 5;
        this.layout = [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 1],
            [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 2, 2, 0, 1],
            [1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1],
            [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 2, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ];

        for (var y = 0; y < this.layout.length; y++) {
            this.meshes[y] = [];
            this.meshes[y].length = this.layout[0].length;
        }

        this.generateMeshes();
    }

    public getLayout() {
        return this.layout;
    }

    public getCompleted():boolean {
        return this.completed;
    }

    public getSeen():boolean {
        return this.seen;
    }

    public enterRoom():Room {
        return this;
    }

    public completeRoom():Room {
        this.completed = true;
        return this;
    }

    private generateMeshes() {
        var geometry = new THREE.CubeGeometry(this.tileSize, this.tileSize, this.tileSize);
        var material = new THREE.MeshPhongMaterial();
        var darkMaterial = new THREE.MeshPhongMaterial({ color: 0x555555 });
        for (var y = 0; y < this.layout.length; y++) {
            for (var x = 0; x < this.layout[0].length; x++) {
                // 1 is a wall, for now draw the floor if it exists
                if (this.layout[y][x] !== 1) {
                    var pos = new THREE.Vector3(x * this.tileSize, y * this.tileSize, -3);
                    this.meshes[y][x] = new THREE.Mesh(geometry, material);
                    this.meshes[y][x].position = pos;
                    this.meshes[y][x].castShadow = false;
                    this.meshes[y][x].receiveShadow = true;
                } else {
                    var pos = new THREE.Vector3(x * this.tileSize, y * this.tileSize, 1)
                    this.meshes[y][x] = new THREE.Mesh(geometry, darkMaterial);
                    this.meshes[y][x].position = pos;
                    this.meshes[y][x].castShadow = true;
                    this.meshes[y][x].receiveShadow = true;
                    this.obstacles.push(this.meshes[y][x]);
                }

                 // Item guff
                 if (this.layout[y][x] === 3) {
                     var pos = new THREE.Vector3(x * this.tileSize, y * this.tileSize, 1);
                     var item = this.itemFactory.itemPoolRandom();
                     item.setPosition(pos);
                     this.items.push(item);
                 }
                 if (this.layout[y][x] === 2) {
                     var pos = new THREE.Vector3(x * this.tileSize, y * this.tileSize, 1);
                     var item = this.itemFactory.collectablePoolRandom();
                     item.setPosition(pos);
                     this.items.push(item);
                }
            }
        }
    }

    public getItems() {
        return this.items;
    }

    public getObstacles() {
        return this.obstacles;
    }

    public getMeshes() {
        return this.meshes;
    }

}
