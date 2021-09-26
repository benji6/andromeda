import { removeInstrumentFromChannel } from "../../actions";

let selectedAddEffect = null;
let selectedAddSource = null;

const connectComponent = connect(
  (
    { dispatch, plugins: { channels, effectInstances, instrumentInstances } },
    { params }
  ) => ({
    channelId: Number(params.channelId),
    channels,
    dispatch,
    effectInstances,
    instrumentInstances,
  })
);

export default connectComponent(
  ({ channelId, channels, dispatch, effectInstances, instrumentInstances }) => {
    const sources = channels[channelId].instruments;
    const effects = channels[channelId].effects;
    const addSources = difference(pluck("name", instrumentInstances), sources);
    const addEffects = difference(pluck("name", effectInstances), effects);
    selectedAddSource = addSources[0];
    selectedAddEffect = addEffects[0];

    return createElement(
      "div",
      { className: "Channel" },
      createElement("h1", null, `Channel ${channelId}`),
      createElement("h2", null, "Effects"),
      effects.map((name, i) =>
        createElement(
          "div",
          { key: i },
          createElement(
            ButtonPrimary,
            { to: `/plugins/effects/${name}` },
            name
          ),
          createElement(Cross, {
            onClick: () =>
              dispatch(
                removeEffectFromChannel({
                  channel: channelId,
                  name,
                })
              ),
          })
        )
      ),
      Boolean(addEffects.length) && createElement("p", null, "Add effect"),
      Boolean(addEffects.length) &&
        createElement(
          "div",
          null,
          createElement(InputSelect, {
            onChange: (e) => (selectedAddEffect = e.target.value),
            options: addEffects.map((text) => ({ text, value: text })),
            value: selectedAddEffect,
          }),
          createElement(Plus, {
            onClick: () =>
              dispatch(
                addEffectToChannel({
                  channel: channelId,
                  name: selectedAddEffect,
                })
              ),
          })
        ),
      createElement("h2", null, "Sources"),
      createElement(
        "div",
        { className: "Channel__Sources" },
        sources.map((name) =>
          createElement(
            "div",
            { key: name },
            createElement(
              ButtonPrimary,
              { small: true, to: `/plugins/instruments/${name}` },
              name
            ),
            createElement(Cross, {
              onClick: () =>
                dispatch(
                  removeInstrumentFromChannel({
                    channel: channelId,
                    name,
                  })
                ),
            })
          )
        )
      ),
      Boolean(addSources.length) && createElement("p", null, "Add source"),
      Boolean(addSources.length) &&
        createElement(
          "div",
          null,
          createElement(InputSelect, {
            onChange: (e) => (selectedAddSource = e.target.value),
            options: addSources.map((text) => ({ text, value: text })),
            value: selectedAddSource,
          }),
          createElement(Plus, {
            onClick: () => {
              dispatch(
                addInstrumentToChannel({
                  channel: channelId,
                  name: selectedAddSource,
                })
              );
              selectedAddSource = addSources[1];
            },
          })
        )
    );
  }
);
