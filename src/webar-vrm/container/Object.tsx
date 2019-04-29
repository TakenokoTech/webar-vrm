import * as THREE from "three";
import * as CANNON from "cannon";
import OrbitControls from "three-orbitcontrols";
import VrmLoader from "../component/VRMLoader";
import CannonManager from "../component/CannonManager";
import { CannonParam } from "../component/CannonManager";

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

export async function loadVRM(src: string): Promise<THREE.Object3D> {
    return new Promise(resolve => {
        new VrmLoader().load(src, async (vrm: any) => {
            console.log(vrm.scene);
            vrm.scene.quaternion.set(0, 0, 0, 0);
            vrm.scene.scale.x = 1;
            vrm.scene.scale.y = 1;
            vrm.scene.scale.z = 1;
            vrm.scene.rotation.y = Math.PI;
            resolve(vrm);
        });
    });
}

export async function loadAnime(): Promise<any> {
    return new Promise(async resolve => {
        fetch("./assets/anime.json")
            .then(res => res.text())
            .then(anime => resolve(JSON.parse(anime)));
    });
}

export function createCamera(): THREE.PerspectiveCamera {
    const camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.25,
        50000
    );
    camera.position.set(100, 150, -300);
    return camera;
}

export function createControls(
    camera: THREE.Camera,
    dom: Element
): OrbitControls {
    const controls = new OrbitControls(camera, dom);
    controls.target.set(0, 0, 0);
    controls.enableKeys = false;
    controls.update();
    return controls;
}

export function createLight(): THREE.Light {
    const light = new THREE.PointLight(0xffffff, 1.0);
    light.name = "point light";
    light.position.set(0, 0, 100);
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    light.castShadow = true;
    light.add(new THREE.PointLightHelper(light, 0xff0000));
    return light;
}

export function createAmbientLight(): THREE.Light {
    const ambient = new THREE.AmbientLight(0x333333);
    ambient.name = "Ambient Light";
    return ambient;
}

export function createDictLight(
    position: THREE.Vector3 = new THREE.Vector3(0, 256, -256)
): THREE.DirectionalLight {
    const FIELD_SIZE = position.y;
    const directionalLight = new THREE.DirectionalLight(0xaaaaaa, 1.6);
    directionalLight.name = "Directional Light";
    directionalLight.position.set(position.x, position.y, position.z);
    directionalLight.shadow.camera.near = 0; //0.5;
    directionalLight.shadow.camera.top = FIELD_SIZE;
    directionalLight.shadow.camera.bottom = FIELD_SIZE * -1;
    directionalLight.shadow.camera.left = FIELD_SIZE;
    directionalLight.shadow.camera.right = FIELD_SIZE * -1;
    directionalLight.shadow.mapSize.width = 4096;
    directionalLight.shadow.mapSize.height = 4096;
    directionalLight.castShadow = true;
    return directionalLight;
}

export function createFloar(): THREE.Object3D {
    const param = {
        width: 2,
        height: 0.1,
        depth: 2,
        name: "floar",
        position: { x: 0, y: 0, z: 0 },
        quaternion: { x: 0, y: 0, z: 0 }
    };
    const material = {
        color: 0xcccccc,
        wireframe: false,
        transparent: true,
        opacity: 0.6
    };
    const meshFloor = new THREE.Mesh(
        new THREE.BoxGeometry(param.width, param.height, param.depth),
        new THREE.MeshLambertMaterial(material)
    );
    meshFloor.name = param.name;
    meshFloor.position.set(
        param.position.x,
        param.position.y,
        param.position.z
    );
    meshFloor.receiveShadow = true;

    const cannon = new CannonParam(
        param.name,
        0,
        param.position,
        param.quaternion,
        new CANNON.Box(
            new CANNON.Vec3(param.width / 2, param.height / 2, param.depth / 2)
        )
    );
    CannonManager.addRigidbody(cannon, meshFloor, false);
    return meshFloor;
}
