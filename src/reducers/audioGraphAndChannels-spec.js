import test from 'tape'
import {
  addAudioGraphSource,
  addChannel,
  addChannelEffect,
  moveChannelEffectDown,
  moveChannelEffectUp,
  removeChannel,
  removeChannelEffect
} from '../actions'
import reducer from './audioGraphAndChannels'

const reducerName = 'audioGraphAndChannels'

const initialState = {
  audioGraph: {'channel:0-type:effect-id:0': ['pingPongDelay', 'output']},
  channels: [{
    effects: [{id: 0, name: 'pingPongDelay'}],
    id: 0,
    selectedAddEffect: 'pingPongDelay',
    selectedAddSource: 'fm',
    sources: ['sine']
  }]
}

const testState0 = {
  audioGraph: {
    'channel:0-type:effect-id:0': ['effect1', 'output'],
    'channel:0-type:effect-id:90': ['effect90', 'channel:0-type:effect-id:0'],
    'channel:1-type:effect-id:100': ['effect100', 'output'],
    'channel:1-type:effect-id:42': ['effect42', 'channel:1-type:effect-id:100'],
    'channel:1-type:effect-id:99': ['effect99', 'channel:1-type:effect-id:42']
  },
  channels: [
    {
      effects: [
        {id: 1, name: 'effect1'},
        {id: 90, name: 'effect90'}
      ],
      id: 0,
      selectedAddEffect: 'pingPongDelay',
      selectedAddSource: 'fm',
      sources: ['sine']
    },
    {
      effects: [
        {id: 100, name: 'effect100'},
        {id: 42, name: 'effect42'},
        {id: 99, name: 'effect99'}
      ],
      id: 1,
      selectedAddEffect: 'pingPongDelay',
      selectedAddSource: 'fm',
      sources: ['sine']
    }
  ]
}

const testState2 = {
  audioGraph: {
    'channel:0-type:effect-id:0': ['pingPongDelay', 'output'],
    'channel:1-type:effect-id:0': ['pingPongDelay', 'output']
  },
  channels: [
    {
      effects: [{id: 0, name: 'pingPongDelay'}],
      id: 0,
      selectedAddEffect: 'pingPongDelay',
      selectedAddSource: 'fm',
      sources: ['detuned']
    },
    {
      effects: [{id: 0, name: 'pingPongDelay'}],
      id: 1,
      selectedAddEffect: 'pingPongDelay',
      selectedAddSource: 'fm',
      sources: ['sine']
    }
  ]
}

test(`${reducerName} reducer returns initial state`, t => {
  t.deepEqual(reducer(undefined, {}), initialState)
  t.deepEqual(reducer(undefined, {}), initialState)
  t.end()
})

test(`${reducerName} reducer addChannel`, t => {
  t.deepEqual(reducer({
    audioGraph: {
      'channel:0-type:effect-id:0': ['pingPongDelay', 'output'],
      'channel:2-type:effect-id:0': ['pingPongDelay', 'output']
    },
    channels: [
      {
        effects: [{id: 0, name: 'pingPongDelay'}],
        id: 0,
        selectedAddEffect: 'pingPongDelay',
        selectedAddSource: 'fm',
        sources: ['detuned']
      },
      {
        effects: [{id: 0, name: 'pingPongDelay'}],
        id: 2,
        selectedAddEffect: 'pingPongDelay',
        selectedAddSource: 'fm',
        sources: ['sine']
      }
    ]
  }, addChannel()), {
    audioGraph: {
      'channel:0-type:effect-id:0': ['pingPongDelay', 'output'],
      'channel:2-type:effect-id:0': ['pingPongDelay', 'output']
    },
    channels: [
      {
        effects: [{id: 0, name: 'pingPongDelay'}],
        id: 0,
        selectedAddEffect: 'pingPongDelay',
        selectedAddSource: 'fm',
        sources: ['detuned']
      },
      {
        effects: [{id: 0, name: 'pingPongDelay'}],
        id: 2,
        selectedAddEffect: 'pingPongDelay',
        selectedAddSource: 'fm',
        sources: ['sine']
      },
      {
        effects: [],
        id: 3,
        selectedAddEffect: 'pingPongDelay',
        selectedAddSource: 'detuned',
        sources: []
      }
    ]
  })
  t.end()
})

