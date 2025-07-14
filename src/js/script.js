const select = {
  templateOf: {
    bookList: "#template-book",
  },
  books: {
    image: ".book__image",
    imagefavouriteClass: "favorite",
    list: ".books-panel .books-list",
  },
};

const templates = {
  bookList: Handlebars.compile(
    document.querySelector(select.templateOf.bookList).innerHTML
  ),
};

const favoriteBooks = [];

function render() {
  const books = dataSource.books;
  const listSelector = document.querySelector(select.books.list);

  for (let book of books) {
    const generatedHTML = templates.bookList(book);
    const bookElement = utils.createDOMFromHTML(generatedHTML);
    listSelector.appendChild(bookElement);
  }
}

function initActions() {
  const bookImages = document.querySelectorAll(select.books.image);

  for (const bookImageElement of bookImages) {
    bookImageElement.addEventListener('dblclick', function (event) {
      event.preventDefault();
      const bookId = this.dataset.id;
      const indexFavouriteBook = favoriteBooks.indexOf(bookId);

      if (indexFavouriteBook === -1) {
        favoriteBooks.push(bookId);
      } else {
        favoriteBooks.splice(indexFavouriteBook, 1);
      }

      this.classList.toggle(select.books.imagefavouriteClass);
      console.log('favoriteBooks', favoriteBooks)
    });
  }
}

render();
initActions();
