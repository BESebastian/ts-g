class Room {

    private obstacles:      any[];
    private meshes:         any[];
    private items:          Item[];
    private layout:         any[][];
    private exits:          any;
    private seen:           boolean;
    private completed:      boolean;
    private isSpawn:        boolean;
    private isItemRoom:     boolean;
    private isShop:         boolean;
    private isBossRoom:     boolean;
    private locked:         boolean;
    private position:       THREE.Vector2;
    private tileSize:       number;
    private itemFactory:    ItemFactory;

    constructor(position: THREE.Vector2, itemFactory, layoutFactory, floorLayout) {
        this.completed = false;
        this.seen = false;
        this.position = position;
        this.layout = [];
        this.obstacles = [];
        this.meshes = [];
        this.items = [];

        if (this.getRoomCode(floorLayout) === 9) {
            this.layout = layoutFactory.getSpawnRoom();
            this.isSpawn = true;
        } else if (this.getRoomCode(floorLayout) === 2) {
            this.layout = layoutFactory.getShop();
            this.isShop = true;
        } else if (this.getRoomCode(floorLayout) === 3) {
            this.layout = layoutFactory.getItemRoom();
            this.isItemRoom = true;
        } else if (this.getRoomCode(floorLayout) === 4) {
            this.layout = layoutFactory.getBossRoom();
            this.isBossRoom = true;
        } else {
            this.layout = layoutFactory.getRandomLayout();
            this.isSpawn = false;
            this.isShop = false;
            this.isItemRoom = false;
            this.isBossRoom = false;
        }

        this.itemFactory = itemFactory;
        this.tileSize = 5;
        this.locked = (this.isShop || this.isItemRoom);
        this.exits = this.getExits(floorLayout);

        for (var y = 0; y < this.layout.length; y++) {
            this.meshes[y] = [];
            this.meshes[y].length = this.layout[0].length;
        }

        this.generateMeshes();
        console.log(this.exits);
    }

    public getRoomCode(floorLayout):number {
        return floorLayout[this.position.y][this.position.x];
    }

    private getExits(floorLayout) {
        var directions = [
            [this.position.x, this.position.y - 1],
            [this.position.x, this.position.y + 1],
            [this.position.x + 1, this.position.y],
            [this.position.x - 1, this.position.y]
        ];
        var neighbours = [];
        var _this = this;
        directions.forEach(function (direction) {
            if (!_this.isInvalid(direction[0], direction[1], floorLayout)) {
                neighbours.push(direction);
            }
        });
        return neighbours;
    }

    private isInvalid(x: number, y: number, floorLayout):boolean {
        if (x < 0 || y < 0 || x >= floorLayout[0].length || y >= floorLayout.length) { return true; }
        return (floorLayout[y][x] === 0);
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
                 if (this.layout[y][x] === 2) {
                     var pos = new THREE.Vector3(x * this.tileSize, y * this.tileSize, 1);
                     var item = this.itemFactory.itemPoolRandom();
                     item.setPosition(pos);
                     this.items.push(item);
                 }
                 if (this.layout[y][x] === 3) {
                     var pos = new THREE.Vector3(x * this.tileSize, y * this.tileSize, 1);
                     var item = this.itemFactory.collectablePoolRandom();
                     item.setPosition(pos);
                     this.items.push(item);
                }
            }
        }
    }

    public unlockRoom() {
        this.locked = false;
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

    public setIsSpawn():Room {
        this.isSpawn = true;
        return this;
    }

    public getIsSpawn():boolean {
        return this.isSpawn;
    }

    public setIsShop():Room {
        this.isShop = true;
        return this;
    }

    public getIsShop():boolean {
        return this.isShop;
    }

    public setIsItemRoom():Room {
        this.isItemRoom = true;
        return this;
    }

    public getIsItemRoom():boolean {
        return this.isItemRoom;
    }

    public getIsBossRoom():boolean {
        return this.isBossRoom;
    }

    public setIsBossRoom():Room {
        this.isBossRoom = true;
        return this;
    }

}
