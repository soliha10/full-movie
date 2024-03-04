// GLOBAL VARIABLES

const genres = [];

const bookmarkMovies = JSON.parse(window.localStorage.getItem("bookmarkmovie")) || [];


const elSearchForm = document.querySelector(".js-search-movie");
const elSearchInput = elSearchForm.querySelector(".js-search-movie-title");
const elSelectGenres = elSearchForm.querySelector(".js-movie-genres");
const elMovieMinYearInput = elSearchForm.querySelector(".js-min-year");
const elMovieMaxYearInput = elSearchForm.querySelector(".js-max-year");
const elSelectSortMovie = elSearchForm.querySelector(".js-movie-sort");
const elBookedMoviesCountBadge = document.querySelector(".js-booked-movies-count");

// console.log(elSearchForm, elSearchInput, elSelectGenres, elMovieMaxYearInput,elMovieMinYearInput, elSelectSortMovie, elBookedMoviesCountBadge);

// check bookmark array func

function checkBookmarkArrayCount() {
  if (!bookmarkMovies.length) {
    elBookedMoviesCountBadge.classList.add("d-none");
  } else {
    elBookedMoviesCountBadge.classList.remove("d-none");
    elBookedMoviesCountBadge.textContent = bookmarkMovies.length;
  }
}

// movies list elements

const elMovieList = document.querySelector(".js-movie-list");
const elMovieAlert = document.querySelector(".js-not-found-movie");
const elMovieItemTemplate = document.querySelector(".js-movie-item-template").content;
const elBookmarkedList = document.querySelector(".js-bookamrked-template").content;

// console.log(elMovieList, elMovieAlert,elMovieItemTemplate, elBookmarkedList );

// MODAL ELEMENTS 

const elModal = document.querySelector(".modal");
const elModalTitle = elModal.querySelector(".movie-modal__title");
const elModalIframe = elModal.querySelector(".movie-modal__iframe");
const elModalImDbRating = elModal.querySelector(".movie-modal__list-rating");
const elModalMovieYear = elModal.querySelector(".movie-modal__list-year");
const elModalRuntime = elModal.querySelector(".movie-modal__list-runtime");
const elModalCtegories = elModal.querySelector(".movie-modal__categories");
const elModalSummary = elModal.querySelector(".movie-modal__summary");
const elModalImDbLink = elModal.querySelector(".movie-modal__imdb-link");

// console.log(elModal, elModalTitle, elModalIframe, elModalImDbRating, elModalMovieYear, elModalRuntime, elModalCtegories, elModalSummary, elModalImDbLink);

// RETURN HOURS AND MINUTS FUNC

function getHoursAndMinut(runtime) {
  return `${Math.floor(runtime / 60)} hrs ${Math.floor(runtime % 60)} min`;

}

// SELECT OPTION VALUE RENDER FUNC

function renderGenresOptions(arr, node) {
  const genresFragment = document.createDocumentFragment();
  for (const genre of arr) {
    const newOption = document.createElement("option");
    newOption.value = genre;
    newOption.textContent = genre;
    genresFragment.appendChild(newOption);

  }
  node.appendChild(genresFragment);
}

// GETTING UNIQUE CATEGORIES AND PUSHSHING GENRES ARRAY
function getUniqueGenres() {
  for (const movie of movies) {
    for (const category of movie.categories) {
      if (!genres.includes(category)) {
        genres.push(category);
      }
    }

  }
  genres.sort();
  renderGenresOptions(genres, elSelectGenres);
}

// RENDER ALL MOVIES DATA FUNC

