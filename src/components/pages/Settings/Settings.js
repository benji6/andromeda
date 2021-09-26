import capitalize from "capitalize";
import { compose } from "ramda";
import { createElement } from "react";
import ButtonPrimary from "../../atoms/ButtonPrimary";
import RangeLabelled from "../../molecules/RangeLabelled";
import noteNameFromPitch from "../../../audioHelpers/noteNameFromPitch";
import Selector from "../../molecules/Selector";
import scales from "../../../constants/scales";
import { makeClassName, eventValuePath } from "../../../utils/dom";

export default ({
  bpm,
  bpmSet,
  lastDirection,
  rootNote,
  rootNoteSet,
  selectedScale,
  selectedScaleSet,
}) =>
  createElement(
    "div",
    {
      className: makeClassName(
        "Settings",
        lastDirection === "left" ? "slide-in-left" : "slide-in-right"
      ),
    },
    createElement(
      RangeLabelled,
      {
        max: 512,
        min: 32,
        onChange: compose(bpmSet, Number, eventValuePath),
        value: bpm,
      },
      "BPM"
    ),
    createElement(
      RangeLabelled,
      {
        max: 24,
        min: -36,
        onChange: compose(rootNoteSet, Number, eventValuePath),
        output: noteNameFromPitch(rootNote),
        value: rootNote,
      },
      "Root Note"
    ),
    createElement(Selector, {
      defaultValue: selectedScale,
      handleChange: compose(selectedScaleSet, eventValuePath),
      label: "Scale",
      options: Object.keys(scales).map((value) => ({
        text: capitalize.words(value),
        value,
      })),
    }),
    createElement(
      "div",
      null,
      createElement(
        ButtonPrimary,
        { to: "/controllers/keyboard/settings" },
        "Keyboard Settings"
      )
    )
  );
