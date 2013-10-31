class Thing implements Updatable {

    public  pos:        THREE.Vector3;
    public  model:      THREE.Object3D;

    constructor() {
    
    }

    public update():void {
        this.model.rotation.x += 0.01;
        this.model.rotation.y += 0.01;
    }

    public getModel():THREE.Object3D {
        return this.model;
    }

}
