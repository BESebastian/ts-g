///<reference path="Room.ts" />
///<reference path="RoomLayoutBuilder.ts" />
///<reference path="../core/Utils.ts" />

class FloorGenerator {

    private width:          number;
    private height:         number;
    private maxRooms:       number;
    private rooms:          any[];
    private spawn:          any;
    private layout:         any[];
    private itemFactory:    ItemFactory;
    private layoutBuilder:  RoomLayoutBuilder;

    constructor(w: number, h: number, max: number, itemFactory) {
        this.width = w;
        this.height = h;
        this.maxRooms = max;
        this.rooms = [];
        this.layout = this.initLayout();
        this.itemFactory = itemFactory;
        this.layoutBuilder = new RoomLayoutBuilder();

        var spawnLocation = new Utils().shuffleArray([
            [2, 4],
            [2, 5],
            [2, 6],
            [3, 4],
            [3, 5],
            [3, 6]
        ])[0];

        this.spawn = {
            x: spawnLocation[1],
            y: spawnLocation[0]
        };
    }

    public getSpawn():THREE.Vector2 {
        return new THREE.Vector2(this.spawn.x, this.spawn.y);
    }

    public generate():FloorGenerator {
        this.layout[this.spawn.y][this.spawn.x] = 1;
        this.rooms.push([this.spawn.x, this.spawn.y]);
        this.makeRoom(this.spawn.x, this.spawn.y);
        this.layout[this.spawn.y][this.spawn.x] = 9;
        return this;
    }

    public build() {
        var floor = this.initLayout();
        for (var y = 0; y < this.height; y++) {
            for (var x = 0; x < this.width; x++) {
                if (this.layout[y][x] !== 0) {
                    floor[y][x] = new Room(new THREE.Vector2(x, y), this.itemFactory, this.layoutBuilder, this.layout);
                }
            }
        }
        return floor;
    }

    private makeRoom(x: number, y: number) {
        if (this.rooms.length >= this.maxRooms) { return; }
        var neighbours = this.getNeighbours(x, y)
        var chanceIt = true;
        if (neighbours.length > 2) {
            chanceIt = (Math.floor(Math.random() * 10) < 5);
        }
        if (neighbours[0] !== undefined && chanceIt) {
            var nx = neighbours[0][0];
            var ny = neighbours[0][1];
            this.layout[ny][nx] = 1;
            this.rooms.push([nx, ny]);
        }
        var next = this.getNextRoom();
        this.makeRoom(next[0], next[1]);
    }

    private getNextRoom():any[] {
        return this.rooms[Math.floor(Math.random() * this.rooms.length)];
    }

    private getNeighbours(x: number, y: number):any[] {
        var directions = new Utils().shuffleArray([
            [x, y - 1],
            [x, y + 1],
            [x + 1, y],
            [x - 1, y]
        ]);
        var neighbours = [];
        var _this = this;
        directions.forEach(function (direction) {
            if (!_this.isInvalid(direction[0], direction[1])) {
                neighbours.push(direction);
            }
        });
        return neighbours
    }

    private initLayout():any[][] {
        var a = [];
        a.length = this.height;
        for (var y = 0; y < this.height; y++) {
            a[y] = [];
            a[y].length = this.width;
            for (var x = 0; x < this.width; x++) {
                a[y][x] = 0;
            }
        }
        return a;
    }

    private isInvalid(x: number, y: number):boolean {
        if (x < 0 || y < 0 || x >= this.width || y >= this.height) { return true; }
        return (this.layout[y][x] === 1);
    }

}
