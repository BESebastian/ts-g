class Creature {

    public  model:  THREE.Mesh;
    public  pos:    THREE.Vector3;

    constructor() {}

    public update():void {
    
    }

    public draw():void {
    
    }

    public getModel():THREE.Mesh {
        return this.model;
    }

    public getPosition():THREE.Vector3 {
        return this.pos;
    }

    public move(x: number, y: number):void {
        this.pos.x += x;
        this.pos.y += y;
    }

}
