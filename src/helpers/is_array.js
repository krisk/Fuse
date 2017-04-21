module.exports = (obj) => {
  return Object.prototype.toString.call(obj) === '[object Array]'
}