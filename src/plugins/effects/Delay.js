import React from 'react'
import ReactDOM from 'react-dom'
import createVirtualAudioGraph from 'virtual-audio-graph'

const maxDelayTime = 1.2

const delayTimes = new WeakMap()
const dryLevels = new WeakMap()
const feedbacks = new WeakMap()
const highCuts = new WeakMap()
const lowCuts = new WeakMap()
const outputs = new WeakMap()
const pingPongs = new WeakMap()
const virtualAudioGraphs = new WeakMap()
const wetLevels = new WeakMap()

const ControlContainer = ({children}) => <div style={{padding: '1rem'}}>
  <label>
    {children}
  </label>
</div>

const updateAudioGraph = function () {
  virtualAudioGraphs.get(this).update({
    0: ['gain', 'output', {gain: wetLevels.get(this)}],
    1: ['stereoPanner', 0, {pan: -1}],
    2: ['stereoPanner', 0, {pan: 1}],
    3: ['delay', [2, 8], {maxDelayTime, delayTime: delayTimes.get(this)}],
    4: ['gain', 3, {gain: feedbacks.get(this)}],
    5: ['delay', pingPongs.get(this) ? [1, 3] : [0, 8], {maxDelayTime, delayTime: delayTimes.get(this)}],
    6: ['biquadFilter', 5, {frequency: highCuts.get(this)}],
    7: ['biquadFilter', 6, {frequency: lowCuts.get(this), type: 'highpass'}],
    8: ['gain', 7, {gain: feedbacks.get(this)}],
    9: ['gain', 'output', {gain: dryLevels.get(this)}],
    input: ['gain', [8, 9], {gain: 1}, 'input']
  })
}

export default class {
  constructor ({audioContext}) {
    const output = audioContext.createGain()
    const virtualAudioGraph = createVirtualAudioGraph({audioContext, output})

    delayTimes.set(this, 1 / 3)
    dryLevels.set(this, 0.9)
    feedbacks.set(this, 0.25)
    highCuts.set(this, 16000)
    lowCuts.set(this, 50)
    outputs.set(this, output)
    pingPongs.set(this, true)
    virtualAudioGraphs.set(this, virtualAudioGraph)
    wetLevels.set(this, 0.6)
1
    updateAudioGraph.call(this)

    this.destination = virtualAudioGraph.getAudioNodeById('input')
  }
  connect (destination) {
    outputs.get(this).connect(destination)
  }
  disconnect (destination) {
    outputs.get(this).disconnect(destination)
  }
  render (containerEl) {
    ReactDOM.render(
      <div style={{textAlign: 'center'}}>
        <h2>Delay</h2>
        <ControlContainer>
          Ping pong&nbsp;
          <input
            defaultChecked={pingPongs.get(this)}
            onChange={e => {
              pingPongs.set(this, e.target.checked)
              updateAudioGraph.call(this)
            }}
            type='checkbox'
          />
        </ControlContainer>
        <ControlContainer>
          Dry level&nbsp;
          <input
            defaultValue={dryLevels.get(this)}
            max='1.5'
            min='0'
            onInput={e => {
              dryLevels.set(this, Number(e.target.value))
              updateAudioGraph.call(this)
            }}
            step='0.01'
            type='range'
          />
        </ControlContainer>
        <ControlContainer>
          Wet level&nbsp;
          <input
            defaultValue={wetLevels.get(this)}
            max='1.5'
            min='0'
            onInput={e => {
              wetLevels.set(this, Number(e.target.value))
              updateAudioGraph.call(this)
            }}
            step='0.01'
            type='range'
          />
        </ControlContainer>
        <ControlContainer>
          Feedback&nbsp;
          <input
            defaultValue={feedbacks.get(this)}
            max='1.2'
            min='0'
            onInput={e => {
              feedbacks.set(this, Number(e.target.value))
              updateAudioGraph.call(this)
            }}
            step='0.01'
            type='range'
          />
        </ControlContainer>
        <ControlContainer>
          Delay time&nbsp;
          <input
            defaultValue={delayTimes.get(this)}
            max={maxDelayTime}
            min='0.01'
            onInput={e => {
              delayTimes.set(this, Number(e.target.value))
              updateAudioGraph.call(this)
            }}
            step='0.01'
            type='range'
          />
        </ControlContainer>
        <ControlContainer>
          Low cutoff&nbsp;
          <input
            defaultValue={Math.log(lowCuts.get(this))}
            max={Math.log(20000)}
            min={Math.log(20)}
            onInput={e => {
              lowCuts.set(this, Math.exp(Number(e.target.value)))
              updateAudioGraph.call(this)
            }}
            step='0.1'
            type='range'
          />
        </ControlContainer>
        <ControlContainer>
          High cutoff&nbsp;
          <input
            defaultValue={Math.log(highCuts.get(this))}
            max={Math.log(20000)}
            min={Math.log(20)}
            onInput={e => {
              highCuts.set(this, Math.exp(Number(e.target.value)))
              updateAudioGraph.call(this)
            }}
            step='0.1'
            type='range'
          />
        </ControlContainer>
      </div>,
      containerEl
    )
  }
}
