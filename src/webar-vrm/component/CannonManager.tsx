import * as THREE from "three";
import * as CANNON from "cannon";

export class CannonParam {
    name: string;
    mass: number;
    position: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
    quaternion: THREE.Quaternion = new THREE.Quaternion(0, 0, 0, 0);
    shape: CANNON.Shape;

    constructor(
        name: string,
        mass: number,
        position: THREE.Vector3,
        quaternion: THREE.Quaternion,
        shape: CANNON.Shape
    ) {
        this.name = name;
        this.mass = mass;
        this.position = position;
        this.quaternion = quaternion;
        this.shape = shape;
    }
}

interface Rigitbody {
    enable: boolean;
    body: CANNON.Body;
    target: THREE.Object3D;
}

class CannonManager {
    public static world: CANNON.World;
    private static map: { [index: string]: Rigitbody } = {};

    constructor() {
        this.world = this.createCannon();
    }

    private createCannon(): CANNON.World {
        const world = new CANNON.World();
        world.gravity.set(0, -9.82, 0);
        world.broadphase = new CANNON.NaiveBroadphase();
        world.solver.iterations = 5;
        // world.solver. = 0.1;
        return world;
    }

    static addRigidbody(
        param: CannonParam,
        target: THREE.Object3D,
        enable = true
    ) {
        const body = new CANNON.Body({
            mass: param.mass,
            material: new CANNON.Material(param.name)
        });
        body.addShape(param.shape);
        body.position.set(param.position.x, param.position.y, param.position.z);
        body.quaternion.set(
            param.quaternion.x,
            param.quaternion.y,
            param.quaternion.z,
            param.quaternion.w
        );
        body.angularVelocity.set(0, 0, 0);
        this.map[body.material.name] = {
            enable: enable,
            body: body,
            target: target
        };
    }

    static updateFrame() {
        this.world.step(0.16);
        Object.keys(this.map).forEach(key => {
            if (!this.map[key].enable) {
                return;
            }
            if (this.map[key].body.position.y < -100) {
                this.map[key].target.visible = false;
                return;
            }
            const t = this.trance(
                this.map[key].body.position,
                this.map[key].body.quaternion
            );
            this.map[key].target.position.copy(t[0]);
            this.map[key].target.quaternion.copy(t[1]);
        });
    }

    private trance(
        vec: CANNON.Vec3,
        row: CANNON.Quaternion
    ): [THREE.Vector3, THREE.Quaternion] {
        return [
            new THREE.Vector3(vec.x, vec.y, vec.z),
            new THREE.Quaternion(row.x, row.y, row.z, row.w)
        ];
    }
}

export default CannonManager;
