import * as THREE from "three";
import GLTFLoader from "three-gltf-loader";

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
}
