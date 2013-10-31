///<reference path="../entities/UIHealthItem.ts" />

class UI {

    private hp:         number;
    private prevHp:     number;
    private objs;

    constructor() {
        this.hp = 0;
        this.objs = [];
    }

    public draw():void {
        //this.drawHp();
    }

    public update(scene: THREE.Scene, hp: number):void {
        this.prevHp = this.hp;
        this.hp = hp;
        if (this.hp !== this.prevHp) {
            for (var i = 0; i < this.hp; i++) {
                var m = new UIHealthItem();
                var mesh = m.getModel();
                mesh.position = new THREE.Vector3(4, 35, 5);
                mesh.position.x = mesh.position.x + (i * 2);
                scene.add(mesh);
                this.objs.push(m);
            }
        }
    }

    public getItems() {
        return this.objs;
    }

}
