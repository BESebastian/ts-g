class Creature implements Drawable, Updatable {

    public  model:  THREE.Object3D;
    public  pos:    THREE.Vector3;
    public  speed:  number;
    public  hp:     number;
    public  maxHp:  number;
    public  armour: number;

    constructor() {}

    public draw():void {}
    public update():void {}

    public getModel():THREE.Object3D {
        return this.model;
    }

    public getPosition():THREE.Vector3 {
        return this.pos;
    }

    public setPosition(pos):void {
        this.pos = pos;
    }

    public getSpeed():number {
        return this.speed;
    }

    public checkCollision(obstacles):boolean {
        return false;
    }

    public move(obstacles, x: number, y: number, world, renderer):void {
        this.pos.x += x;
        this.pos.y += y;
    }

    public getHp():number {
        return this.hp;
    }

    public getMaxHp():number {
        return this.maxHp;
    }

    public getArmour():number {
        return this.armour;
    }

}
