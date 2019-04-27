import * as THREE from "three";
import BaseContainer from "./BaseContainer";
import { ArBox } from "./Object";
import { cloaking } from "./Object";
import { loadVRM } from "./Object";

export class Scene implements BaseContainer {
    public scene = new THREE.Scene();
    private camera: THREE.Camera;
    private light: THREE.Light;
    private renderer: THREE.WebGLRenderer;
    private source: THREEx.ArToolkitSource;
    private context: THREEx.ArToolkitContext;
    private marker: THREE.Group;

    constructor() {
        this.render = this.render.bind(this);

        this.renderer = this.createRenderer();
        [this.camera, this.light] = this.setupThree();
        [this.source, this.context] = this.createContext();
        this.marker = this.createMarker();
        this.scene.add(this.camera);
        this.scene.add(this.light);
        this.scene.add(this.marker);
    }

    public componentDidMount() {
        console.log("componentDidMount");
        document.body.appendChild(this.renderer.domElement);
        window.addEventListener("resize", () => onResize());
        this.render();
    }

    render() {
        requestAnimationFrame(this.render);
        if (this.source.ready === false) return;
        this.context.update(this.source.domElement);
        this.renderer.render(this.scene, this.camera);
    }

    public onResize() {
        this.source.onResizeElement();
        this.source.copyElementSizeTo(this.renderer.domElement);
        this.context.arController &&
            this.source.copyElementSizeTo(this.context.arController.canvas);
    }

    createRenderer(): THREE.WebGLRenderer {
        var renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        renderer.setClearColor(new THREE.Color("black"), 0);
        renderer.setSize(640, 480);
        renderer.domElement.style.position = "absolute";
        renderer.domElement.style.top = "0px";
        renderer.domElement.style.left = "0px";
        return renderer;
    }

    setupThree(): [THREE.Camera, THREE.Light] {
        const camera = new THREE.Camera();
        const light = new THREE.DirectionalLight(0xffffff);
        light.position.set(0, 0, 2);
        return [camera, light];
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
            marker.add(await loadVRM());
            // marker.add(await ArBox());
            // marker.add(cloaking(new THREE.VideoTexture(this.source.domElement)));
        })();
        return marker;
    }
}
