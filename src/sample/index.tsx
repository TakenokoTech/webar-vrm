// import * as THREE from "three";
// import "threex";
// import * as THREE from "three/build/three";
// import * as THREEx from "ar.js/aframe/build/aframe-ar";
// import "ar.js/three.js/build/ar";
// import "../vendor/THREE.WebAR";
// import "ar.js/three.js/build/ar";

//===================================================================
// three.js の各種設定
//===================================================================
var scene = new THREE.Scene(); // シーンの作成
var renderer = new THREE.WebGLRenderer({
    antialias: true, // アンチエイリアス有効
    alpha: true // canvasに透明度バッファを持たせる
});
renderer.setClearColor(new THREE.Color("black"), 0); // レンダラの背景色
renderer.setSize(640, 480); // レンダラのサイズ
renderer.domElement.style.position = "absolute"; // レンダラの位置は絶対値
renderer.domElement.style.top = "0px"; // レンダラの上端
renderer.domElement.style.left = "0px"; // レンダラの左端
document.body.appendChild(renderer.domElement); // レンダラの DOM を body に入れる

var camera = new THREE.Camera(); // カメラの作成
scene.add(camera); // カメラをシーンに追加

var light = new THREE.DirectionalLight(0xffffff); // 平行光源（白）を作成
light.position.set(0, 0, 2); // カメラ方向から照らす
scene.add(light); // シーンに光源を追加

//===================================================================
// arToolkitSource（マーカトラッキングするメディアソース）
//===================================================================
var source = new THREEx.ArToolkitSource({ sourceType: "webcam" });
source.init(function onReady() {
    onResize();
});

//===================================================================
// arToolkitContext（カメラパラメータ、マーカ検出設定）
//===================================================================
var context = new THREEx.ArToolkitContext({
    debug: false, // デバッグ用キャンバス表示（デフォルトfalse）
    cameraParametersUrl: "assets/camera_para.dat", // カメラパラメータファイル
    detectionMode: "mono", // 検出モード（color/color_and_matrix/mono/mono_and_matrix）
    imageSmoothingEnabled: true, // 画像をスムージングするか（デフォルトfalse）
    maxDetectionRate: 60, // マーカの検出レート（デフォルト60）
    canvasWidth: source.parameters.sourceWidth, // マーカ検出用画像の幅（デフォルト640）
    canvasHeight: source.parameters.sourceHeight // マーカ検出用画像の高さ（デフォルト480）
});
context.init(() => {
    camera.projectionMatrix.copy(context.getProjectionMatrix());
});

//===================================================================
// リサイズ処理
//===================================================================
function onResize() {
    source.onResizeElement(); // トラッキングソースをリサイズ
    source.copyElementSizeTo(renderer.domElement); // レンダラも同じサイズに
    context.arController &&
        source.copyElementSizeTo(context.arController.canvas);
}
window.addEventListener("resize", () => onResize());

//===================================================================
// ArMarkerControls（マーカと、マーカ検出時の表示オブジェクト）
//===================================================================
//-------------------------------
// その１（hiroマーカ＋立方体）
//-------------------------------
// マーカ
// ネットでhiroマーカの画像を得て、以下の AR.js のマーカトレーニングサイトで patt を作成
// https://jeromeetienne.github.io/AR.js/three.js/examples/marker-training/examples/generator.html
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

//===================================================================
// マウスダウン（タップ）によるピッキング処理
//===================================================================
window.addEventListener("mousedown", function(ret) {
    var mouseX = ret.clientX; // マウスのx座標
    var mouseY = ret.clientY; // マウスのy座標
    mouseX = (mouseX / window.innerWidth) * 2 - 1; // -1 ～ +1 に正規化されたx座標
    mouseY = -(mouseY / window.innerHeight) * 2 + 1; // -1 ～ +1 に正規化されたy座標
    var pos = new THREE.Vector3(mouseX, mouseY, 1); // マウスベクトル
    pos.unproject(camera); // スクリーン座標系をカメラ座標系に変換
    // レイキャスタを作成（始点, 向きのベクトル）
    var ray = new THREE.Raycaster(
        camera.position,
        pos.sub(camera.position).normalize()
    );
    var obj = ray.intersectObjects(scene.children, true); // レイと交差したオブジェクトの取得
    console.log(obj);
});

//===================================================================
// レンダリング・ループ
//===================================================================
function renderScene() {
    requestAnimationFrame(renderScene);
    if (source.ready === false) return;
    context.update(source.domElement);
    renderer.render(scene, camera);
}
renderScene();
