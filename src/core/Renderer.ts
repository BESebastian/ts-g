///<reference path='../lib/three.d.ts' />

class Renderer {

    public  WIDTH:      number;
    public  HEIGHT:     number;
    public  container:  HTMLElement;
    public  scene:      THREE.Scene;
    public  camera:     THREE.PerspectiveCamera;

    private VIEW_ANGLE: number;
    private ASPECT:     number;
    private NEAR:       number;
    private FAR:        number;
    private renderer:   THREE.WebGLRenderer;
    private light:      THREE.SpotLight;

    constructor(width, height, tileSize) {
        this.container  = document.getElementById('container');
        this.WIDTH      = 1280;
        this.HEIGHT     = 720;
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
        this.renderer.shadowMapType = THREE.PCFSoftShadowMap;

        this.renderer.domElement.id = 'viewport';
        this.camera.position.set(0, 0, 50);

        this.light = new THREE.SpotLight(0xffffff, 0.8);
        this.light.castShadow = true;
        this.light.position.set(35, 20, 100);
        this.light.shadowDarkness = 1;
        this.light.target.position.x = 35;
        this.light.target.position.y = 20;
        this.scene.add(this.light);

    }

    public draw():void {
        this.renderer.render(this.scene, this.camera);
    }

    public moveCamera(vector: THREE.Vector3):void {
        this.camera.position.x = vector.x;
        this.camera.position.y = vector.y;
    }

    public update():void {

    }

}
