class Creature {

    public  model:  THREE.Object3D;
    public  pos:    THREE.Vector3;
    public  speed:  number;

    constructor() {}

    public update():void {
    
    }

    public draw():void {
    
    }

    public getModel():THREE.Object3D {
        return this.model;
    }

    public getPosition():THREE.Vector3 {
        return this.pos;
    }

    public getSpeed():number {
        return this.speed;
    }

    public move(x: number, y: number):void {
        this.pos.x += x;
        this.pos.y += y;
    }

}
