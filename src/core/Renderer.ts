///<reference path='../lib/three.d.ts' />

class Renderer {

    public  WIDTH:      number;
    public  HEIGHT:     number;
    public  container:  HTMLElement;

    private VIEW_ANGLE: number;
    private ASPECT:     number;
    private NEAR:       number;
    private FAR:        number;
    private renderer:   THREE.WebGLRenderer;
    private camera:     THREE.PerspectiveCamera;
    private scene:      THREE.Scene;

    constructor() {
        this.WIDTH      = 400;
        this.HEIGHT     = 300;
        this.VIEW_ANGLE = 45;
        this.ASPECT     = this.WIDTH / this.HEIGHT;
        this.NEAR       = 0.1;
        this.FAR        = 10000;
        this.container  = document.body;
        this.renderer   = new THREE.WebGLRenderer();
        this.camera     = new THREE.PerspectiveCamera(this.VIEW_ANGLE, this.ASPECT, this.NEAR, this.FAR);
        this.scene      = new THREE.Scene();

        this.scene.add(this.camera);
        this.camera.position.z = 300;
        this.renderer.setSize(this.WIDTH, this.HEIGHT);
        this.container.appendChild(this.renderer.domElement);

        var radius = 50;
        var segments = 16;
        var rings = 16;
        var sphereMaterial = new THREE.MeshLambertMaterial({ color: 0xCC0000 });
        var sphere = new THREE.Mesh(new THREE.SphereGeometry(radius, segments, rings), sphereMaterial);
        this.scene.add(sphere);

        var pointLight = new THREE.PointLight(0xFFFFFF);
        pointLight.position.x = 10;
        pointLight.position.y = 50;
        pointLight.position.z = 130;
        this.scene.add(pointLight);

        this.renderer.render(this.scene, this.camera);
    }

    public draw():void {

    }

    public update():void {

    }

}
