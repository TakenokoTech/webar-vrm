import * as THREE from "three";
import VrmLoader from "../component/VRMLoader";

export function ArBox(): THREE.Object3D {
    var geo = new THREE.CubeGeometry(1, 1, 1);
    var mat = new THREE.MeshNormalMaterial({
        transparent: true,
        opacity: 0.9,
        side: THREE.DoubleSide
    });
    var mesh1 = new THREE.Mesh(geo, mat);
    mesh1.name = "cube";
    mesh1.position.set(0, 0.5, 0);
    return mesh1;
}

// マーカ隠蔽（cloaking）
export function cloaking(videoTex: THREE.VideoTexture) {
    videoTex.minFilter = THREE.NearestFilter;
    const cloak = new THREEx.ArMarkerCloak(videoTex);
    cloak.object3d.material.uniforms.opacity.value = 1.0;
    return cloak.object3d;
}

export async function loadVRM(): Promise<THREE.Object3D> {
    return new Promise(resolve => {
        const avatar = new VrmLoader().load(
            "assets/Victoria_Rubin.vrm",
            (vrm: any) => {
                console.log(vrm.scene);
                vrm.scene.quaternion.set(0, 0, 0, 0);
                resolve(vrm.scene);
            }
        );
    });
}
