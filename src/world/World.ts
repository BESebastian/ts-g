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
    private currentRoom:    Room;

    constructor(texture, tileSize, itemPool, collectablePool) {
        this.roomOffsets = new THREE.Vector2(70, 40);
        this.tileSize = tileSize;
        this.texture = texture;

        this.itemFactory = new ItemFactory(itemPool, collectablePool);
        this.items = [];

        this.depth = 0;
        this.maxDepth = 1;

        this.floors = [];
        for (var d = 0; d < this.maxDepth; d++) {
            this.floors[d] = new Floor(this.itemFactory);
        }

        this.mapPos = this.getSpawnRoom();

        this.meshes = [];
        this.obstacles = [];

        this.generateRoomMeshes(this.floors[this.depth], this.mapPos.x, this.mapPos.y);
        this.setNeighboursSeen(this.getCurrentRoom());
        this.getCurrentRoom().setSeen().setExplored();
    }

    public getPosition():THREE.Vector2 {
        return this.mapPos;
    }

    public removeItem(item: Item) {
        this.items.splice(this.items.indexOf(item), 1);
    }

    public changeRoom(x, y, renderer, entities, roomItems) {
        this.meshes.forEach(function (mesh) {
            mesh.forEach(function (submesh) {
                renderer.scene.remove(submesh);
            });
        });
        entities.forEach(function (mesh) {
            renderer.scene.remove(mesh.getModel());
        });
        roomItems.forEach(function (item) {
            renderer.scene.remove(item.getModel());
        });

        entities = [];
        roomItems = [];

        this.mapPos = new THREE.Vector2(x, y);
        this.meshes = [];
        this.obstacles = [];
        this.items = [];

        this.generateRoomMeshes(this.floors[this.depth], this.mapPos.x, this.mapPos.y);
        this.getCurrentRoom().setExplored();
        this.setNeighboursSeen(this.getCurrentRoom());
        for (var y = 0; y < this.meshes.length; y++) {
            for (var x = 0; x < this.meshes[0].length; x++) {
                renderer.scene.add(this.meshes[y][x]);
            }
        }
        var event = document.createEvent('CustomEvent');
        event.initEvent('changeRoom', true, true);
        document.dispatchEvent(event);
    }

    private setNeighboursSeen(room: Room) {
        var exits = room.getExits();
        var _this = this;
        exits.forEach(function (exit) {
            if (exit === 0) { return; }
            _this.floors[_this.depth].getRoom(exit[0], exit[1]).setSeen();
        });
    }

    private getSpawnRoom():THREE.Vector2 {
        return this.floors[this.depth].getSpawn();
    }

    private generateRoomMeshes(floor: Floor, x: number, y: number) {
        var room = floor.getRoom(x, y);
        this.meshes = room.getMeshes();
        this.obstacles = room.getObstacles();
        this.items = room.getItems();
    }

    public getCurrentRoom() {
        return this.floors[this.depth].getRoom(this.mapPos.x, this.mapPos.y);
    }

    public getCurrentFloor() {
        return this.floors[this.depth];
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
