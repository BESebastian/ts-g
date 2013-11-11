///<reference path="FloorGenerator.ts" />
///<reference path="Room.ts" />

class Floor {

    private layout;
    private offsets:    THREE.Vector2;
    private spawn:      THREE.Vector2;

    constructor(itemFactory) {
        var fg = new FloorGenerator(9, 6, 10, itemFactory);
        this.layout = fg.generate().build();
        this.spawn = fg.getSpawn();
    }

    public getSpawn():THREE.Vector2 {
        return this.spawn;
    }

    public getRoom(x, y):Room {
        return this.layout[y][x];
    }

    public getLayout() {
        return this.layout;
    }

}
