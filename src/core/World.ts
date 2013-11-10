///<reference path="Floor.ts" />

class World {

    public  tileSize:       number;
    public  meshes;
    public  map:            number[][];
    private texture:        THREE.Texture;
    private obstacles;
    private items:          Item[];
    private itemFactory:    ItemFactory;
    private floors:         Floor[];
    private depth:          number;
    private maxDepth:       number;
    private mapPos:         THREE.Vector2;
    private roomOffsets:    THREE.Vector2;

    constructor(texture, tileSize, itemPool, collectablePool) {
        this.roomOffsets = new THREE.Vector2(70, 40);
        this.tileSize = tileSize;
        this.texture = texture;

        this.itemFactory = new ItemFactory(itemPool, collectablePool);
        this.items = [];

        this.depth = 0;
        this.maxDepth = 1;
        this.mapPos = new THREE.Vector2(0, 0);

        this.floors = [];
        for (var d = 0; d < this.maxDepth; d++) {
            this.floors[d] = new Floor(this.roomOffsets);
        }

        this.meshes = [];
        this.obstacles = [];

        for (var y = 0; y < this.floors[this.depth].getLayout().length; y++) {
            this.meshes[y] = [];
            this.obstacles[y] = [];
            this.meshes[y].length = this.floors[this.depth].getLayout()[0].length;
            this.obstacles[y].length = this.floors[this.depth].getLayout()[0].length;
            for (var x = 0; x < this.floors[this.depth].getLayout()[0].length; x++) {
                this.meshes[y][x] = [];
                this.obstacles[y][x] = [];
            }
        }

        console.log(this.meshes);

        this.generateFloorMeshes();
    }

    private generateFloorMeshes() {
        var geometry = new THREE.CubeGeometry(this.tileSize, this.tileSize, this.tileSize);
        var material = new THREE.MeshPhongMaterial();
        var darkMaterial = new THREE.MeshPhongMaterial({ color: 0x555555 });
        var currentLayout = this.floors[this.depth].getLayout();

        for (var y = 0; y < currentLayout.length; y++) {
            for (var x = 0; x < currentLayout[0].length; x++) {
                if (typeof currentLayout[y][x] === 'object') {
                    this.meshes[y][x] = currentLayout[y][x].getMesh();
                    this.obstacles[y][x].push(currentLayout[y][x].getObstacles());
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
