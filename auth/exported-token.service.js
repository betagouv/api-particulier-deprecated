module.exports = function ExportedTokenService (options) {
  this.initialize = function () {
    return Promise.resolve(this)
  }
  this.getToken = function (req) {
    const id = req.get('X-User-Id')
    const name = req.get('X-User-Name')
    let scopes = req.get('X-User-Scopes')
    if (scopes) scopes = scopes.split(' ')

    if (!(id && name && scopes)) return Promise.resolve(null)

    return Promise.resolve({
      _id: id,
      name,
      scopes
    })
  }
}
