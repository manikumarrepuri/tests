// ** An Object for use in the Tabs Component.
export const Tab = function (label, content) {
  this.label = label;
  this.content = content;

  Object.freeze(this);
};
