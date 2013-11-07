///<reference path="Room.ts" />

class Floor {

    private rooms;

    constructor() {
        this.rooms = [];
        this.rooms[0] = [];
        this.buildRooms();
    }

    private buildRooms() {
        this.rooms[0].push(new Room());
        this.rooms[0].push(new Room());
    }

    public getRooms():Room[][] {
        return this.rooms;
    }

}