function renderMovies(moviesList, node, regex = "") {
  const moviesFragment = document.createDocumentFragment();
  node.previousElementSibling.style.display = "none";
  node.innerHTML = "";

  moviesList.forEach(kino => {
    const moviesItemClone = elMovieItemTemplate.cloneNode(true);

    moviesItemClone.querySelector(".movie-list__poster").src = kino.img_url;
    moviesItemClone.querySelector(".movie-list__poster").alt = kino.title;


    // HIGHLIGHT SEARCH TITLE

    if (regex.source != "(?:)" && regex) {
      moviesItemClone.querySelector(".movie-list__heading").innerHTML = kino.title.replace(regex, match => `<mark class="d-inline-block p-0 bg-warning text-light rounded-2">${match}</mark>`)
    }
    else {
      moviesItemClone.querySelector(".movie-list__heading").textContent = kino.title
    }

    moviesItemClone.querySelector(".movie-list__rating").textContent = kino.imdb_rating;
    moviesItemClone.querySelector(".movie-list__year").textContent = kino.movie_year;
    moviesItemClone.querySelector(".movie-list__year").setAttribute("datetime", `${kino.movie_year}-03-02`);
    moviesItemClone.querySelector(".movie-list__runtime").textContent = getHoursAndMinut(kino.runtime);
    moviesItemClone.querySelector(".movie-list__categories").textContent = kino.categories.join(" ");
    moviesItemClone.querySelector(".movie-list__more-btn").dataset.imdbId = kino.imdb_id;




    if (bookmarkMovies.some(item => item.title == kino.title)) {
      moviesItemClone.querySelector(".movie-list__bookmark-btn").textContent = "Bookmarked";
      moviesItemClone.querySelector(".movie-list__bookmark-btn").classList.add("bookmarked-btn");

    }
    else {
      moviesItemClone.querySelector(".movie-list__bookmark-btn").textContent = "Add watchlist";
      moviesItemClone.querySelector(".movie-list__bookmark-btn").classList.remove("bookmarked-btn");

    }
    moviesItemClone.querySelector(".movie-list__bookmark-btn").dataset.imdbId = kino.imdb_id;
    moviesFragment.appendChild(moviesItemClone);



  });

  node.appendChild(moviesFragment);
}

// RENDER IN THE MODAL MOVIE DATA FUNC

function renderModalData(findMovie) {
  elModalTitle.textContent = findMovie.title;
  elModalIframe.src = findMovie.movie_frame;
  elModalImDbRating.textContent = findMovie.imdb_rating;
  elModalMovieYear.textContent = findMovie.movie_year;
  elModalMovieYear.setAttribute("datetime", `${findMovie.movie_year}-03-02`);
  elModalRuntime.textContent = getHoursAndMinut(findMovie.runtime);
  elModalCtegories.textContent = findMovie.categories.join(" ");
  elModalSummary.textContent = findMovie.summary;
  elModalImDbLink.href = findMovie.imdb_link;
}

// RENDER BOOKAMRK ARRAY DATA 

function bookmarkedMoviesListRenderFn(arr, node) {
  node.innerHTML = "";

  arr.forEach(booked => {
    const moviesItemClone = elBookmarkedList.cloneNode(true);

    moviesItemClone.querySelector(".movie-list__poster").src = booked.img_url;
    moviesItemClone.querySelector(".movie-list__poster").alt = booked.title;
    moviesItemClone.querySelector(".movie-list__heading").textContent = booked.title;
    moviesItemClone.querySelector(".movie-list__categories").textContent = booked.categories.join(" ");
    moviesItemClone.querySelector(".movie-list__delete-btn").dataset.imdbId = booked.imdb_id;


    node.appendChild(moviesItemClone);
  });
}


// DELETE MOVIES FROM BOOKMARK ARRAY

function deleteBookmarkedMovieFn(id, target = "") {
  target.textContent = "Add watchlist";
  target.classList.remove("bookmarked-btn");

  bookmarkMovies.splice(id, 1);

  window.localStorage.setItem("bookmarkmovie", JSON.stringify(bookmarkMovies));
  checkBookmarkArrayCount();
}


// more info tugmasini ishlatish 

elMovieList.addEventListener("click", evt => {
  // FIND MODAL DATA
  if (evt.target.matches(".movie-list__more-btn")) {
    const btnImDbId = evt.target.dataset.imdbId;

    movies.find(item => {
      if (item.imdb_id === btnImDbId) {
        renderModalData(item);
      }
    });
  }

  if(evt.target.matches(".movie-list__bookmark-btn")){

    const btnBookedId = evt.target.dataset.imdbId;

    const findBookMovie = movies.find(item => {
      return item.imdb_id == btnBookedId;
    });

    const uniqueBookmarkMovieIndex = bookmarkMovies.findIndex(item => {
      return item.imdb_id == btnBookedId;
    });

    if(uniqueBookmarkMovieIndex === -1){

      bookmarkMovies.push(findBookMovie);

      bookmarkedMoviesListRenderFn(bookmarkMovies, watchlist);

      evt.target.textContent = "Bookmarked";
      evt.target.classList.add("bookmarked-btn");


      window.localStorage.setItem("bookmarkmovie", JSON.stringify(bookmarkMovies));

      checkBookmarkArrayCount();

    } else {
      deleteBookmarkedMovieFn(uniqueBookmarkMovieIndex, evt.target);
      bookmarkedMoviesListRenderFn(bookmarkMovies, watchlist);
    }
  }




});

