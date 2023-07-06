exports.up = (pgm) => {
    pgm.createTable('playlists', {
        id: {
            type: 'VARCHAR(25)',
            primaryKey: true,
        },
        name: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        owner: {
            type: 'VARCHAR(21)',
            notNull: true,
            references: '"users"',
            onDelete: 'cascade',
        },
    });
};

exports.down = (pgm) => {
    pgm.dropTable('playlists');
};
