///<reference path="Floor.ts" />

class World {

    public  tileSize:       number;
    public  meshes:         THREE.Object3D[][];
    public  map:            number[][];
    private texture:        THREE.Texture;
    private obstacles:      THREE.Object3D[];
    private items:          Item[];
    private itemFactory:    ItemFactory;
    private floors:         Floor[];
    private depth:          number;
    private mapPos:         THREE.Vector2;

    constructor(texture, tileSize, itemPool, collectablePool) {
        this.tileSize = tileSize;
        this.texture = texture;

        this.itemFactory = new ItemFactory(itemPool, collectablePool);
        this.items = [];

        this.depth = 0;
        this.mapPos = new THREE.Vector2(0, 0);

        this.floors = [];
        this.floors[0] = new Floor();
        this.map = this.floors[this.depth]
            .getRooms()[this.mapPos.y][this.mapPos.x]
            .getLayout();

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
        var darkMaterial = new THREE.MeshPhongMaterial({ color: 0x555555 });
        for (var y = 0; y < this.map.length; y++) {
            for (var x = 0; x < this.map[0].length; x++) {
                // 1 is a wall, for now draw the floor if it exists
                if (this.map[y][x] !== 1) {
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
                if (this.map[y][x] === 3) {
                    var pos = new THREE.Vector3(x * this.tileSize, y * this.tileSize, 1);
                    var item = this.itemFactory.itemPoolRandom();
                    item.setPosition(pos);
                    this.items.push(item);
                }
                if (this.map[y][x] === 2) {
                    var pos = new THREE.Vector3(x * this.tileSize, y * this.tileSize, 1);
                    var item = this.itemFactory.collectablePoolRandom();
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
