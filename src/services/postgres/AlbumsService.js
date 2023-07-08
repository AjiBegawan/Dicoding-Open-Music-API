const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { mapDBToModelAlbums } = require('../../utils');

class AlbumsService {
  constructor(folder, cacheService) {
    this._pool = new Pool();
    this._folder = folder;
    this._cacheService = cacheService;

    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }
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
    const query = {
      text: `SELECT albums.id, albums.name, albums.year, albums.cover_url, songs.title FROM albums 
      LEFT JOIN songs ON albums.id = songs.album_id
      WHERE albums.id = $1`,
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    return result.rows.map(mapDBToModelAlbums)[0];
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

  writeFile(file, meta) {
    const filename = `${Date.now()}_${meta.filename}`;
    const filePath = path.resolve(this._folder, filename);
    const fileStream = fs.createWriteStream(filePath);

    return new Promise((resolve, reject) => {
      fileStream.on('error', reject);
      file.pipe(fileStream);
      file.on('end', () => resolve(
        // `${process.env.APP_URL}/files/${filename}`,
        `${filename}`,
      ));
    });
  }

  async addCoverUrl(id, cover_url) {
    console.log(cover_url);
    const query = {
      text: 'UPDATE albums SET cover_url = $2 WHERE id = $1 RETURNING id',
      values: [id, cover_url],
    };
    // console.log(query.values);
    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Album gagal ditambahkan');
    }

    return result.rows[0].id;
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
