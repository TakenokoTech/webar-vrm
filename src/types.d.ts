declare module THREEx {
    export class ArToolkitContext {
        arController: any;
        constructor(param: any);
        init(f: any): void;
        getProjectionMatrix(): THREE.Matrix4;
    }
    export class ArToolkitSource {
        domElement: HTMLVideoElement;
        constructor(param: any);
        init(f: any): void;
        parameters: any;
        onResizeElement(): any;
        copyElementSizeTo(el: HTMLCanvasElement): any;
    }
    export class ArMarkerControls {
        constructor(...param: any);
    }
    export class ArMarkerCloak {
        object3d: any;
        constructor(texture: THREE.VideoTexture);
    }
}
