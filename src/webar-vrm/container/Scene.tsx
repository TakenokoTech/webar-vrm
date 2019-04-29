import * as THREE from "three";
import BaseContainer from "./BaseContainer";
import * as Obj from "./Object";
import * as log from "../utils/log";
import VrmLoader from "../component/VRMLoader";
import Stats from "stats-js";

export class Scene implements BaseContainer {
    public scene = new THREE.Scene();
    private camera: THREE.Camera = new THREE.Camera();
    private lights: THREE.Light[] = [];
    private renderer: THREE.WebGLRenderer;
    private source: THREEx.ArToolkitSource;
    private context: THREEx.ArToolkitContext;
    private marker: THREE.Group;
    private objList: THREE.Object3D[] = [];

    private time = 0;
    private vrm: any;
    private width = 0;
    private height = 0;
    private stats: Stats;

    constructor() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.render = this.render.bind(this);
        this.camera = this.setupCamera();
        this.renderer = this.setupRenderer();
        this.lights.push(...this.setupLight());
        [this.source, this.context] = this.createContext();
        this.marker = this.createMarker();

        this.objList.push(
            Obj.createFloar({
                name: "floar",
                width: 800,
                height: 100,
                depth: 800,
                position: new THREE.Vector3(0, -50, 0),
                quaternion: new THREE.Quaternion(0, 0, 0, 1),
                wireframe: false
            })
        );

        this.scene.add(this.camera);
        this.lights.forEach(l => this.scene.add(l));
        this.scene.add(this.marker);
        this.objList.forEach(element => this.scene.add(element));
        this.stats = this.createStats();
    }

    public componentDidMount() {
        log.debug("componentDidMount");
        document.body.appendChild(this.renderer.domElement);
        window.addEventListener("resize", () => this.onResize());
        this.render();
    }

    render() {
        requestAnimationFrame(this.render);
        if (this.source.ready === false) return;
        this.time++;
        this.context.update(this.source.domElement);
        this.renderer.render(this.scene, this.camera);
        this.stats.update();
        this.updateFrame();
    }

    public onResize() {
        log.debug("onResize");
        this.source.onResizeElement();
        this.source.copyElementSizeTo(this.renderer.domElement);
        this.context.arController &&
            this.source.copyElementSizeTo(this.context.arController.canvas);
    }

    setupCamera(): THREE.Camera {
        const camera = new THREE.Camera(); //Obj.createCamera();
        // camera.position.set(0, 100, 500);
        return camera;
    }

    setupRenderer(): THREE.WebGLRenderer {
        var renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        renderer.setClearColor(new THREE.Color("black"), 0);
        renderer.setSize(this.width, this.height);
        // renderer.setSize(640, 480);
        // renderer.domElement.style.position = "absolute";
        // renderer.domElement.style.top = "0px";
        // renderer.domElement.style.left = "0px";
        return renderer;
    }

    setupLight(): THREE.Light[] {
        const lights = [];
        lights.push(Obj.createLight());
        // lights.push(Obj.createDictLight());
        lights.push(Obj.createAmbientLight());
        return lights;
    }

    createContext(): [THREEx.ArToolkitSource, THREEx.ArToolkitContext] {
        const source = new THREEx.ArToolkitSource({
            sourceType: "webcam"
        });
        const context = new THREEx.ArToolkitContext({
            debug: false,
            cameraParametersUrl: "assets/camera_para.dat",
            detectionMode: "mono",
            imageSmoothingEnabled: true,
            maxDetectionRate: 60,
            canvasWidth: source.parameters.sourceWidth,
            canvasHeight: source.parameters.sourceHeight
        });
        source.init(() => this.onResize());
        context.init(() =>
            this.camera.projectionMatrix.copy(context.getProjectionMatrix())
        );
        return [source, context];
    }

    createMarker(): THREE.Group {
        const marker = new THREE.Group();
        const param = {
            type: "pattern",
            patternUrl: "assets/pattern-hiro.patt"
        };
        new THREEx.ArMarkerControls(this.context, marker, param);
        (async () => {
            const vrm = await Obj.loadVRM("assets/Victoria_Rubin.vrm");
            this.vrm = vrm;
            this.vrm.userData.anime = await Obj.loadAnime();
            this.vrm.userData.boneMap = VrmLoader.attachHumanoidBone(vrm);
            marker.add(this.vrm.scene);
            // marker.add(await Obj.ArBox());
            // marker.add(Obj.createFloar());
            // marker.add(cloaking(new THREE.VideoTexture(this.source.domElement)));
        })();
        return marker;
    }

    createStats(): Stats {
        const stats = new Stats();
        stats.dom.style.position = "relative";
        stats.dom.style.top = "4px";
        stats.dom.style.left = "4px";
        stats.dom.style.margin = "auto";
        const debugWindow = document.body as Element;
        document.body.appendChild(stats.dom);
        return stats;
    }

    async updateFrame() {
        const anime = this.vrm.userData.anime;
        const boneMap = this.vrm.userData.boneMap;
        if (!anime) return;
        const animation: Obj.VrmAnimation[] = anime.vrmAnimation;
        for (let ani of animation) {
            const name = -(-ani.name);
            const key = ani.keys[this.time % 1000];
            if (!boneMap || !boneMap[name] || !key || key.rot.length != 4)
                continue;
            boneMap[name].quaternion.set(
                -key.rot[0],
                -key.rot[1],
                key.rot[2],
                key.rot[3]
            );
        }
    }
}
