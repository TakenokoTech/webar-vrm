import * as THREE from "three";
import BaseContainer from "./BaseContainer";

export default class Scene implements BaseContainer {
    public scene = new THREE.Scene();
    private renderer: THREE.WebGLRenderer;
    private source = new THREEx.ArToolkitSource({ sourceType: "webcam" });

    constructor() {
        this.renderer = this.createRenderer();
        this.scene.add(this.createCamera());
        this.scene.add(this.createLight());
    }

    public componentDidMount() {
        document.body.appendChild(this.renderer.domElement);
    }

    createCamera(): THREE.Camera {
        const camera = new THREE.Camera();
        return camera;
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

    createLight(): THREE.Light {
        const light = new THREE.DirectionalLight(0xffffff);
        light.position.set(0, 0, 2);
        return light;
    }

    tool() {
        this.source.init(() => onResize());
    }
}
