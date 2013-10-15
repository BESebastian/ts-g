class Creature implements Drawable, Updatable, Collider {

    public  model:  THREE.Object3D;
    public  pos:    THREE.Vector3;
    public  speed:  number;

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

    public checkCollision():boolean {
        return false;
    }

    public move(x: number, y: number):void {
        this.pos.x += x;
        this.pos.y += y;
    }

}
