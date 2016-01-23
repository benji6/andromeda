import {addEffect} from '../actions'
import {dispatch} from '../store'
import adsr from './tools/adsr'
import detuned from './oscillatorBanks/detuned'
import fm from './oscillatorBanks/fm'
import none from './effects/none'
import pingPongDelay from './effects/pingPongDelay'
import reverbAsync from './effects/reverb-async'
import sine from './oscillatorBanks/sine'
import supersaw from './oscillatorBanks/supersaw'
import triangles from './oscillatorBanks/triangles'
import virtualAudioGraph from '../virtualAudioGraph'

virtualAudioGraph.defineNodes({
  adsr, detuned, fm, none, pingPongDelay, sine, supersaw, triangles
})

const loadReverb = (uri, name) => reverbAsync(uri)
  .then(reverb => virtualAudioGraph.defineNodes({[name]: reverb}))
  .then(() => dispatch(addEffect(name)))

loadReverb('audio/sb.wav', 'reverb chapel')
loadReverb('audio/h.wav', 'reverb mausoleum')
loadReverb('audio/st.wav', 'reverb stairwell')
