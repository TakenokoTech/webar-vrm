declare module THREEx {
    export class ArToolkitContext {
        arController: any;
        constructor(param: any);
        init(f: any): void;
        update(el: HTMLVideoElement): void;
        getProjectionMatrix(): THREE.Matrix4;
    }
    export class ArToolkitSource {
        domElement: HTMLVideoElement;
        ready: boolean;
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
