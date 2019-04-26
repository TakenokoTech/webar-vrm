export default class Click {
    constructor() {
        this.mousedown = this.mousedown.bind(this);
        window.addEventListener("mousedown", this.mousedown);
    }

    mousedown(e: MouseEvent) {
        const mouseX = (e.clientX / window.innerWidth) * 2 - 1; // -1 ～ +1 に正規化されたx座標
        const mouseY = -(e.clientY / window.innerHeight) * 2 + 1; // -1 ～ +1 に正規化されたy座標
        const pos = new THREE.Vector3(mouseX, mouseY, 1).unproject(camera);
        const ray = new THREE.Raycaster(
            camera.position,
            pos.sub(camera.position).normalize()
        );
        const obj = ray.intersectObjects(scene.children, true);
        console.log(obj);
    }
}
