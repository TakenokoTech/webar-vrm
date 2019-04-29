import * as THREE from "three";
import GLTFLoader from "three-gltf-loader";
import humanoidBone from "../../../schema/humanoid.json";

export default class VrmLoader {
    load(url: string, callback: (vrm: THREE.GLTF) => void) {
        new GLTFLoader(THREE.DefaultLoadingManager).load(
            url,
            (vrm: THREE.GLTF) => {
                vrm.scene.name = "VRM";
                vrm.scene.castShadow = true;
                vrm.scene.traverse(this.attachMaterial);
                callback(vrm);
            }
        );
    }

    private attachMaterial(object3D: THREE.Object3D) {
        const createMaterial = (material: any): THREE.MeshLambertMaterial => {
            let newMaterial: any = new THREE.MeshLambertMaterial();
            newMaterial.name = material.name;
            newMaterial.color.copy(material.color);
            newMaterial.map = material.map;
            newMaterial.alphaTest = material.alphaTest;
            newMaterial.morphTargets = material.morphTargets;
            newMaterial.morphNormals = material.morphNormals;
            newMaterial.skinning = material.skinning;
            newMaterial.transparent = material.transparent;
            // newMaterial.wireframe = true;
            return newMaterial;
        };

        let mesh = object3D as THREE.Mesh;
        if (!mesh || !mesh.material) return;
        mesh.castShadow = true;

        if (Array.isArray(mesh.material)) {
            const list: THREE.Material[] = mesh.material;
            list.forEach(
                (m: THREE.Material, index: number) =>
                    (list[index] = createMaterial(m))
            );
        } else {
            mesh.material = createMaterial(mesh.material);
        }
    }

    static attachHumanoidBone(vrm: any): { [n: number]: THREE.Bone } {
        const humanoidMap: { [n: number]: THREE.Bone } = {};
        const entries = vrm.userData.gltfExtensions.VRM.humanoid.humanBones.entries();
        for (const [i, humanBone] of entries) {
            for (const [j, node] of vrm.parser.json.nodes.entries()) {
                if (humanBone.node == j) {
                    vrm.scene.traverse((object: any) => {
                        if (object.name == node.name)
                            humanoidMap[humanoidBone[humanBone.bone]] = object;
                    });
                }
            }
        }
        return humanoidMap;
    }
}

export interface VrmAnimation {
    name: string;
    bone: string;
    keys: Key[];
}

export interface Key {
    pos: number[];
    rot: number[];
    scl: number[];
    time: number;
}
