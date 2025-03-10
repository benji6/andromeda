<img src="/src/assets/logo.svg" />

Andromeda is a pluggable digital audio workstation built on open web technologies

**[Check it out here!](https://andromeda.netlify.app)**

## Plugin API

**NB this API should be considered pre-alpha**

### Effect plugin API

`EffectPlugin` should be a constructor or factory function which is newed up with an object with the following props:

- `audioContext` - `instanceof AudioContext` reference to the audioContext instance used by Andromeda
- `bpm` - `Number` - current bpm

```javascript
new EffectPlugin({ audioContext, bpm });
```

`effectPlugin` instances should then expose the following API:

- `connnect` - `Function` - required method - to be implemented in the same manner as `AudioNode.connect`
- `destination` - `AudioNode | AudioParam` - required property - an unchanging reference to an object which is a valid argument for `AudioNode.connect`
- `disconnect` - `Function` - required method - to be implemented in the same manner as `AudioNode.disconnect`
- `render` - `Function` - required method - called with a DOM element when the user wishes to view and possibly edit parameters in theplugin

## More info

Built using [virtual-audio-graph](https://github.com/benji6/virtual-audio-graph)
