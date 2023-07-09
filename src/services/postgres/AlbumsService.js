const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { mapDBToModelAlbums } = require('../../utils');

class AlbumsService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;

  }

  async addAlbum({ name, year, cover_url }) {
    const id = `album-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3, $4) RETURNING id',
      values: [id, name, year, cover_url],
    };
    console.log(query.values);
    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Album gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getAlbums() {
    const result = await this._pool.query('SELECT id, name, year FROM albums');
    return result.rows;
  }

  async getAlbumById(id) {
    const queryAlbums = {
      text: `SELECT * FROM albums WHERE id = $1`,
      values: [id],
    };
    const resultAlbums = await this._pool.query(queryAlbums);

    const querySongs = {
      text: `SELECT songs.title, songs.performer, songs.genre
      FROM albums
      LEFT JOIN songs ON albums.id = songs.album_id
      WHERE albums.id = $1`,
      values: [id],
    };
    const resultSongs = await this._pool.query(querySongs);

    if (!resultAlbums.rows.length) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    const resultAlbumsMap = resultAlbums.rows.map(mapDBToModelAlbums)[0]

    if (resultSongs.rows[0].title != null) {
      const detailAlbums = {
        ...resultAlbumsMap,
        songs: resultSongs.rows,
      }
      return detailAlbums;
    }
    else {
      const detailAlbums = {
        ...resultAlbumsMap,
        songs: [],
      }
      return detailAlbums;
    }
  }

  async editAlbumById(id, { name, year }) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id',
      values: [name, year, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan');
    }
  }

  async isAlbumLiked(id, userId) {
    await this.getAlbumById(id);

    const result = await this._pool.query({
      text: 'SELECT id FROM album_likers WHERE album_id = $1 AND user_id = $2',
      values: [id, userId],
    });
    return !!result.rowCount;
  }


  async likeAlbum(albumId, userId) {
    const id = `album-likers-${nanoid(16)}`;

    const result = await this._pool.query({
      text: `INSERT INTO album_likers (id, album_id, user_id)
        VALUES ($1, $2, $3) RETURNING id`,
      values: [id, albumId, userId],
    });

    if (!result.rowCount) {
      throw new NotFoundError('Album not found');
    }

    await this._cacheService.delete(`album-likes:${albumId}`);
    return result.rows[0].id;
  }


  async unlikeAlbum(id, userId) {
    const result = await this._pool.query({
      text: 'DELETE FROM album_likers WHERE album_id = $1 AND user_id = $2 RETURNING id',
      values: [id, userId],
    });

    if (!result.rowCount) {
      throw new NotFoundError('Album not found');
    }

    await this._cacheService.delete(`album-likes:${id}`);
  }


  async getAlbumLikes(id) {
    await this.getAlbumById(id);
    try {
      const result = await this._cacheService.get(`album-likes:${id}`);
      return [parseInt(result, 10), true];
    } catch (error) {
      const result = await this._pool.query({
        text: 'SELECT id FROM album_likers WHERE album_id = $1',
        values: [id],
      });

      await this._cacheService.set(`album-likes:${id}`, result.rowCount);
      return [result.rowCount, false];
    }
  }
}

module.exports = AlbumsService;
