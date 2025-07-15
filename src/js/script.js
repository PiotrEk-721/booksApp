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

class BooksList {
  constructor() {
    const thisBookList = this;

    thisBookList.favoriteBooks = [];
    thisBookList.filters = [];

    thisBookList.initData();
    thisBookList.getElements(document);
    thisBookList.render();
    thisBookList.initActions();
  }
  initData() {
    this.data = dataSource.books;
  }
  render() {
    const thisBookList = this;

    const listSelector = thisBookList.bookListContainer;

    for (let book of this.data) {
      const ratingBgc = thisBookList.determineRatingBgc(book.rating);
      const ratingWidth = book.rating * 10;

      book.ratingBgc = ratingBgc;
      book.ratingWidth = ratingWidth;

      const generatedHTML = templates.bookList(book);
      const bookElement = utils.createDOMFromHTML(generatedHTML);
      listSelector.appendChild(bookElement);
    }
  }
  getElements(element) {
    const thisBookList = this;

    thisBookList.element = element;
    thisBookList.bookListContainer = thisBookList.element.querySelector(
      select.books.list
    );
    thisBookList.filtersForm = thisBookList.element.querySelector(
      select.containerOf.filters
    );
  }
  initActions() {
    const thisBookList = this;

    const bookListContainer = thisBookList.bookListContainer;

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
        const indexFavouriteBook = thisBookList.favoriteBooks.indexOf(bookId);

        if (indexFavouriteBook === -1) {
          thisBookList.favoriteBooks.push(bookId);
        } else {
          thisBookList.favoriteBooks.splice(indexFavouriteBook, 1);
        }

        parentLink.classList.toggle(select.books.imagefavouriteClass);
        console.log("favoriteBooks: ", thisBookList.favoriteBooks);
      }
    });

    const filtersForm = thisBookList.filtersForm;

    filtersForm.addEventListener("click", function (event) {
      const target = event.target;

      if (
        target.tagName === "INPUT" &&
        target.type === "checkbox" &&
        target.name === "filter"
      ) {
        const filterValue = target.value;

        if (target.checked) {
          thisBookList.filters.push(filterValue);
        } else {
          const index = thisBookList.filters.indexOf(filterValue);

          if (index !== -1) {
            thisBookList.filters.splice(index, 1);
          }
        }
      }
      thisBookList.filterBooks();
    });
  }
  filterBooks() {
    const thisBookList = this;

    for (const book of this.data) {
      let shouldBeHidden = false;

      for (const filter of thisBookList.filters) {
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
  determineRatingBgc(rating) {
    if (rating < 6) {
      return "linear-gradient(to bottom, #fefcea 0%, #f1da36 100%)";
    } else if (rating <= 8) {
      return "linear-gradient(to bottom, #b4df5b 0%,#b4df5b 100%)";
    } else if (rating <= 9) {
      return "linear-gradient(to bottom, #299a0b 0%, #299a0b 100%)";
    } else {
      return "linear-gradient(to bottom, #ff0084 0%,#ff0084 100%)";
    }
  }
}

const app = new BooksList();
