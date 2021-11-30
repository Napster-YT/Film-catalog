'use strict'

import filmTitle from "../templates/film-homepage-title.hbs";
import filmTrailer from "../templates/film-trailer.hbs";
import similarFilms from "../templates/similarFilms.hbs";

const MOVIE_API = "https://api.themoviedb.org/3/movie/";
const API_KEY = "170b9b9397b0574b7d603cba918ea1f4";

const filmTitleSection = document.querySelector(".film-title");
const filmTrailerSection = document.querySelector(".film-trailer");
const similarFilmsSection = document.querySelector(".similar-films-list");

const params = new URLSearchParams(window.location.search);
let id = params.get('id');

sessionStorage.removeItem("page");

fetch(`${MOVIE_API}${id}?api_key=${API_KEY}&language=en-US`)
  .then(res => res.json())
  .then(result => {
    if (!result.poster_path) {
      result.poster_path = "https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-38-picture-grey-c2ebdbb057f2a7614185931650f8cee23fa137b93812ccb132b9df511df1cfac.svg";
      result.posterClass = "noposter";
    } else {
      result.poster_path = `https://image.tmdb.org/t/p/w400${result.poster_path}`;
      result.posterClass = "";
    }

    if (!result.release_date) {
      result.release_year = "NB";
    } else {
      result.release_year = new Date(result.release_date).getFullYear();
    }

    const markup = filmTitle(result);
    filmTitleSection.innerHTML = markup;
  })
  .catch(error => console.error(error));

fetch(`${MOVIE_API}${id}/videos?api_key=${API_KEY}&language=en-US`)
  .then(res => res.json())
  .then(result => {
    const trailers = result.results.filter(film => film.type === "Trailer");
    const teasers = result.results.filter(film => film.type === "Teaser");
    const trailer = trailers.length > 0 ? trailers[0] : teasers.length > 0 ? teasers[0] : null;
    if (trailer) {
      const trailerMarkup = filmTrailer(trailer);
      filmTrailerSection.innerHTML = trailerMarkup;
    }
  })
  .catch(error => console.error(error));

fetch(`${MOVIE_API}${id}/similar?api_key=${API_KEY}&language=en-US`)
  .then(res => res.json())
  .then(result => {
    if (result.results) {
      result.results.length = 6;
    };
    result.results.forEach(res => {
      res.vote_average = Math.round((res.vote_average + Number.EPSILON) * 100) / 100;
    })
    const similarFilmMarkup = similarFilms(result.results);
    similarFilmsSection.innerHTML = similarFilmMarkup;
  })