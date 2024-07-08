/*
  Copyright (c) 2023 Contributors to the  Eclipse Foundation.
  This program and the accompanying materials are made
  available under the terms of the Eclipse Public License 2.0
  which is available at https://www.eclipse.org/legal/epl-2.0/
  SPDX-License-Identifier: EPL-2.0

  Contributors: Smart City Jena

*/
import ImageWidget from "@/components/Widgets/Image/ImageWidget.vue";
import TextWidget from "@/components/Widgets/Text/TextWidget.vue";
import SvgWidget from "@/components/Widgets/Svg/SvgWidget.vue";
import RepeatableSvgWidget from "@/components/Widgets/RepeatableSvg/RepeatableSvgWidget.vue";
import ProgressWidget from "@/components/Widgets/Progress/ProgressWidget.vue";
import VideoWidget from "@/components/Widgets/Video/VideoWidget.vue";
import IconWidget from "@/components/Widgets/Icon/IconWidget.vue";
import RichTextWidget from "@/components/Widgets/RichText/RichTextWidget.vue";
import TableWidget from "@/components/Widgets/Table/TableWidget.vue";
import PivotTableWidget from "@/components/Widgets/PivotTable/PivotTableWidget.vue";
import SwitchControl from "@/components/Controls/Switch/SwitchControl.vue";
import SelectControl from "@/components/Controls/Select/SelectControl.vue";
import DateControl from "@/components/Controls/DateInput/DateControl.vue";
import TimeControl from "@/components/Controls/TimeInput/TimeControl.vue";
import ColorControl from "@/components/Controls/ColorInput/ColorControl.vue";
import ButtonControl from "@/components/Controls/Button/ButtonControl.vue";
import InputControl from "@/components/Controls/Input/InputControl.vue";

export const enabledWidgets = {
    // Widgets
    ImageWidget,
    TextWidget,
    SvgWidget,
    RepeatableSvgWidget,
    ProgressWidget,
    VideoWidget,
    IconWidget,
    RichTextWidget,
    TableWidget,
    PivotTableWidget,
    // Controls
    SwitchControl,
    SelectControl,
    DateControl,
    TimeControl,
    ColorControl,
    ButtonControl,
    InputControl,
};

export const widgetNames = [
    // Widgets
    { name: "ImageWidget", label: "Image Widget" },
    { name: "TextWidget", label: "Text Widget" },
    { name: "SvgWidget", label: "SVG Widget" },
    { name: "RepeatableSvgWidget", label: "Repeatable SVG Widget" },
    { name: "ProgressWidget", label: "Progress Widget" },
    { name: "VideoWidget", label: "Video Widget" },
    { name: "IconWidget", label: "Icon Widget" },
    { name: "RichTextWidget", label: "Rich Text Widget" },
    { name: "TableWidget", label: "Table Widget" },
    { name: "PivotTableWidget", label: "Pivot Table Widget" },
    // Controls
    { name: "SwitchControl", label: "Switch Control" },
    { name: "SelectControl", label: "Select Control" },
    { name: "DateControl", label: "Date Control" },
    { name: "TimeControl", label: "Time Control" },
    { name: "ColorControl", label: "Color Control" },
    { name: "ButtonControl", label: "Button Control" },
    { name: "InputControl", label: "Input Control" },
];

// TODO: move settings components def here
// export const settingsComponents = {
//  ImageWidget: ImageWidgetSettings,
// }
