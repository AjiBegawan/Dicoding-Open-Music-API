exports.up = (pgm) => {
    pgm.createTable('album_likers', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        user_id: {
            type: 'VARCHAR(21)',
            notNull: true,
            references: 'users(id)',
            onDelete: 'cascade',
        },
        album_id: {
            type: 'VARCHAR(50)',
            notNull: true,
            references: 'albums(id)',
            onDelete: 'cascade',
        },
    });
};

exports.down = (pgm) => {
    pgm.dropTable('album_likers');
};
