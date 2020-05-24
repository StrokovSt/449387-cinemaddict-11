export default class Film {
  constructor(data) {
    this.id = data[`id`];
    this.comments = data[`comments`];
    this.title = data[`film_info`][`title`];
    this.originalTitle = data[`film_info`][`alternative_title`];
    this.rating = data[`film_info`][`total_rating`];
    this.poster = data[`film_info`][`poster`];
    this.ageRating = data[`film_info`][`age_rating`];
    this.director = data[`film_info`][`director`];
    this.writers = data[`film_info`][`writers`];
    this.actors = data[`film_info`][`actors`];
    this.releaseDate = data[`film_info`][`release`][`date`] ? new Date(data[`film_info`][`release`][`date`]) : null;
    this.duration = data[`film_info`][`runtime`];
    this.country = data[`film_info`][`release`][`release_country`];
    this.genre = data[`film_info`][`genre`];
    this.description = data[`film_info`][`description`] || ``;
    this.isInWatchlist = Boolean(data[`user_details`][`watchlist`]);
    this.isWatched = Boolean(data[`user_details`][`already_watched`]);
    this.isFavorite = Boolean(data[`user_details`][`favorite`]);
    this.watchingDate = data[`user_details`][`watching_date`] ? new Date(data[`user_details`][`watching_date`]) : null;
  }

  static parseFilm(data) {
    return new Film(data);
  }

  static parseFilms(data) {
    return data.map(Film.parseCard);
  }

}
