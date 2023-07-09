const InvariantError = require('../../exceptions/InvariantError')
const autoBind = require('auto-bind');

class AlbumsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postAlbumHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);
    const { name, year } = request.payload;

    const albumId = await this._service.addAlbum({ name, year, cover_url: null });

    const response = h.response({
      status: 'success',
      message: 'Album berhasil ditambahkan',
      data: { albumId },
    });

    response.code(201);
    return response;
  };

  async getAlbumsHandler() {
    const albums = await this._service.getAlbums();
    return {
      status: 'success',
      data: { albums },
    };
  }

  async getAlbumByIdHandler(request, h) {
    const { id } = request.params;
    const album = await this._service.getAlbumById(id);

    return {
      status: 'success',
      data: {
        album,
      },
    };

  }

  async putAlbumByIdHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);
    const { id } = request.params;

    await this._service.editAlbumById(id, request.payload);

    return {
      status: 'success',
      message: 'Album berhasil diperbarui',
    };

  }

  async deleteAlbumByIdHandler(request, h) {
    const { id } = request.params;
    await this._service.deleteAlbumById(id);
    return {
      status: 'success',
      message: 'Lagu berhasil dihapus',
    };

  }

  async postLikeAlbumHandler(request, h) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    if (await this._service.isAlbumLiked(id, credentialId)) {
      throw new InvariantError('You have liked this album before');
    }

    await this._service.likeAlbum(id, credentialId);

    return h.response({
      status: 'success',
      message: 'Album successfully liked.',
    }).code(201);
  }

  async deleteLikeAlbumHandler(request, h) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    if (!(await this._service.isAlbumLiked(id, credentialId))) {
      throw new InvariantError('You have not liked this album before');
    }

    await this._service.unlikeAlbum(id, credentialId);

    return h.response({
      status: 'success',
      message: 'Album successfully unliked.',
    });
  }

  async getAlbumLikesHandler(request, h) {
    const { id } = request.params;
    const [likes, cache] = await this._service.getAlbumLikes(id);

    const res = h.response({
      status: 'success',
      data: { likes },
    });

    if (cache) {
      res.header('X-Data-Source', 'cache');
    }

    return res;
  }
}

module.exports = AlbumsHandler;
