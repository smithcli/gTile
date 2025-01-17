import GObject from "gi://GObject?version=2.0";
import St from "gi://St?version=13";

import { Theme } from "../../types/theme.js";

export interface ButtonParams extends St.Button.ConstructorProperties {
  active?: boolean;
}

export interface ThemedButtonParams extends ButtonParams {
  theme: Theme;
}

export interface StyledButtonParams extends ButtonParams {
  style_class: string;
}

/**
 * A simple styled text button that has the notion of an `active` state.
 */
export default GObject.registerClass({
  GTypeName: "GTileOverlayTextButton",
  Properties: {
    "active": GObject.ParamSpec.boolean(
      "active",
      "Active",
      "Whether the button state is active",
      GObject.ParamFlags.READWRITE,
      false,
    ),
  }
}, class extends St.Button {
  #active!: boolean;

  /**
   * @returns A generic text button with the default style.
   */
  static new_themed({ theme, ...params }: ThemedButtonParams) {
    return this.new_styled({
      ...params,
      style_class: `${theme}__preset-button`,
    });
  }

  /**
   * @returns A generic text button with a customized style.
   */
  static new_styled(params: StyledButtonParams) {
    return new this(params);
  }

  protected constructor({ active = false, ...params }: ButtonParams) {
    super({
      reactive: true,
      can_focus: true,
      track_hover: true,
      ...params,
    });

    this.active = active;
  }

  /**
   * Whether the button state is considered active.
   */
  set active(b: boolean) {
    this.#active = b;
    this.#updateState();
    this.notify("active");
  }

  get active(): boolean {
    return this.#active;
  }

  #updateState() {
    if (this.#active) {
      this.add_style_pseudo_class("activate");
    } else {
      this.remove_style_pseudo_class("activate");
    }
  }
});
