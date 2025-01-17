import Clutter from "gi://Clutter?version=13";
import GObject from "gi://GObject?version=2.0";
import St from "gi://St?version=13";

import { Theme } from "../../types/theme.js";

const ROW_HEIGHT = 36;
const MAX_BUTTONS_PER_ROW = 4;

export interface ButtonBarParams extends Omit<
  St.Widget.ConstructorProperties,
  "height"
> {
  /**
   * The container width. Should be a multiple of {@link MAX_BUTTONS_PER_ROW}.
   */
  width: number;

  /**
   * The reference height for a single button row. The container will grow
   * automatically to a multiple of this height as new rows are created.
   */
  height?: number;
}

export interface ThemedButtonBarParams extends ButtonBarParams {
  theme: Theme;
}

export interface StyledButtonBarParams extends ButtonBarParams {
  style_class: string;
}

/**
 * A styled container for {@link St.Button} elements.
 */
export default GObject.registerClass({
  GTypeName: "GTileOverlayButtonBar"
}, class extends St.Widget {
  #rowHeight: number;

  /**
   * @returns A generic button container with the default style.
   */
  static new_themed({ theme, ...params }: ThemedButtonBarParams) {
    return this.new_styled({ ...params, style_class: `${theme}__button-bar` });
  }

  /**
   * @returns A button container with a customized style.
   */
  static new_styled(params: StyledButtonBarParams) {
    return new this(params);
  }

  private constructor({
    height = ROW_HEIGHT,
    ...params
  }: St.Widget.ConstructorProperties) {
    super({
      reactive: true,
      can_focus: true,
      track_hover: true,
      height,
      layout_manager: new Clutter.GridLayout({ column_homogeneous: true }),
      ...params,
    });

    this.#rowHeight = height ?? ROW_HEIGHT;
  }

  /**
   * The reference height for a single button row. The container will grow
   * automatically to a multiple of this height as new rows are created.
   */
  set height(height: number) {
    this.#rowHeight = height;
    const rows = Math.ceil(this.get_n_children() / MAX_BUTTONS_PER_ROW);

    super.height = Math.max(rows, 1) * height;
  }

  /**
   * Places a button in the container. New buttons are placed from left to right
   * unless a column exceeds {@link MAX_BUTTONS_PER_ROW}, which causes the
   * button to be placed in a new row and the container to grow in height.
   *
   * @param button The button to be added.
   */
  addButton(button: St.Button) {
    const n = this.get_n_children();
    const col = n % MAX_BUTTONS_PER_ROW;
    const row = Math.floor(n / MAX_BUTTONS_PER_ROW);

    this.#layout.attach(button, col, row, 1, 1);
    this.height = this.#rowHeight;
  }

  /**
   * Destroys all buttons that were added to the container thus far.
   */
  removeButtons() {
    this.destroy_all_children();
    this.height = this.#rowHeight;
  }

  get #layout() {
    return this.layout_manager as Clutter.GridLayout;
  }
})
