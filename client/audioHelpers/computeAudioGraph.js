import {map, zipObj} from 'ramda';
import createEffectCustomNodeParams from './createEffectCustomNodeParams';
import createInstrumentCustomNodeParams from './createInstrumentCustomNodeParams';
import {mapIndexed} from '../tools/indexedIterators';

export default ({arpeggiator,
                 effects,
                 id,
                 instrument,
                 modulation,
                 pitch,
                 rootNote,
                 sources,
                 startTime,
                 stopTime}) => {
  const effectsLength = effects ? effects.length : 0;
  const effectCustomNodeParams = effects ? mapIndexed(createEffectCustomNodeParams,
                                                      effects) : {}
  const sourceCustomNodeParams = map(createInstrumentCustomNodeParams({arpeggiator,
                                                                       effectsLength,
                                                                       modulation,
                                                                       pitch: pitch + rootNote,
                                                                       rootNote,
                                                                       startTime,
                                                                       stopTime}),
                                     sources)

  // assign ids based on index in this array
  const customNodeParams = [...effectCustomNodeParams,
                            ...sourceCustomNodeParams];
  const newKeys = mapIndexed((_, i) => `${id}-${instrument}-${pitch}-${i}`,
                             customNodeParams);

  // ids of newAudioGraphChunk should also contain controller
  // (ie control pad / pattern-editor etc)
  return zipObj(newKeys,
                map(([name, output, ...rest]) => newKeys[output] ?
                  [name, newKeys[output], ...rest] :
                  [name, output, ...rest],
                    customNodeParams));
};
