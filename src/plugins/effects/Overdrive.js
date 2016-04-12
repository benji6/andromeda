import React from 'react'
import ReactDOM from 'react-dom'

const amounts = new WeakMap()
const inputGainNodes = new WeakMap()
const outputGainNodes = new WeakMap()
const panValues = new WeakMap()
const types = new WeakMap()
const waveshapers = new WeakMap()

const samples = 8192

const type1 = amount => {
  const restrictedAmount = Math.min(amount, 0.9999)
  const k = 2 * restrictedAmount / (1 - restrictedAmount)
  return Float32Array.from({length: samples}, (_, i) => {
    const x = i * 2 / samples - 1
    return (1 + k) * x / (1 + k * Math.abs(x))
  })
}

const type2 = amount => {
  const a = 1 - amount
  return Float32Array.from({length: samples}, (_, i) => {
    const x = i * 2 / samples - 1
    const y = x < 0 ? -Math.pow(Math.abs(x), a + 0.04) : Math.pow(x, a)
    return Math.tanh(2 * y)
  })
}

const type3 = amount => {
  const a = 1 - amount
  return Float32Array.from({length: samples}, (_, i) => {
    const x = i * 2 / samples - 1
    const y = x < 0 ? -Math.pow(Math.abs(x), a + 0.04) : Math.pow(x, a)
    return Math.tanh(y * 2)
  })
}

const sign = x => x === 0 ? 1 : Math.abs(x) / x

const type4 = amount => {
  const a = 1 - amount > 0.99 ? 0.99 : 1 - amount
  let y
  return Float32Array.from({length: samples}, (_, i) => {
    const x = i * 2 / samples - 1
    const abx = Math.abs(x)
    if (abx < a) y = abx
    else if (abx > a) y = a + (abx - a) / (1 + Math.pow((abx - a) / (1 - a), 2))
    else if (abx > 1) y = abx
    return sign(x) * y * (1 / ((a + 1) / 2))
  })
}

const type5 = _ => Float32Array.from({length: samples}, (_, i) => {
  const x = i * 2 / samples - 1
  if (x < -0.08905) {
    return (-3 / 4) * (1 - (Math.pow((1 - (Math.abs(x) - 0.032857)), 12)) + (1 / 3) * (Math.abs(x) - 0.032847)) + 0.01
  }
  if (x >= -0.08905 && x < 0.320018) {
    return (-6.153 * (x * x)) + 3.9375 * x
  }
  return 0.630035
})

const type6 = amount => {
  const a = 2 + Math.round(amount * 14)
  const bits = Math.round(Math.pow(2, a - 1))
  return Float32Array.from({length: samples}, (_, i) => {
    const x = i * 2 / samples - 1
    return Math.round(x * bits) / bits
  })
}

const typeFns = {type1, type2, type3, type4, type5, type6}

const ControlContainer = ({children}) => <div style={{padding: '1rem'}}>
  <label>
    {children}
  </label>
</div>

export default class {
  constructor ({audioContext}) {
    const amount = 0.725
    const inputGainNode = audioContext.createGain()
    const outputGainNode = audioContext.createGain()
    const waveshaper = audioContext.createWaveShaper()

    inputGainNode.connect(waveshaper).connect(outputGainNode)

    inputGainNode.gain.value = 10
    waveshaper.curve = type1(amount)

    amounts.set(this, amount)
    inputGainNodes.set(this, inputGainNode)
    outputGainNodes.set(this, outputGainNode)
    panValues.set(this, 0)
    types.set(this, 'type1')
    waveshapers.set(this, waveshaper)

    this.destination = inputGainNode
  }
  connect (destination) {
    outputGainNodes.get(this).connect(destination)
  }
  disconnect (destination) {
    outputGainNodes.get(this).disconnect(destination)
  }
  render (containerEl) {
    ReactDOM.render(
      <div style={{textAlign: 'center'}}>
        <h2>Overdrive</h2>
        <ControlContainer>
          Type&nbsp;
          <select defaultValue={types.get(this)} onChange={({target: {value}}) => {
            types.set(this, value)
            waveshapers.get(this).curve = typeFns[value](amounts.get(this))
          }}>
            <option value='type1'>type 1</option>
            <option value='type2'>type 2</option>
            <option value='type3'>type 3</option>
            <option value='type4'>type 4</option>
            <option value='type5'>type 5</option>
            <option value='type6'>type 6</option>
          </select>
        </ControlContainer>
        <ControlContainer>
          Input&nbsp;
          <input
            defaultValue={inputGainNodes.get(this).gain.value}
            max='20'
            min='0'
            onInput={e => inputGainNodes.get(this).gain.value = Number(e.target.value)}
            step='0.1'
            type='range'
          />
        </ControlContainer>
        <ControlContainer>
          Amount&nbsp;
          <input
            defaultValue={amounts.get(this)}
            max='1'
            min='0'
            onInput={e => {
              const val = Number(e.target.value)
              amounts.set(this, val)
              waveshapers.get(this).curve = typeFns[types.get(this)](val)
            }}
            step='0.05'
            type='range'
            />
        </ControlContainer>
        <ControlContainer>
          Output&nbsp;
          <input
            defaultValue={outputGainNodes.get(this).gain.value}
            max='3'
            min='0'
            onInput={e => outputGainNodes.get(this).gain.value = Number(e.target.value)}
            step='0.05'
            type='range'
          />
        </ControlContainer>
      </div>,
      containerEl
    )
  }
}
