const select = {
  templateOf: {
    bookList: "#template-book",
  },
  books: {
    image: {
      class: ".book__image",
      className: "book__image",
      selectorById: (id) => `.book__image[data-id="${id}"]`,
    },
    hidden: "hidden",
    imagefavouriteClass: "favorite",
    list: ".books-panel .books-list",
    rating: ".book__rating__fill",
  },
  containerOf: {
    filters: ".filters",
  },
};

const templates = {
  bookList: Handlebars.compile(
    document.querySelector(select.templateOf.bookList).innerHTML
  ),
};

const favoriteBooks = [];
const filters = [];

function render() {
  const books = dataSource.books;
  const listSelector = document.querySelector(select.books.list);

  for (let book of books) {
    const ratingBgc = determineRatingBgc(book.rating);
    const ratingWidth = book.rating * 10;

    book.ratingBgc = ratingBgc;
    book.ratingWidth = ratingWidth;

    const generatedHTML = templates.bookList(book);
    const bookElement = utils.createDOMFromHTML(generatedHTML);
    listSelector.appendChild(bookElement);
  }
}

function initActions() {
  const bookListContainer = document.querySelector(select.books.list);

  bookListContainer.addEventListener("click", function (event) {
    event.preventDefault();
  });
  bookListContainer.addEventListener("dblclick", function (event) {
    const parentLink = event.target.offsetParent;

    if (
      parentLink &&
      parentLink.classList.contains(select.books.image.className)
    ) {
      event.preventDefault();
      const bookId = parentLink.dataset.id;
      console.log("clicked on the book with the id: ", bookId);
      const indexFavouriteBook = favoriteBooks.indexOf(bookId);

      if (indexFavouriteBook === -1) {
        favoriteBooks.push(bookId);
        // parentLink.classList.add(select.books.imagefavouriteClass);
      } else {
        favoriteBooks.splice(indexFavouriteBook, 1);
        // parentLink.classList.remove(select.books.imagefavouriteClass);
      }

      parentLink.classList.toggle(select.books.imagefavouriteClass);
      console.log("favoriteBooks: ", favoriteBooks);
    }
  });

  const filtersForm = document.querySelector(select.containerOf.filters);

  filtersForm.addEventListener("click", function (event) {
    const target = event.target;

    if (
      target.tagName === "INPUT" &&
      target.type === "checkbox" &&
      target.name === "filter"
    ) {
      const filterValue = target.value;
      // console.log('filterValue: ', filterValue);

      if (target.checked) {
        filters.push(filterValue);
      } else {
        const index = filters.indexOf(filterValue);

        if (index !== -1) {
          filters.splice(index, 1);
        }
      }
      // console.log('active filters: ', filters);
    }
    filterBooks();
  });
}

function filterBooks() {
  for (const book of dataSource.books) {
    let shouldBeHidden = false;

    for (const filter of filters) {
      if (!book.details[filter]) {
        shouldBeHidden = true;
        break;
      }
    }

    const bookImageElement = document.querySelector(
      select.books.image.selectorById(book.id)
    );

    if (bookImageElement) {
      if (shouldBeHidden) {
        bookImageElement.classList.add(select.books.hidden);
      } else {
        bookImageElement.classList.remove(select.books.hidden);
      }
    }
  }
}

function determineRatingBgc(rating) {
  if (rating < 6) {
   return 'linear-gradient(to bottom,  #fefcea 0%, #f1da36 100%)';
  } else if (rating <= 8) {
    return 'linear-gradient(to bottom, #b4df5b 0%,#b4df5b 100%)';
  } else if (rating <= 9) {
   return 'linear-gradient(to bottom, #299a0b 0%, #299a0b 100%)';
  } else {
   return 'linear-gradient(to bottom, #ff0084 0%,#ff0084 100%)';
  }
}

render();
initActions();
