// If requested, use the polyfill to provide support for mobile devices
// and devices which only support WebVR.
import WebXRPolyfill from './js/third-party/webxr-polyfill/build/webxr-polyfill.module.js';
if (QueryArgs.getBool('usePolyfill', true)) {
    let polyfill = new WebXRPolyfill();
}
// XR globals.
let xrButton = null;
let xrImmersiveRefSpace = null;
let inlineViewerHelper = null;
// WebGL scene globals.
let gl = null;
let renderer = null;
let scene = new Scene();
scene.addNode(new SkyboxNode({
    url: 'media/textures/chess-pano-4k.jpg',
    displayMode: 'stereoTopBottom'
}));

function initXR() {
    xrButton = new WebXRButton({
        onRequestSession: onRequestSession,
        onEndSession: onEndSession
    });
    document.querySelector('header').appendChild(xrButton.domElement);
    if (navigator.xr) {
        navigator.xr.isSessionSupported('immersive-vr').then((supported) => {
            xrButton.enabled = supported;
        });
        navigator.xr.requestSession('inline').then(onSessionStarted);
    }
}

function initGL() {
    if (gl)
        return;
    gl = createWebGLContext({
        xrCompatible: true
    });
    document.body.appendChild(gl.canvas);

    function onResize() {
        gl.canvas.width = gl.canvas.clientWidth * window.devicePixelRatio;
        gl.canvas.height = gl.canvas.clientHeight * window.devicePixelRatio;
    }
    window.addEventListener('resize', onResize);
    onResize();
    renderer = new Renderer(gl);
    scene.setRenderer(renderer);
    scene.inputRenderer.setControllerMesh(new Gltf2Node({
        url: 'media/gltf/controller/controller.gltf'
    }), 'right');
    scene.inputRenderer.setControllerMesh(new Gltf2Node({
        url: 'media/gltf/controller/controller-left.gltf'
    }), 'left');
}

function onRequestSession() {
    return navigator.xr.requestSession('immersive-vr').then((session) => {
        xrButton.setSession(session);
        session.isImmersive = true;
        onSessionStarted(session);
    });
}

function onSessionStarted(session) {
    session.addEventListener('end', onSessionEnded);
    initGL();
    let glLayer = new XRWebGLLayer(session, gl);
    session.updateRenderState({
        baseLayer: glLayer
    });
    // When rendering 360 photos/videos you want to ensure that the user's
    // head is always at the center of the rendered media. Otherwise users
    // with 6DoF hardware could walk towards the edges and see a very skewed
    // or outright broken view of the image. To prevent that, we request a
    // 'position-disabled' reference space, which suppresses any positional
    // information from the headset. (As an added bonus this mode may be
    // more power efficient on some hardware!)
    let refSpaceType = session.isImmersive ? 'local' : 'viewer';
    session.requestReferenceSpace(refSpaceType).then((refSpace) => {
        if (session.isImmersive) {
            xrImmersiveRefSpace = refSpace;
        } else {
            inlineViewerHelper = new InlineViewerHelper(gl.canvas, refSpace);
        }
        session.requestAnimationFrame(onXRFrame);
    });
}

function onEndSession(session) {
    session.end();
}

function onSessionEnded(event) {
    if (event.session.isImmersive) {
        xrButton.setSession(null);
    }
}

function onXRFrame(t, frame) {
    let session = frame.session;
    let refSpace = session.isImmersive ?
        xrImmersiveRefSpace :
        inlineViewerHelper.referenceSpace;
    let pose = frame.getViewerPose(refSpace);
    scene.startFrame();
    session.requestAnimationFrame(onXRFrame);
    let glLayer = session.renderState.baseLayer;
    gl.bindFramebuffer(gl.FRAMEBUFFER, glLayer.framebuffer);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    if (pose) {
        let views = [];
        for (let view of pose.views) {
            let renderView = new WebXRView(view, glLayer);
            // It's important to take into account which eye the view is
            // associated with in cases like this, since it informs which half
            // of the stereo image should be used when rendering the view.
            renderView.eye = view.eye
            views.push(renderView);
        }
        scene.updateInputSources(frame, refSpace);
        scene.drawViewArray(views);
    }
    scene.endFrame();
}
// Start the XR application.
initXR();