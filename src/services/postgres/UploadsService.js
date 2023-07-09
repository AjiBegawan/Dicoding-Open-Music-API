const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');


class UploadsService {
    constructor(folder) {
        this._pool = new Pool();
        this._folder = folder;

        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder, { recursive: true });
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
        const result = await this._pool.query(query);

        if (!result.rows[0].id) {
            throw new InvariantError('Album gagal ditambahkan');
        }

        return result.rows[0].id;
    }
}

module.exports = UploadsService;
