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

#### Reference API and SAMPLE
1. webxr <https://github.com/immersive-web/webxr>
2. webxr <https://immersive-web.github.io/webxr-samples/>
2. webxr <https://github.com/immersive-web/webxr-samples>
2. webvr <https://github.com/immersive-web/webvr-polyfill>

https://medium.com/@darktears/https-medium-com-darktears-rendering-immersive-web-experiences-with-three-js-and-webxr-8de7e06982d9

https://hacks.mozilla.org/2015/09/stereoscopic-rendering-in-webvr/

https://medium.com/@mahmoudnafifi/basics-of-stereoscopic-imaging-6f69a7916cfd
### TARGET USAGE ###
it makes no sense at the moment, I only copy-past interesting code when flying over the webXR API.
It will be nessesair to be interested in the LOWLEVEL of PixiJs and maybe Pixi-projections, Pixi-layers, Pixi-light.

```js
var app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0x2c3e50,
    stereoRenderer:true,
});

let renderView = new WebXRView(app.renderer.view, app.renderer);

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

note: hum will probably need hack this for update 2 stereo gl
from api
```js
    // Left eye.
    gl.viewport(0, 0, webglCanvas.width * 0.5, webglCanvas.height);
    cubeSea.render(frameData.leftProjectionMatrix, frameData.leftViewMatrix, stats, t);

    // Right eye.
    gl.viewport(webglCanvas.width * 0.5, 0, webglCanvas.width * 0.5, webglCanvas.height);
    cubeSea.render(frameData.rightProjectionMatrix, frameData.rightViewMatrix, stats, t);
```
from pixi
```js
  RenderTarget.prototype.activate = function activate() {
    // TODO refactor usage of frame..
    var gl = this.gl;

    // make sure the texture is unbound!
    this.frameBuffer.bind();

    this.calculateProjection(this.destinationFrame, this.sourceFrame);

    if (this.transform) {
      this.projectionMatrix.append(this.transform);
    }

    // TODO add a check as them may be the same!
    if (this.destinationFrame !== this.sourceFrame) {
      gl.enable(gl.SCISSOR_TEST);
      gl.scissor(this.destinationFrame.x | 0, this.destinationFrame.y | 0, this.destinationFrame.width * this.resolution | 0, this.destinationFrame.height * this.resolution | 0);
    } else {
      gl.disable(gl.SCISSOR_TEST);
    }

    // TODO - does not need to be updated all the time??
    gl.viewport(this.destinationFrame.x | 0, this.destinationFrame.y | 0, this.destinationFrame.width * this.resolution | 0, this.destinationFrame.height * this.resolution | 0);
  };
```