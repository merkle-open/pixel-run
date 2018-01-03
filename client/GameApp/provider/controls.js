import $ from "jquery";

function Controls() {
  // class wrapper
}

const keys = [37, 38, 39, 40];
const disableArrowKeys = ev => {
  if (keys.indexOf(ev.keyCode) >= 0) {
    ev.preventDefault();
  }
};

Controls.Arrows = {
  disable() {
    return $(document).keydown(disableArrowKeys);
  },
  enable() {
    return $(document).unbind("keydown", disableArrowKeys);
  }
};

export default Controls;
