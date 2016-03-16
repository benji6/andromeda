<img src="http://elemental.audio/assets/logo.svg" />

[![Build Status](https://travis-ci.org/benji6/elemental.svg)](https://travis-ci.org/benji6/elemental)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

Elemental is a digital audio workstation in development built on open web technologies

It currently only supports Chrome and is aimed at tablet resolutions and up.

**[Check it out here](http://elemental.audio/)**

## Plugin API

This is in very early stages of development at the moment

### Instrument Plugin API

InstrumentPlugin should be a constructor or factory function which is newed up with an object containing a reference to the audioContext instance used by Elemental

```javascript
new InstrumentPlugin({audioContext})
```

instrumentPlugin instances should then expose the following API:

- `connnect` - to be implemented in the same manner as `AudioNode#connect`
- `disconnect` - to be implemented in the same manner as `AudioNode#disconnect`
- `inputNoteStart` - method which accepts a note object - the specification for which hasn't been finalized yet
- `inputNoteStop` - method which accepts a note object - the specification for which hasn't been finalized yet
- `render` - method which is passed a DOM element and is called when user wishes to view and possibly edit the plugin

### Effects Plugins API

EffectPlugin should be a constructor or factory function which is newed up with an object containing a reference to the audioContext instance used by Elemental

```javascript
new EffectPlugin({audioContext})
```

effectPlugin instances should then expose the following API:

- `connnect` - to be implemented in the same manner as `AudioNode#connect`
- `destination` - property which is an unchanging reference to an AudioNode which other AudioNodes can pass to their `connect` methods
- `disconnect` - to be implemented in the same manner as `AudioNode#disconnect`
- `render` - method which is passed a DOM element and is called when user wishes to view and possibly edit the plugin

## More info

Built using [virtual-audio-graph](https://github.com/benji6/virtual-audio-graph/)

Impulse responses taken from [OpenAir](http://www.openairlib.net/).
