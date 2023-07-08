const mapDBToModelAlbums = ({
  id,
  name,
  year,
  cover_url,
  title,
}) => ({
  id,
  name,
  year,
  coverUrl: cover_url,
  songs: { title },
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
