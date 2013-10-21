interface Collider {
    rays;
    distance: number;
    caster: THREE.Raycaster;
    checkCollision(obstacles): boolean;
}
