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

### Instrument plugin API

`InstrumentPlugin` should be a constructor or factory function which is newed up with an object with the following props:

- `audioContext` - `instanceof AudioContext` reference to the audioContext instance used by Andromeda
- `bpm` - `Number` - current bpm

```javascript
new InstrumentPlugin({ audioContext, bpm });
```

`instrumentPlugin` instances should then expose the following API:

- `connnect` - `Function` - required method - to be implemented in the same manner as `AudioNode.connect`
- `disconnect` - `Function` - required method - to be implemented in the same manner as `AudioNode.disconnect`
- `noteStart` - `Function | undefined` - optional method - called with a note object (see specification below). If available then controllers will be able to control this plugin
- `notesStart` - `Function | undefined` - optional method - called with an array of note objects (see specification below). If unavailable controllers will attempt to call `noteStart` for each noteObj. Some plugin implementations may have performance benefits to batching the starting of notes.
- `noteStop` - `Function | undefined` - optional method - called with the id of the note to stop. If available then controllers will be able to stop notes which are currently playing
- `noteModify` - `Function | undefined` - optional method - called with a note object (see specification below). If available then controllers will be able to modify notes which are currently playing
- `render` - `Function` - required method - called with a DOM element when user wishes to view and possibly modify parameters within the plugin

#### Note object specification

Instrument plugins receive note objects which have the following properties:

- `frequency` - `Number` - frequency in Hz of the note
- `gain` - `Number` - gain of the note using the same basis as `GainNode`
- `id` - `String` - unique id for this note which is essential for keeping track of which notes are playing and which are to be stopped
- `startTime` - `Number | undefined` - optional property, if specified it is the time at which the note is to be started measured on the same basis as `audioContext.currentTime`, if not specified the note is expected to start immediately
- `stopTime` - `Number | undefined` - optional property, if specified it is the time at which the note is to be stopped measured on the same basis as `audioContext.currentTime`, if not specified the note is expected to stop immediately

## More info

Built using [virtual-audio-graph](https://github.com/benji6/virtual-audio-graph)