test(`${reducerName} reducer addChannelEffect`, t => {
  t.deepEqual(reducer(testState2, addChannelEffect({
    channelId: 1,
    effect: 'test effect'
  })), {
    audioGraph: {
      'channel:0-type:effect-id:0': ['pingPongDelay', 'output'],
      'channel:1-type:effect-id:0': ['pingPongDelay', 'output'],
      'channel:1-type:effect-id:1': ['test effect', 'channel:1-type:effect-id:0']
    },
    channels: [
      {
        effects: [{id: 0, name: 'pingPongDelay'}],
        id: 0,
        selectedAddEffect: 'pingPongDelay',
        selectedAddSource: 'fm',
        sources: ['detuned']
      },
      {
        effects: [{id: 0, name: 'pingPongDelay'}, {id: 1, name: 'test effect'}],
        id: 1,
        selectedAddEffect: 'pingPongDelay',
        selectedAddSource: 'fm',
        sources: ['sine']
      }
    ]
  })
  t.deepEqual(reducer({
    audioGraph: {
      'channel:0-type:effect-id:0': ['effect1', 'output'],
      'channel:0-type:effect-id:90': ['effect90', 'channel:0-type:effect-id:0'],
      'channel:1-type:effect-id:100': ['effect100', 'output'],
      'channel:1-type:effect-id:42': ['effect42', 'channel:1-type:effect-id:100'],
      'channel:1-type:effect-id:99': ['effect99', 'channel:1-type:effect-id:42']
    },
    channels: [
      {
        effects: [
          {id: 1, name: 'effect1'},
          {id: 90, name: 'effect90'}
        ],
        id: 0,
        selectedAddEffect: 'pingPongDelay',
        selectedAddSource: 'fm',
        sources: ['sine']
      },
      {
        effects: [
          {id: 100, name: 'effect100'},
          {id: 42, name: 'effect42'},
          {id: 99, name: 'effect99'}
        ],
        id: 1,
        selectedAddEffect: 'pingPongDelay',
        selectedAddSource: 'fm',
        sources: ['sine']
      },
      {
        effects: [],
        id: 2,
        selectedAddEffect: 'pingPongDelay',
        selectedAddSource: 'fm',
        sources: ['sine']
      }
    ]
  }, addChannelEffect({
    channelId: 2,
    effect: 'test effect'
  })), {
    audioGraph: {
      'channel:0-type:effect-id:0': ['effect1', 'output'],
      'channel:0-type:effect-id:90': ['effect90', 'channel:0-type:effect-id:0'],
      'channel:1-type:effect-id:100': ['effect100', 'output'],
      'channel:1-type:effect-id:42': ['effect42', 'channel:1-type:effect-id:100'],
      'channel:1-type:effect-id:99': ['effect99', 'channel:1-type:effect-id:42'],
      'channel:2-type:effect-id:0': ['test effect', 'output']
    },
    channels: [
      {
        effects: [
          {id: 1, name: 'effect1'},
          {id: 90, name: 'effect90'}
        ],
        id: 0,
        selectedAddEffect: 'pingPongDelay',
        selectedAddSource: 'fm',
        sources: ['sine']
      },
      {
        effects: [
          {id: 100, name: 'effect100'},
          {id: 42, name: 'effect42'},
          {id: 99, name: 'effect99'}
        ],
        id: 1,
        selectedAddEffect: 'pingPongDelay',
        selectedAddSource: 'fm',
        sources: ['sine']
      },
      {
        effects: [{id: 0, name: 'test effect'}],
        id: 2,
        selectedAddEffect: 'pingPongDelay',
        selectedAddSource: 'fm',
        sources: ['sine']
      }
    ]
  })
  t.deepEqual(reducer({
    audioGraph: {
      'channel:0-type:effect-id:0': ['pingPongDelay', 'output'],
      'channel:1-type:effect-id:0': ['pingPongDelay', 'output'],
      'channel:1-type:source-id:testSource': ['test source', 'channel:1-type:effect-id:0']
    },
    channels: [
      {
        effects: [{id: 0, name: 'pingPongDelay'}],
        id: 0,
        selectedAddEffect: 'pingPongDelay',
        selectedAddSource: 'fm',
        sources: ['detuned']
      },
      {
        effects: [{id: 0, name: 'pingPongDelay'}],
        id: 1,
        selectedAddEffect: 'pingPongDelay',
        selectedAddSource: 'test source',
        sources: ['test source']
      }
    ]
  }, addChannelEffect({
    channelId: 1,
    effect: 'test effect'
  })), {
    audioGraph: {
      'channel:0-type:effect-id:0': ['pingPongDelay', 'output'],
      'channel:1-type:effect-id:0': ['pingPongDelay', 'output'],
      'channel:1-type:effect-id:1': ['test effect', 'channel:1-type:effect-id:0'],
      'channel:1-type:source-id:testSource': ['test source', 'channel:1-type:effect-id:1']
    },
    channels: [
      {
        effects: [{id: 0, name: 'pingPongDelay'}],
        id: 0,
        selectedAddEffect: 'pingPongDelay',
        selectedAddSource: 'fm',
        sources: ['detuned']
      },
      {
        effects: [{id: 0, name: 'pingPongDelay'}, {id: 1, name: 'test effect'}],
        id: 1,
        selectedAddEffect: 'pingPongDelay',
        selectedAddSource: 'test source',
        sources: ['test source']
      }
    ]
  })
  t.end()
})

