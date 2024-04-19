/*
  Copyright (c) 2023 Contributors to the  Eclipse Foundation.
  This program and the accompanying materials are made
  available under the terms of the Eclipse Public License 2.0
  which is available at https://www.eclipse.org/legal/epl-2.0/
  SPDX-License-Identifier: EPL-2.0

  Contributors: Smart City Jena

*/
import { type Component } from "vue";

export interface CollapseState {
  textSection?: boolean;
  storeSection?: boolean;
}

export interface FillColor {
  backgroundColor: string;
  backgroundGradient: string;
}

export interface ImageGalleryItem {
  id: string;
  url: string;
}

export interface ImageSettings {
  fit: string;
  diashowInterval: number;
}

export interface ItemStyles {
  fill: string;
  stroke: string;
}
export interface GradientPart {
  color: string;
  location: number;
}

export interface ConfigItem {
  fill: string;
  stroke: string;
  strokeWidth: string;
}

export interface Config {
  [className: string]: ConfigItem;
}

export interface StyleFields {
  className: string;
  fill: string;
  stroke: string;
  strokeWidth: string;
}

export interface ObjectFitSetting {
  fit: string;
}

export interface MaterialIcon {
  name: string;
  version?: number;
  popularity?: number;
  codepoint?: number;
  unsupported_families?: string[];
  categories?: string[];
  tags?: string[];
  sizes_px?: number[];
}

export interface IconSharingComponentProps {
  component: {
    currentIcon: string;
    iconColor: string;
    iconSize: number;
    isIconFilled: boolean;
    strokeWeight: number;
    opticSize: number;
    grade: number;
    settings: Component;
  }
}

export interface IconComponentProps {
  initialState?: any;
  currentIcon: string;
  iconColor: string;
  iconSize: number;
  isIconFilled: boolean;
  strokeWeight: number;
  opticSize: number;
  grade: number;
}

export interface ProgressSharingComponentProps {
  component: {
    progress: string;
    fillColor: {
      backgroundColor: string;
      backgroundGradient: string;
    };
    isGradient: boolean;
    isVertical: boolean;
    backgroundColor: string;
    rotation: number;
    storeId: string;
    getState: () => any;
    setState: (state: any) => void;
    settings: Component;
  }
}


export interface ProgressComponentProps {
  initialState?: any;
  progress: string;
  fillColor: {
    backgroundColor: string;
    backgroundGradient: string;
  };
  backgroundColor: string;
  isGradient: boolean;
  isVertical: boolean;
  rotation: number;
}

export interface ImageComponentProps {
  initialState?: any;
  imgSrc: string;
}

export interface ImageSharingComponentProps {
  component: {
    imgSrc: string;
    settings: Component;
    getState: () => any;
    setState: (state: any) => void;
    images: ImageGalleryItem[];
    imageSettings: ImageSettings;
    storeId: string;
  }
}

export interface RepeatableSvgComponentProps {
  initialState?: any;
  src: string;
  activeItemStyles: ItemStyles;
  defaultItemStyles: ItemStyles;
  repeations: string;
  progress: string;
}

export interface RepeatableSvgSharingComponentProps {
  component: {
    src: string;
    activeItemStyles: ItemStyles;
    defaultItemStyles: ItemStyles;
    progress: string;
    repeations: string;
    storeId: string;
    settings: Component;
    getState: () => any;
  }
}

export interface RichTextComponentProps {
  initialState?: any;
  editor: string;
}

export interface RichTextSharingComponentProps {
  component: {
    editor: string;
    getState: () => any;
    storeId: string;
    settings: Component;
  }
}

export interface SvgComponentProps {
  initialState?: any;
  src: string;
  classesConfig: Config;
}

export interface SvgSharingComponentProps {
  component: {
    src: string;
    classesConfig: Config;
    storeId: string;
    settings: Component;
    getState: () => any;
  }
}

export interface TextComponentProps {
  initialState?: any;
  text: string;
  fontSize: number;
  fontColor: string;
  fontWeight: string;
  textDecoration: string;
  horizontalAlign: string;
  verticalAlign: string;
}

export interface TextSharingComponentProps {
  component: {
    text: string;
    fontSize: number;
    fontColor: string;
    fontWeight: string;
    textDecoration: string;
    horizontalAlign: string;
    verticalAlign: string;
    storeId: string;
    settings: Component;
    getState: () => any;
    setState: (state: any) => void;
  }
}

export interface VideoComponentProps {
  initialState?: any;
  videoUrl: string;
}

export interface VideoSharingComponentProps {
  component: {
    videoUrl: string;
    videoSettings: ObjectFitSetting;
    storeId: string;
    settings: Component;
    getState: () => any;
  }
}