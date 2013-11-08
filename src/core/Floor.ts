///<reference path="FloorGenerator.ts" />
///<reference path="Room.ts" />

class Floor {

    private rooms;
    private layout;

    constructor() {
        this.rooms = [];
        this.rooms.length = 6;
        for (var i = 0; i < this.rooms.length; i++) {
            this.rooms[i] = [];
            this.rooms[i].length = 9;
        };
        this.layout = new FloorGenerator(6, 9, 10).generate();

        this.buildRooms();
        console.log(this);
    }

    private buildRooms() {
        this.rooms[0][0] = new Room();
        this.rooms[0][1] = new Room();
    }

    public getRooms():Room[][] {
        return this.rooms;
    }

}
