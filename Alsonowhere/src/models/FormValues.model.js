// ** The form values should be stored in an Object instance that represents the current
// ** form values at all times and can be relied upon to be the same Object whenever
// ** it is referenced.
export const FormValues = function ({ keywords, location, distance } = {}) {
  this.keywords = keywords ?? "";
  this.location = location ?? "";
  this.distance = distance ?? "";

  Object.seal(this);
};
