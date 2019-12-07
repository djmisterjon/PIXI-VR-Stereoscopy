# ![alt text](https://github.com/immersive-web/webxr/blob/master/images/spec-logo.png?raw=true "webxr")![alt text](https://images.opencollective.com/pixijs/f97b489/logo.png?raw=true "webxr")PIXI-VR-Stereoscopy
### Experimental pixijs for VR 3d stereo rendering using webxr api

| headset       | Tested        | Issu  |
| ------------- |:-------------:| -----:|
| Windows Mixed Reality | no | ? |
| Oculus  Rift              | no | ? |
| Oculus  Go                | no | ? |
| HTC     VIVE              | no | ? |
| Google  Cardboard         | no | ? |
---

#### Reference API
1. webxr <https://github.com/immersive-web/webxr>
2. webvr <https://github.com/immersive-web/webvr-polyfill>


### TARGET USAGE ###
this can make no sence, it just some copy past interesting code from api.

```js
var app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0x2c3e50,
    stereoRenderer:true,
});



let renderView = new WebXRView(app.renderer.view, PIXI.WebGLRenderer);

const stereoLayerL = new PIXI.display.Layer(PIXI.lights.diffuseGroup);
const stereoLayerR = new PIXI.display.Layer(PIXI.lights.normalGroup);
const stereoLight   = new PIXI.display.Layer(PIXI.lights.lightGroup);
    stereoLayerL.renderView.eye = renderView.left;
    stereoLayerR.renderView.eye = renderView.right;
    stereoLayerR.renderView.eye = renderView.eye;
// Left eye.
stereoLayerL.render(frameData.leftProjectionMatrix, frameData.leftViewMatrix, stats, t);
// Right eye.
stereoLayerR.render(frameData.rightProjectionMatrix, frameData.rightViewMatrix, stats, t);
```