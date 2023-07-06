const mapDBToModelAlbums = ({
  id,
  name,
  year,
}) => ({
  id,
  name,
  year,
});

const mapDBToModelSong = ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  albumId,
}) => ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  albumId,
});

const mapSong = ({
  song_id,
  song_title,
  performer,
}) => ({
  id: song_id,
  title: song_title,
  performer,
});

const mapPlaylist = ({
  id,
  name,
  username,
}) => ({
  id,
  name,
  username,
});

module.exports = { mapDBToModelAlbums, mapDBToModelSong, mapSong, mapPlaylist };
