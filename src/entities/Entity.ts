class Entity implements Updatable {

    public  pos:        THREE.Vector3;
    public  model:      THREE.Object3D;

    constructor() {
    
    }

    public update():void {
    
    }

    public getModel():THREE.Object3D {
        return this.model;
    }

}
