const getTripCost = (trips) => trips.reduce((accumulator, currentValue) =>
  accumulator + currentValue.price + currentValue.offers.reduce((acc, curValue) => acc + curValue.price, 0), 0);

export const createTripCostTemplate = (trips) => {
  const cost = getTripCost(trips);

  return (
    `<p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${cost}</span>
    </p>`
  );
};
