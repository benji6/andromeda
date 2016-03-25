import React from 'react'
import ReactDOM from 'react-dom'
import createVirtualAudioGraph from 'virtual-audio-graph'

const maxDelayTime = 1.2

const delayTimes = new WeakMap()
const dryLevels = new WeakMap()
const feedbacks = new WeakMap()
const outputs = new WeakMap()
const virtualAudioGraphs = new WeakMap()

const ControlContainer = ({children}) => <div style={{padding: '1rem'}}>
  <label>
    {children}
  </label>
</div>

const updateAudioGraph = function () {
  virtualAudioGraphs.get(this).update({
    0: ['stereoPanner', 'output', {pan: -1}],
    1: ['stereoPanner', 'output', {pan: 1}],
    2: ['delay', [1, 5], {maxDelayTime, delayTime: delayTimes.get(this)}],
    3: ['gain', 2, {gain: feedbacks.get(this)}],
    4: ['delay', [0, 3], {maxDelayTime, delayTime: delayTimes.get(this)}],
    5: ['gain', 4, {gain: feedbacks.get(this)}],
    6: ['gain', 'output', {gain: dryLevels.get(this)}],
    input: ['gain', [5, 6], {gain: 1}, 'input']
  })
}

export default class {
  constructor ({audioContext}) {
    const output = audioContext.createGain()
    const virtualAudioGraph = createVirtualAudioGraph({audioContext, output})

    delayTimes.set(this, 1 / 3)
    dryLevels.set(this, 2 / 3)
    feedbacks.set(this, 1 / 3)
    outputs.set(this, output)
    virtualAudioGraphs.set(this, virtualAudioGraph)

    updateAudioGraph.call(this)

    this.destination = virtualAudioGraph.getAudioNodeById('input')
  }
  connect (destination) {
    outputs.get(this).connect(destination)
  }
  disconnect (destination) {
    outputs.get(this).disconnect()
  }
  render (containerEl) {
    ReactDOM.render(
      <div style={{textAlign: 'center'}}>
        <h2>Delay</h2>
        <ControlContainer>
          Dry level&nbsp;
          <input
            defaultValue={dryLevels.get(this)}
            max={maxDelayTime}
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
      </div>,
      containerEl
    )
  }
}