test(`${reducerName} reducer moveChannelEffectDown`, t => {
  t.deepEqual(reducer(
    testState0,
    moveChannelEffectDown({channelId: 1, effectId: 100})
  ), {
    audioGraph: {
      'channel:0-type:effect-id:0': ['effect1', 'output'],
      'channel:0-type:effect-id:90': ['effect90', 'channel:0-type:effect-id:0'],
      'channel:1-type:effect-id:100': ['effect100', 'channel:1-type:effect-id:42'],
      'channel:1-type:effect-id:42': ['effect42', 'output'],
      'channel:1-type:effect-id:99': ['effect99', 'channel:1-type:effect-id:100']
    },
    channels: [
      {
        effects: [
          {id: 1, name: 'effect1'},
          {id: 90, name: 'effect90'}
        ],
        id: 0,
        selectedAddEffect: 'pingPongDelay',
        selectedAddSource: 'fm',
        sources: ['sine']
      },
      {
        effects: [
          {id: 42, name: 'effect42'},
          {id: 100, name: 'effect100'},
          {id: 99, name: 'effect99'}
        ],
        id: 1,
        selectedAddEffect: 'pingPongDelay',
        selectedAddSource: 'fm',
        sources: ['sine']
      }
    ]
  })

  t.deepEqual(reducer(
    testState0,
    moveChannelEffectDown({channelId: 1, effectId: 42})
  ), {
    audioGraph: {
      'channel:0-type:effect-id:0': ['effect1', 'output'],
      'channel:0-type:effect-id:90': ['effect90', 'channel:0-type:effect-id:0'],
      'channel:1-type:effect-id:100': ['effect100', 'output'],
      'channel:1-type:effect-id:42': ['effect42', 'channel:1-type:effect-id:99'],
      'channel:1-type:effect-id:99': ['effect99', 'channel:1-type:effect-id:100']
    },
    channels: [
      {
        effects: [
          {id: 1, name: 'effect1'},
          {id: 90, name: 'effect90'}
        ],
        id: 0,
        selectedAddEffect: 'pingPongDelay',
        selectedAddSource: 'fm',
        sources: ['sine']
      },
      {
        effects: [
          {id: 100, name: 'effect100'},
          {id: 99, name: 'effect99'},
          {id: 42, name: 'effect42'}
        ],
        id: 1,
        selectedAddEffect: 'pingPongDelay',
        selectedAddSource: 'fm',
        sources: ['sine']
      }
    ]
  })
  t.end()
})

