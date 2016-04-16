<img src="http://elemental.audio/assets/logo.svg" />

[![Build Status](https://travis-ci.org/benji6/elemental.svg)](https://travis-ci.org/benji6/elemental)

Elemental is a pluggable digital audio workstation in development built on open web technologies

It currently only supports Chrome

**[Check it out here](http://elemental.audio/)**

## Plugin API

**NB this API should be considered pre-alpha**

### Effect plugin API

`EffectPlugin` should be a constructor or factory function which is newed up with an object containing a reference to the `audioContext` instance used by Elemental

```javascript
new EffectPlugin({audioContext})
```

`effectPlugin` instances should then expose the following API:

- `connnect` - `Function` - required method - to be implemented in the same manner as `AudioNode.connect`
- `destination` - `AudioNode | AudioParam` - required property - an unchanging reference to an object which is a valid argument for `AudioNode.connect`
- `disconnect` - `Function` - required method - to be implemented in the same manner as `AudioNode.disconnect`
- `render` - `Function` - required method - called with a DOM element when the user wishes to view and possibly edit parameters in theplugin

### Instrument plugin API

`InstrumentPlugin` should be a constructor or factory function which is newed up with an object containing a reference to the `audioContext` instance used by Elemental

```javascript
new InstrumentPlugin({audioContext})
```

`instrumentPlugin` instances should then expose the following API:

- `connnect` - `Function` - required method - to be implemented in the same manner as `AudioNode.connect`
- `disconnect` - `Function` - required method - to be implemented in the same manner as `AudioNode.disconnect`
- `inputNoteStart` - `Function | undefined` - optional method - called with a note object (see specification below). If available then controllers will be able to control this plugin
- `inputNoteStop` - `Function | undefined` - optional method - called with the id of the note to stop. If available then controllers will be able to stop notes which are currently playing
- `inputNoteModify` - `Function | undefined` - optional method - called with a note object (see specification below). If available then controllers will be able to modify notes which are currently playing
- `render` - `Function` - required method - called with a DOM element when user wishes to view and possibly modify parameters within the plugin

#### Note object specification

Instrument plugins receive note objects which have the following properties:

- `frequency` - `Number` - frequency in Hz of the note
- `gain` - `Number` - gain of the note using the same basis as `GainNode`
- `id` - `String` - unique id for this note which is essential for keeping track of which notes are playing and which are to be stopped
- `startTime` - `Number | undefined` - optional property, if specified it is the time at which the note is to be started measured on the same basis as `audioContext.currentTime`, if not specified the note is expected to start immediately
- `stopTime` - `Number | undefined` - optional property, if specified it is the time at which the note is to be stopped measured on the same basis as `audioContext.currentTime`, if not specified the note is expected to stop immediately

## More info

Built using [virtual-audio-graph](https://github.com/benji6/virtual-audio-graph/)

Impulse responses taken from [OpenAir](http://www.openairlib.net/)

Samples taken from [SampleSwap](http://sampleswap.org)
