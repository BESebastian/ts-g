///<reference path="FloorGenerator.ts" />
///<reference path="Room.ts" />

class Floor {

    private rooms;
    private layout;
    private offsets:    THREE.Vector2;

    constructor(offsets: THREE.Vector2) {
        this.rooms = [];
        this.rooms.length = 6;
        for (var i = 0; i < this.rooms.length; i++) {
            this.rooms[i] = [];
            this.rooms[i].length = 9;
        };
        this.layout = new FloorGenerator(9, 6, 10, offsets)
            .generate()
            .build();
    }

    public getLayout() {
        return this.layout;
    }

}
