// Gets the json data
let fetchTours = fetch("/sample_data.json")
  .then(res => res.json())
  .then(json_data => {
    //Counts the # of tours
    tour_header.getElementsByClassName("tours_found")[0].innerHTML =
      "<strong>" + json_data.results.length + " tours</strong> found";

    //Loops through and creates each tour
    for (let i = 0; i < json_data.results.length; i++) {
      //Copies the tour container element so that new tours can be generated
      let tour = tour_container
        .getElementsByClassName("tour")[0]
        .cloneNode(true);

      //Sets image source
      tour
        .getElementsByClassName("tour_image")[0]
        .setAttribute("src", json_data.results[i].image);

      //Sets logo alt attribute
      tour
        .getElementsByClassName("tour_logo")[0]
        .setAttribute("alt", json_data.results[i].operator[0].name);

      //Sets logo source
      tour
        .getElementsByClassName("tour_logo")[0]
        .setAttribute("src", json_data.results[i].operator[0].logo);

      //Sets tour name
      tour.getElementsByClassName("tour_name")[0].innerHTML =
        json_data.results[i].tour_name;

      //Sets stars
      let rating = json_data.results[i].rating;
      while (rating > 0) {
        if (rating > 0.5) {
          //Add 1 star
          tour.getElementsByClassName("rating")[0].innerHTML +=
            '<img src="/images/star.svg" width="17px" />';
          rating--;
        } else if (rating === 0.5) {
          //Add 0.5 star
          tour.getElementsByClassName("rating")[0].innerHTML +=
            '<img src="/images/star-half.svg" width="17px" />';
          rating = 0;
        }
      }

      //Sets tour dates - uses moment.js to convert the dates
      tour.getElementsByClassName("tour_dates")[0].innerHTML +=
        moment(json_data.results[i].date_start).format("DD MMM Y") +
        " - " +
        moment(json_data.results[i].date_end).format("DD MMM Y");

      //Sets tour duration
      tour.getElementsByClassName("tour_duration")[0].innerHTML +=
        json_data.results[i].duration + " Days";

      //Collects tour itinerary
      let itinerary = "<span>";
      let itinerary_remaining = "";
      let itinerary_remaining_count = null;

      for (let t = 0; t < json_data.results[i].itinerary.length; t++) {
        //Hides remaining itinerary if over character limit
        if (itinerary.length + json_data.results[i].itinerary[t].length > 72) {
          itinerary_remaining_count = json_data.results[i].itinerary.length - t;

          //Stores the remaining itinerary
          while (t < json_data.results[i].itinerary.length) {
            itinerary_remaining += ", " + json_data.results[i].itinerary[t];
            t++;
          }
          break;
        } else if (t != 0) {
          itinerary += ", ";
        }
        itinerary += json_data.results[i].itinerary[t];
      }

      //Stores the number of hidden itinerary and closes the span tag
      if (itinerary_remaining_count > 0) {
        tour.getElementsByClassName("tour_itinerary")[0].innerHTML +=
          itinerary +
          "... <a> +" +
          itinerary_remaining_count +
          " more</a></span>";
      } else {
        tour.getElementsByClassName("tour_itinerary")[0].innerHTML +=
          itinerary + "</span>";
      }

      //Adds an event listener when clicking the link to reveal the remaining itinerary
      //The function replaces the itinerary list with a complete list
      tour
        .getElementsByClassName("tour_itinerary")[0]
        .addEventListener("click", () => {
          tour.getElementsByClassName(
            "tour_itinerary"
          )[0].children[1].innerHTML =
            itinerary + itinerary_remaining + "</span>";
        });

      //Sets price with commas for thousand separators
      //? This regex can add commas for numbers with > 3 decimal places but this will be ok for prices
      tour.getElementsByClassName("price")[0].innerHTML = json_data.results[
        i
      ].price
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

      //Adds the tour to the tour container
      tour_container.appendChild(tour);
    }
    //Removes the first tour element after all tours have been added
    tour_container.getElementsByClassName("tour")[0].remove();
  })
  .catch(error => console.error(error));
