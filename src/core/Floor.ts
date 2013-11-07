///<reference path="Room.ts" />

class Floor {

    private rooms;

    constructor() {
        this.rooms = [];
        this.rooms.length = 6;
        for (var i = 0; i < this.rooms.length; i++) {
            this.rooms[i] = [];
            this.rooms[i].length = 9;
        };
        this.buildRooms();
    }

    private buildRooms() {
        this.rooms[0][0] = new Room();
        this.rooms[0][1] = new Room();
    }

    public getRooms():Room[][] {
        return this.rooms;
    }

}
