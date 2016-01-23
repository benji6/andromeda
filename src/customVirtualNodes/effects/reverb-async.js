import audioContext from '../../audioContext'

// word is audioContext.decodeAudioData will one day return a promise natively...
const decodeAudioData = data => new Promise(resolve => audioContext.decodeAudioData(data, resolve))

export default url => window.fetch(url).then(response => response.arrayBuffer())
                                .then(decodeAudioData)
                                .then(buffer => () => ({0: ['gain', 'output', {gain: 0.5}],
                                                        1: ['convolver', 0, {buffer}, 'input']}))