test(`${reducerName} reducer moveChannelEffectUp`, t => {
  t.deepEqual(reducer(
    testState0,
    moveChannelEffectUp({channelId: 1, effectId: 99})
  ), {
    audioGraph: {
      'channel:0-type:effect-id:0': ['effect1', 'output'],
      'channel:0-type:effect-id:90': ['effect90', 'channel:0-type:effect-id:0'],
      'channel:1-type:effect-id:100': ['effect100', 'output'],
      'channel:1-type:effect-id:42': ['effect42', 'channel:1-type:effect-id:99'],
      'channel:1-type:effect-id:99': ['effect99', 'channel:1-type:effect-id:100']
    },
    channels: [
      {
        effects: [
          {id: 1, name: 'effect1'},
          {id: 90, name: 'effect90'}
        ],
        id: 0,
        selectedAddEffect: 'pingPongDelay',
        selectedAddSource: 'fm',
        sources: ['sine']
      },
      {
        effects: [
          {id: 100, name: 'effect100'},
          {id: 99, name: 'effect99'},
          {id: 42, name: 'effect42'}
        ],
        id: 1,
        selectedAddEffect: 'pingPongDelay',
        selectedAddSource: 'fm',
        sources: ['sine']
      }
    ]
  })

  t.deepEqual(reducer(
    testState0,
    moveChannelEffectUp({channelId: 1, effectId: 42})
  ), {
    audioGraph: {
      'channel:0-type:effect-id:0': ['effect1', 'output'],
      'channel:0-type:effect-id:90': ['effect90', 'channel:0-type:effect-id:0'],
      'channel:1-type:effect-id:100': ['effect100', 'channel:1-type:effect-id:42'],
      'channel:1-type:effect-id:42': ['effect42', 'output'],
      'channel:1-type:effect-id:99': ['effect99', 'channel:1-type:effect-id:100']
    },
    channels: [
      {
        effects: [
          {id: 1, name: 'effect1'},
          {id: 90, name: 'effect90'}
        ],
        id: 0,
        selectedAddEffect: 'pingPongDelay',
        selectedAddSource: 'fm',
        sources: ['sine']
      },
      {
        effects: [
          {id: 42, name: 'effect42'},
          {id: 100, name: 'effect100'},
          {id: 99, name: 'effect99'}
        ],
        id: 1,
        selectedAddEffect: 'pingPongDelay',
        selectedAddSource: 'fm',
        sources: ['sine']
      }
    ]
  })
  t.end()
})