// DELETE BOOKAMRKED MOVIES FROM RIGHT SIDEBAR

watchlist.addEventListener("click", evt => {

  if (evt.target.matches(".movie-list__delete-btn")) {

    const deleteBookedMovieId = evt.target.dataset.imdbId;

    const uniqueBookmarkMovieIndex = bookmarkMovies.findIndex(item => {
      return item.imdb_id == deleteBookedMovieId;

    });
    deleteBookmarkedMovieFn(uniqueBookmarkMovieIndex, evt.target);
    checkBookmarkArrayCount();
    bookmarkedMoviesListRenderFn(bookmarkMovies, watchlist);
    renderMovies(movies.slice(0, 12), elMovieList);

  }
});

// FILTER AND SORT, SEARCH MOVIE DATASET

function resultMoviesList(searchValue) {
  const searchMovies = movies.filter(searchMovie => {
    const moreValues = searchMovie.title.match(searchValue) && (elSelectGenres.value == "all" || searchMovie.categories.includes(elSelectGenres.value)) && (elMovieMinYearInput.value == "" || searchMovie.movie_year >= Number(elMovieMinYearInput.value)) && (elMovieMaxYearInput.value == "" || searchMovie.movie_year <= Number(elMovieMaxYearInput.value));

    return moreValues;

  });

  return searchMovies;
}

// WHEN CLOSE MODAL WINDOW OUR IFRAME SRC WILL BE EMPTY 

elModal.addEventListener("hide.bs.modal", ()=>{
  elModalIframe.src="";
});


// SORT MOVIES

function sortMovies(arr, sortType){
  if(sortType == "a-z") {
    arr.sort((a,b) => {
      if(a.title.toLowerCase() >b.title.toLowerCase() ) return 1
      if(a.title.toLowerCase() <b.title.toLowerCase() ) return -1
      return 0;
    })
  };

  if(sortType =="z-a") {
    arr.sort((a,b)=> {
      return b.title.toLowerCase().charCodeAt(0) - a.title.toLowerCase().charCodeAt(0);
    })
  };

  if(sortType == "oldest-latest"){
    arr.sort((a,b) => a.movie_year -b.movie_year );
  };
  if(sortType == "latest-oldest"){
    arr.sort((a,b) => b.movie_year -a.movie_year );
  };
  if(sortType == "low-high"){
    arr.sort((a,b) => a.imdb_rating -b.imdb_rating );
  };
  if(sortType == "high-low"){
    arr.sort((a,b) => b.imdb_rating -a.imdb_rating );
  };


}

// HANDLE SUBMIT FUNC

function handleSubmitFn(evt){
  evt.preventDefault();

  const searchInputValue = elSearchInput.value.trim();
  const regexSearchTitle =  new RegExp(searchInputValue, "gi");

  const searchMovies = resultMoviesList(regexSearchTitle);



  // EARLY RETURN
  if(searchMovies.length > 0 ) {
    sortMovies(searchMovies, elSelectSortMovie.value);
    renderMovies(searchMovies, elMovieList, regexSearchTitle);
    elMovieAlert.classList.add("d-none");

  }else {
    elMovieAlert.classList.remove("d-none");
    elMovieAlert.textContent = "This movie is not found, try again!";
  }
}

// SUBMIT FORM

elSearchForm.addEventListener("submit", handleSubmitFn);

renderMovies(movies.slice(0,12), elMovieList);
getUniqueGenres();
bookmarkedMoviesListRenderFn(bookmarkMovies, watchlist);
checkBookmarkArrayCount();



