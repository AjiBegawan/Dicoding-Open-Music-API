exports.up = (pgm) => {
    pgm.createTable('users', {
        id: {
            type: 'VARCHAR(21)',
            primaryKey: true,
        },
        username: {
            type: 'VARCHAR(50)',
            unique: true,
            notNull: true,
        },
        password: {
            type: 'VARCHAR(255)',
            notNull: true,
        },
        fullname: {
            type: 'VARCHAR(255)',
            notNull: true,
        },
    });
};

exports.down = (pgm) => {
    pgm.dropTable('users');
};