test(`${reducerName} reducer removeChannel`, t => {
  t.deepEqual(reducer({
    audioGraph: {
      'channel:0-type:effect-id:0': ['effect1', 'output'],
      'channel:0-type:effect-id:90': ['effect90', 'channel:0-type:effect-id:0'],
      'channel:1-type:effect-id:100': ['effect100', 'output'],
      'channel:1-type:effect-id:42': ['effect42', 'channel:1-type:effect-id:100'],
      'channel:1-type:effect-id:99': ['effect99', 'channel:1-type:effect-id:42'],
      'channel:1-type:source-id:testSource': ['testSource', 'channel:1-type:effect-id:99'],
      'channel:2-type:effect-id:0': ['pingPongDelay', 'output'],
      'channel:3-type:effect-id:0': ['pingPongDelay', 'output']
    },
    channels: [
      {
        effects: [
          {id: 1, name: 'effect1'},
          {id: 90, name: 'effect90'}
        ],
        id: 0,
        selectedAddEffect: 'pingPongDelay',
        selectedAddSource: 'fm',
        sources: ['sine']
      },
      {
        effects: [
          {id: 100, name: 'effect100'},
          {id: 42, name: 'effect42'},
          {id: 99, name: 'effect99'}
        ],
        id: 1,
        selectedAddEffect: 'pingPongDelay',
        selectedAddSource: 'fm',
        sources: ['sine']
      },
      {
        effects: [{id: 0, name: 'pingPongDelay'}],
        id: 2,
        selectedAddEffect: 'pingPongDelay',
        selectedAddSource: 'fm',
        sources: ['sine']
      },
      {
        effects: [{id: 0, name: 'pingPongDelay'}],
        id: 3,
        selectedAddEffect: 'pingPongDelay',
        selectedAddSource: 'fm',
        sources: ['sine']
      }
    ]
  }, removeChannel(1)), {
    audioGraph: {
      'channel:0-type:effect-id:0': ['effect1', 'output'],
      'channel:0-type:effect-id:90': ['effect90', 'channel:0-type:effect-id:0'],
      'channel:2-type:effect-id:0': ['pingPongDelay', 'output'],
      'channel:3-type:effect-id:0': ['pingPongDelay', 'output']
    },
    channels: [
      {
        effects: [
          {id: 1, name: 'effect1'},
          {id: 90, name: 'effect90'}
        ],
        id: 0,
        selectedAddEffect: 'pingPongDelay',
        selectedAddSource: 'fm',
        sources: ['sine']
      },
      {
        effects: [{id: 0, name: 'pingPongDelay'}],
        id: 2,
        selectedAddEffect: 'pingPongDelay',
        selectedAddSource: 'fm',
        sources: ['sine']
      },
      {
        effects: [{id: 0, name: 'pingPongDelay'}],
        id: 3,
        selectedAddEffect: 'pingPongDelay',
        selectedAddSource: 'fm',
        sources: ['sine']
      }
    ]
  })
  t.deepEqual(reducer({
    audioGraph: {
      'channel:2-type:effect-id:0': ['effect1', 'output'],
      'channel:4-type:source-id:testSource': ['testSource', 'output'],
      'channel:6-type:effect-id:0': ['pingPongDelay', 'output']
    },
    channels: [
      {
        effects: [{id: 1, name: 'effect1'}],
        id: 2,
        selectedAddEffect: 'pingPongDelay',
        selectedAddSource: 'fm',
        sources: []
      },
      {
        effects: [],
        id: 4,
        selectedAddEffect: 'pingPongDelay',
        selectedAddSource: 'fm',
        sources: ['testSource']
      },
      {
        effects: [{id: 0, name: 'pingPongDelay'}],
        id: 6,
        selectedAddEffect: 'pingPongDelay',
        selectedAddSource: 'fm',
        sources: []
      }
    ]
  }, removeChannel(4)), {
    audioGraph: {
      'channel:2-type:effect-id:0': ['effect1', 'output'],
      'channel:6-type:effect-id:0': ['pingPongDelay', 'output']
    },
    channels: [
      {
        effects: [{id: 1, name: 'effect1'}],
        id: 2,
        selectedAddEffect: 'pingPongDelay',
        selectedAddSource: 'fm',
        sources: []
      },
      {
        effects: [{id: 0, name: 'pingPongDelay'}],
        id: 6,
        selectedAddEffect: 'pingPongDelay',
        selectedAddSource: 'fm',
        sources: []
      }
    ]
  })
  t.deepEqual(reducer({
    audioGraph: {
      'channel:2-type:effect-id:0': ['effect1', 'output'],
      'channel:6-type:source-id:testSource': ['testSource', 'output'],
      'channel:4-type:effect-id:0': ['pingPongDelay', 'output']
    },
    channels: [
      {
        effects: [{id: 1, name: 'effect1'}],
        id: 2,
        selectedAddEffect: 'pingPongDelay',
        selectedAddSource: 'fm',
        sources: []
      },
      {
        effects: [{id: 0, name: 'pingPongDelay'}],
        id: 4,
        selectedAddEffect: 'pingPongDelay',
        selectedAddSource: 'fm',
        sources: []
      },
      {
        effects: [],
        id: 6,
        selectedAddEffect: 'pingPongDelay',
        selectedAddSource: 'fm',
        sources: ['testSource']
      }
    ]
  }, removeChannel(6)), {
    audioGraph: {
      'channel:2-type:effect-id:0': ['effect1', 'output'],
      'channel:4-type:effect-id:0': ['pingPongDelay', 'output']
    },
    channels: [
      {
        effects: [{id: 1, name: 'effect1'}],
        id: 2,
        selectedAddEffect: 'pingPongDelay',
        selectedAddSource: 'fm',
        sources: []
      },
      {
        effects: [{id: 0, name: 'pingPongDelay'}],
        id: 4,
        selectedAddEffect: 'pingPongDelay',
        selectedAddSource: 'fm',
        sources: []
      }
    ]
  })
  t.end()
})

