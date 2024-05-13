/*
  Copyright (c) 2023 Contributors to the  Eclipse Foundation.
  This program and the accompanying materials are made
  available under the terms of the Eclipse Public License 2.0
  which is available at https://www.eclipse.org/legal/epl-2.0/
  SPDX-License-Identifier: EPL-2.0

  Contributors: Smart City Jena

*/
export interface CollapseState {
  widgetSection?: boolean;
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
