exports.up = (pgm) => {
    pgm.createTable('playlist_songs', {
        id: {
            type: 'VARCHAR(16)',
            primaryKey: true,
        },
        playlist_id: {
            type: 'VARCHAR(25)',
            notNull: true,
            references: 'playlists(id)',
            onDelete: 'cascade',
        },
        song_id: {
            type: 'VARCHAR(21)',
            notNull: true,
            references: 'songs(id)',
            onDelete: 'cascade',
        },
    });
};

exports.down = (pgm) => {
    pgm.dropTable('playlist_songs');
};
