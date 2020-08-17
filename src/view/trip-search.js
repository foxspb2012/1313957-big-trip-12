export const createTripSearchTemplate = () => {
  return (
    `<form class="trip-search  trip-search--hidden" action="#" method="post">
      <div class="trip-search__container">
        <label class="trip-search__label" for="search-field">Trip starting point:</label>
        <input class="trip-search__field" id="search-field" type="text" name="search-field" placeholder=" Country, city, district">
      </div>

      <button class="trip-search__btn  btn  btn--big  btn--yellow" type="submit">Start planning</button>
    </form>`
  );
};
