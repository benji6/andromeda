import store from './store'
import virtualAudioGraph from './virtualAudioGraph'
store.subscribe(() => virtualAudioGraph.update(store.getState().audioGraphAndChannels.audioGraph))