test(`${reducerName} reducer removeChannelEffect`, t => {
  t.deepEqual(reducer(testState2, removeChannelEffect({
    channelId: 0,
    effectId: 0
  })), {
    audioGraph: {
      'channel:1-type:effect-id:0': ['pingPongDelay', 'output']
    },
    channels: [
      {
        effects: [],
        id: 0,
        selectedAddEffect: 'pingPongDelay',
        selectedAddSource: 'fm',
        sources: ['detuned']
      },
      {
        effects: [{id: 0, name: 'pingPongDelay'}],
        id: 1,
        selectedAddEffect: 'pingPongDelay',
        selectedAddSource: 'fm',
        sources: ['sine']
      }
    ]
  })
  t.deepEqual(reducer(testState0, removeChannelEffect({
    channelId: 1,
    effectId: 42
  })), {
    audioGraph: {
      'channel:0-type:effect-id:0': ['effect1', 'output'],
      'channel:0-type:effect-id:90': ['effect90', 'channel:0-type:effect-id:0'],
      'channel:1-type:effect-id:100': ['effect100', 'output'],
      'channel:1-type:effect-id:99': ['effect99', 'channel:1-type:effect-id:100']
    },
    channels: [
      {
        effects: [
          {id: 1, name: 'effect1'},
          {id: 90, name: 'effect90'}
        ],
        id: 0,
        selectedAddEffect: 'pingPongDelay',
        selectedAddSource: 'fm',
        sources: ['sine']
      },
      {
        effects: [
          {id: 100, name: 'effect100'},
          {id: 99, name: 'effect99'}
        ],
        id: 1,
        selectedAddEffect: 'pingPongDelay',
        selectedAddSource: 'fm',
        sources: ['sine']
      }
    ]
  })
  t.deepEqual(reducer(testState0, removeChannelEffect({
    channelId: 1,
    effectId: 99
  })), {
    audioGraph: {
      'channel:0-type:effect-id:0': ['effect1', 'output'],
      'channel:0-type:effect-id:90': ['effect90', 'channel:0-type:effect-id:0'],
      'channel:1-type:effect-id:100': ['effect100', 'output'],
      'channel:1-type:effect-id:42': ['effect42', 'channel:1-type:effect-id:100']
    },
    channels: [
      {
        effects: [
          {id: 1, name: 'effect1'},
          {id: 90, name: 'effect90'}
        ],
        id: 0,
        selectedAddEffect: 'pingPongDelay',
        selectedAddSource: 'fm',
        sources: ['sine']
      },
      {
        effects: [
          {id: 100, name: 'effect100'},
          {id: 42, name: 'effect42'}
        ],
        id: 1,
        selectedAddEffect: 'pingPongDelay',
        selectedAddSource: 'fm',
        sources: ['sine']
      }
    ]
  })
  t.deepEqual(reducer({
    audioGraph: {
      'channel:0-type:effect-id:0': ['pingPongDelay', 'output'],
      'channel:0-type:source-id:something': ['sine', 'channel:0-type:effect-id:0']
    },
    channels: [
      {
        effects: [{id: 0, name: 'pingPongDelay'}],
        id: 0,
        selectedAddEffect: 'pingPongDelay',
        selectedAddSource: 'fm',
        sources: ['sine']
      }
    ]
  }, removeChannelEffect({
    channelId: 0,
    effectId: 0
  })), {
    audioGraph: {
      'channel:0-type:source-id:something': ['sine', 'output']
    },
    channels: [
      {
        effects: [],
        id: 0,
        selectedAddEffect: 'pingPongDelay',
        selectedAddSource: 'fm',
        sources: ['sine']
      }
    ]
  })
  t.end()
})

