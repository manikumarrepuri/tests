// ** An object for use in Select form Elements.
export const SelectOption = function (name, value) {
  this.name = name;
  this.value = value;

  Object.freeze(this);
};
