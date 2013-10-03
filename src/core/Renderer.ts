///<reference path='../lib/three.d.ts' />

class Renderer {

    public  WIDTH:      number;
    public  HEIGHT:     number;
    public  container:  HTMLElement;
    public  scene:      THREE.Scene;

    private VIEW_ANGLE: number;
    private ASPECT:     number;
    private NEAR:       number;
    private FAR:        number;
    private renderer:   THREE.WebGLRenderer;
    private camera:     THREE.PerspectiveCamera;

    constructor() {
        this.container  = document.getElementById('container');
        this.WIDTH      = this.container.offsetWidth;
        this.HEIGHT     = this.container.offsetHeight;
        this.VIEW_ANGLE = 45;
        this.ASPECT     = this.WIDTH / this.HEIGHT;
        this.NEAR       = 0.1;
        this.FAR        = 10000;
        this.renderer   = new THREE.WebGLRenderer({ antialias: true });
        this.camera     = new THREE.PerspectiveCamera(this.VIEW_ANGLE, this.ASPECT, this.NEAR, this.FAR);
        this.scene      = new THREE.Scene();

        this.container.appendChild(this.renderer.domElement);

        this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
        this.renderer.shadowMapEnabled = true;
        //this.renderer.shadowMapSoft = true;

        var light = new THREE.SpotLight(0xffffff, 0.8);
        light.angle = Math.PI/2;
        light.castShadow = true;
        light.position.set(0, 0, 100);
        this.scene.add(light);

        this.camera.position.set(12.5, 12.5, 20);
    }

    public draw():void {
        this.renderer.render(this.scene, this.camera);
    }

    public update():void {

    }

}
