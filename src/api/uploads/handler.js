const InvariantError = require('../../exceptions/InvariantError')
const autoBind = require('auto-bind');

class UploadsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postAlbumCoverHandler(request, h) {
    const { cover } = request.payload;
    const { id } = request.params;

    this._validator.validateImageHeaders(cover.hapi.headers);

    const filename = await this._service.writeFile(cover, cover.hapi);
    const fileLocation = `http://${process.env.HOST}:${process.env.PORT}/albums/cover/images/${filename}`
    await this._service.addCoverUrl(id, fileLocation)

    const response = h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah'
    });
    response.code(201);
    return response;
  }


}

module.exports = UploadsHandler;
