import * as THREE from "three";
import BaseContainer from "./BaseContainer";

export class Scene implements BaseContainer {
    public scene = new THREE.Scene();
    private camera: THREE.Camera;
    private light: THREE.Light;
    private renderer: THREE.WebGLRenderer;
    private source: THREEx.ArToolkitSource;
    private context: THREEx.ArToolkitContext;

    constructor() {
        this.renderer = this.createRenderer();
        [this.camera, this.light] = this.setupThree();
        [this.source, this.context] = this.createContext();
        this.scene.add(this.camera);
        this.scene.add(this.light);
    }

    public componentDidMount() {
        document.body.appendChild(this.renderer.domElement);
        window.addEventListener("resize", () => onResize());
    }

    public onResize() {
        source.onResizeElement();
        source.copyElementSizeTo(renderer.domElement);
        context.arController &&
            source.copyElementSizeTo(context.arController.canvas);
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
        source.init(() => onResize());
        context.init(() =>
            this.camera.projectionMatrix.copy(context.getProjectionMatrix())
        );
        return [source, context];
    }

    marker() {
        var marker1 = new THREE.Group(); // マーカをグループとして作成
        var controls = new THREEx.ArMarkerControls(context, marker1, {
            // マーカを登録
            type: "pattern", // マーカのタイプ
            patternUrl: "assets/pattern-hiro.patt" // マーカファイル
        });
        scene.add(marker1); // マーカをシーンに追加
        // モデル（メッシュ）
        var geo = new THREE.CubeGeometry(1, 1, 1); // cube ジオメトリ（サイズは 1x1x1）
        var mat = new THREE.MeshNormalMaterial({
            // マテリアルの作成
            transparent: true, // 透過
            opacity: 0.5, // 不透明度
            side: THREE.DoubleSide // 内側も描く
        });
        var mesh1 = new THREE.Mesh(geo, mat); // メッシュを生成
        mesh1.name = "cube"; // メッシュの名前（後でピッキングで使う）
        mesh1.position.set(0, 0.5, 0); // 初期位置
        marker1.add(mesh1); // メッシュをマーカに追加
        // マーカ隠蔽（cloaking）
        var videoTex = new THREE.VideoTexture(source.domElement); // 映像をテクスチャとして取得
        videoTex.minFilter = THREE.NearestFilter; // 映像テクスチャのフィルタ処理
        var cloak = new THREEx.ArMarkerCloak(videoTex); // マーカ隠蔽(cloak)オブジェクト
        cloak.object3d.material.uniforms.opacity.value = 1.0; // cloakの不透明度
        marker1.add(cloak.object3d); // cloakをマーカに追加
    }
}
