import {addEffect} from '../actions'
import store from '../store'
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
  .then(_ => store.dispatch(addEffect(name)))

loadReverb('assets/sb.wav', 'reverb chapel')
loadReverb('assets/h.wav', 'reverb mausoleum')
loadReverb('assets/st.wav', 'reverb stairwell')