test(`${reducerName} reducer addAudioGraphSource`, t => {
  const instrument = 'some instrument'
  const params = {someParams: true}
  const id = 'some id'
  t.deepEqual(reducer({
    audioGraph: {
      'channel:3-type:effect-id:0': ['pingPongDelay', 'output']
    },
    channels: [{
      effects: [{id: 0, name: 'pingPongDelay'}],
      id: 3,
      selectedAddEffect: 'pingPongDelay',
      selectedAddSource: 'fm',
      sources: ['sine']
    }]
  }, addAudioGraphSource({
    id,
    instrument: 'sine',
    params
  })), {
    audioGraph: {
      'channel:3-type:effect-id:0': ['pingPongDelay', 'output'],
      'channel:[3]-type:source-id:some id': [
        'sine',
        ['channel:3-type:effect-id:0'],
        {someParams: true}
      ]
    },
    channels: [{
      effects: [{id: 0, name: 'pingPongDelay'}],
      id: 3,
      selectedAddEffect: 'pingPongDelay',
      selectedAddSource: 'fm',
      sources: ['sine']
    }]
  })
  t.deepEqual(reducer({
    audioGraph: {
      'channel:0-type:effect-id:0': ['pingPongDelay', 'output']
    },
    channels: [{
      effects: [{id: 0, name: 'pingPongDelay'}],
      id: 0,
      selectedAddEffect: 'pingPongDelay',
      selectedAddSource: 'fm',
      sources: ['sine']
    }]
  }, addAudioGraphSource({
    id,
    instrument,
    params
  })), {
    audioGraph: {
      'channel:0-type:effect-id:0': ['pingPongDelay', 'output'],
      'channel:[]-type:source-id:some id': [
        'some instrument',
        'output',
        {someParams: true}
      ]
    },
    channels: [{
      effects: [{id: 0, name: 'pingPongDelay'}],
      id: 0,
      selectedAddEffect: 'pingPongDelay',
      selectedAddSource: 'fm',
      sources: ['sine']
    }]
  })

  t.deepEqual(reducer({
    audioGraph: {
      'channel:0-type:effect-id:0': ['effect0', 'output'],
      'channel:0-type:effect-id:1': ['effect1', 'channel:0-type:effect-id:0'],
      'channel:0-type:effect-id:2': ['effect2', 'channel:0-type:effect-id:1'],
      'channel:1-type:effect-id:10': ['effect0', 'output'],
      'channel:[0]-type:source-id:0': ['source0', 'channel:0-type:effect-id:2', {a: 5}]
    },
    channels: [
      {
        effects: [
          {id: 0, name: 'effect0'},
          {id: 1, name: 'effect1'},
          {id: 2, name: 'effect2'}
        ],
        id: 0,
        selectedAddEffect: 'pingPongDelay',
        selectedAddSource: 'fm',
        sources: [instrument]
      },
      {
        effects: [
          {id: 10, name: 'effect0'}
        ],
        id: 1,
        selectedAddEffect: 'pingPongDelay',
        selectedAddSource: 'fm',
        sources: ['sine']
      }
    ]
  }, addAudioGraphSource({
    id,
    instrument,
    params
  })), {
    audioGraph: {
      'channel:0-type:effect-id:0': ['effect0', 'output'],
      'channel:0-type:effect-id:1': ['effect1', 'channel:0-type:effect-id:0'],
      'channel:0-type:effect-id:2': ['effect2', 'channel:0-type:effect-id:1'],
      'channel:1-type:effect-id:10': ['effect0', 'output'],
      'channel:[0]-type:source-id:0': ['source0', 'channel:0-type:effect-id:2', {a: 5}],
      'channel:[0]-type:source-id:some id': [instrument, ['channel:0-type:effect-id:2'], params]
    },
    channels: [
      {
        effects: [
          {id: 0, name: 'effect0'},
          {id: 1, name: 'effect1'},
          {id: 2, name: 'effect2'}
        ],
        id: 0,
        selectedAddEffect: 'pingPongDelay',
        selectedAddSource: 'fm',
        sources: [instrument]
      },
      {
        effects: [
          {id: 10, name: 'effect0'}
        ],
        id: 1,
        selectedAddEffect: 'pingPongDelay',
        selectedAddSource: 'fm',
        sources: ['sine']
      }
    ]
  })

  t.deepEqual(reducer({
    audioGraph: {
      'channel:0-type:effect-id:0': ['effect0', 'output'],
      'channel:0-type:effect-id:1': ['effect1', 'channel:0-type:effect-id:0'],
      'channel:0-type:effect-id:2': ['effect2', 'channel:0-type:effect-id:1'],
      'channel:1-type:effect-id:10': ['effect0', 'output'],
      'channel:[0]-type:source-id:0': ['source0', 'channel:0-type:effect-id:2', {a: 5}]
    },
    channels: [
      {
        effects: [
          {id: 0, name: 'effect0'},
          {id: 1, name: 'effect1'},
          {id: 2, name: 'effect2'}
        ],
        id: 0,
        selectedAddEffect: 'pingPongDelay',
        selectedAddSource: 'fm',
        sources: [instrument]
      },
      {
        effects: [
          {id: 10, name: 'effect0'}
        ],
        id: 1,
        selectedAddEffect: 'pingPongDelay',
        selectedAddSource: 'fm',
        sources: [instrument]
      }
    ]
  }, addAudioGraphSource({
    id,
    instrument,
    params
  })), {
    audioGraph: {
      'channel:0-type:effect-id:0': ['effect0', 'output'],
      'channel:0-type:effect-id:1': ['effect1', 'channel:0-type:effect-id:0'],
      'channel:0-type:effect-id:2': ['effect2', 'channel:0-type:effect-id:1'],
      'channel:1-type:effect-id:10': ['effect0', 'output'],
      'channel:[0]-type:source-id:0': ['source0', 'channel:0-type:effect-id:2', {a: 5}],
      'channel:[0 1]-type:source-id:some id': [
        instrument,
        ['channel:0-type:effect-id:2', 'channel:1-type:effect-id:10'],
        params
      ]
    },
    channels: [
      {
        effects: [
          {id: 0, name: 'effect0'},
          {id: 1, name: 'effect1'},
          {id: 2, name: 'effect2'}
        ],
        id: 0,
        selectedAddEffect: 'pingPongDelay',
        selectedAddSource: 'fm',
        sources: [instrument]
      },
      {
        effects: [
          {id: 10, name: 'effect0'}
        ],
        id: 1,
        selectedAddEffect: 'pingPongDelay',
        selectedAddSource: 'fm',
        sources: [instrument]
      }
    ]
  })

  t.end()
})
