exports.up = (pgm) => {
    pgm.createTable('playlist_song_activities', {
        id: {
            type: 'VARCHAR(50)',
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
            references: 'songs(id)',
            onDelete: 'set null',
            default: null,
        },
        user_id: {
            type: 'VARCHAR(21)',
            references: 'users(id)',
            onDelete: 'set null',
            default: null,
        },
        action: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        time: {
            type: 'TIMESTAMPTZ',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
    });
};

exports.down = (pgm) => {
    pgm.dropTable('playlist_song_activities');
};
