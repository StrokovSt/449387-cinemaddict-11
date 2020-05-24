import Chart from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

import AbstractSmartComponent from "./abstract-smart-component.js";
import {StatisticFilterTypes} from "../const.js";
import {createFilmsDuration, createGenresStatistic, checkFilmForFilter, getWatchedFilmsGenres} from "../utils/statisctic-functions.js";
import {createRank} from "../utils/profile-functions.js";

const BAR_HEIGHT = 50;

const createFilterMarkup = (filter, isChecked) => {
  return (
    `<input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-${filter}" value="${filter}" ${isChecked ? `checked` : ``}>
    <label for="statistic-${filter}" class="statistic__filters-label">${filter}</label>`
  );
};

const renderStatisticsChart = (statisticCtx, statisticOfGenres) => {
  const mostViewedGenres = statisticOfGenres.flat().filter((it) => typeof (it) !== `number`);
  const mostViewedGenresValues = statisticOfGenres.flat().filter((it) => typeof (it) === `number`);
  return new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: mostViewedGenres.slice(0, 5),
      datasets: [{
        data: mostViewedGenresValues.slice(0, 5),
        backgroundColor: [
          `rgba(255, 99, 132, 0.7)`,
          `rgba(54, 162, 235, 0.7)`,
          `rgba(255, 206, 86, 0.7)`,
          `rgba(75, 192, 192, 0.7)`,
          `rgba(153, 102, 255, 0.7)`
        ],
        hoverBackgroundColor: [
          `rgba(255, 99, 132, 0.9)`,
          `rgba(54, 162, 235, 0.9)`,
          `rgba(255, 206, 86, 0.9)`,
          `rgba(75, 192, 192, 0.9)`,
          `rgba(153, 102, 255, 0.9)`
        ],
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20
          },
          color: `#ffffff`,
          anchor: `start`,
          align: `start`,
          offset: 40,
        }
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#ffffff`,
            padding: 100,
            fontSize: 20
          },
          gridLines: {
            display: false,
            drawBorder: false
          }
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false
      }
    }
  });
};

const createStatisticTemplate = (watchedFilms, filteredFilms, statisticOfGenres, currentFilterType) => {
  const filtersMarkup = Object.values(StatisticFilterTypes).map((filter) => {
    return createFilterMarkup(filter, filter === currentFilterType);
  }).join(`\n`);

  const filteredFilmsCount = filteredFilms.length;
  const watchedFilmsDuration = createFilmsDuration(filteredFilms);
  const hours = Math.trunc(watchedFilmsDuration / 60);
  const minutes = watchedFilmsDuration % 60;

  const mostViewedGenresValues = statisticOfGenres.flat().filter((it) => typeof (it) === `number`);
  const favoriteGenre = (mostViewedGenresValues[0] !== mostViewedGenresValues[1]) ? statisticOfGenres[0][0] : ``;
  const userRank = createRank(watchedFilms.length);

  return (
    `<section class="statistic">
      <p class="statistic__rank">
        Your rank
        <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
        <span class="statistic__rank-label">${userRank}</span>
      </p>

      <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
        <p class="statistic__filters-description">Show stats:</p>
        ${filtersMarkup}
      </form>

      <ul class="statistic__text-list">
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">You watched</h4>
          <p class="statistic__item-text">${filteredFilmsCount}<span class="statistic__item-description">movies</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Total duration</h4>
          <p class="statistic__item-text">${hours}<span class="statistic__item-description">h</span>${minutes}<span class="statistic__item-description">m</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Top genre</h4>
          <p class="statistic__item-text">${statisticOfGenres.length > 0 ? favoriteGenre : ``}</p>
        </li>
      </ul>

      <div class="statistic__chart-wrap">
        <canvas class="statistic__chart" width="1000"></canvas>
      </div>

    </section>`
  );
};

export default class Statistic extends AbstractSmartComponent {
  constructor(filmModel) {
    super();

    this._filmModel = filmModel;
    this._watchedFilms = null;
    this._filteredFilms = null;
    this._statisticOfGenres = null;

    this._currentFilterType = StatisticFilterTypes.ALL_TIME;
  }

  getTemplate() {
    this._determineVariebles();
    return createStatisticTemplate(this._watchedFilms, this._filteredFilms, this._statisticOfGenres, this._currentFilterType);
  }

  show() {
    super.show();
    this._currentFilterType = StatisticFilterTypes.ALL_TIME;
    this.rerender();
    this._renderCharts();
  }

  recoveryListeners() {
    this._setActiveFilter();
  }

  _determineVariebles() {
    this._watchedFilms = this._filmModel.getWatchedFilms();
    this._filteredFilms = this._watchedFilms.filter((film) => checkFilmForFilter(film, this._currentFilterType));

    const filmGenres = getWatchedFilmsGenres(this._filteredFilms);
    this._statisticOfGenres = createGenresStatistic(filmGenres);
  }

  _renderCharts() {
    const statisticsCtx = this.getElement().querySelector(`.statistic__chart`);
    statisticsCtx.height = BAR_HEIGHT * this._statisticOfGenres.slice(0, 5).length;
    this._resetCharts();
    this._statisticsChart = renderStatisticsChart(statisticsCtx, this._statisticOfGenres);
  }

  _resetCharts() {
    if (this._statisticsChart) {
      this._statisticsChart.destroy();
      this._statisticsChart = null;
    }
  }

  _setActiveFilter() {
    this.getElement().querySelector(`.statistic__filters`).addEventListener(`click`, (evt) => {
      if (evt.target.tagName !== `INPUT`) {
        return;
      }
      this._currentFilterType = evt.target.value;
      this.rerender();
      this._renderCharts();
    });
  }
}
