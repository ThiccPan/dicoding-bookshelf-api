const { nanoid } = require('nanoid');
const books = require('./books');

// iterate array of book, if curr book id equals to param id then return that book obj
const bookChecker = (id) => books.find((book) => book.id === id);

// func to create new note
const addBookHandler = (req, h) => {
  const {
    name, year, author, summary,
    publisher, pageCount, readPage, reading,
  } = req.payload;

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);

  const isSuccess = books.find((book) => book.id === id);

  if (isSuccess === undefined) {
    const response = h.response({
      status: 'error',
      message: 'Buku gagal ditambahkan',
    });
    response.code(500);
    return response;
  }

  const response = h.response({
    status: 'success',
    message: 'Buku berhasil ditambahkan',
    data: {
      bookId: id,
    },
  });
  response.code(201);
  return response;
};

const getAllBooksHandler = (req) => {
  let filteredBook = [...books];

  if (req.query.name !== undefined) {
    filteredBook = filteredBook.filter((book) => book.name
      .toLowerCase()
      .includes(req.query.name
        .toLowerCase()));
  }

  if (req.query.reading === '0') {
    filteredBook = filteredBook.filter((book) => book.reading === false);
  } else if (req.query.reading === '1') {
    filteredBook = filteredBook.filter((book) => book.reading === true);
  }

  if (req.query.finished === '0') {
    filteredBook = filteredBook.filter((book) => book.finished === false);
  } else if (req.query.finished === '1') {
    filteredBook = filteredBook.filter((book) => book.finished === true);
  }

  return {
    status: 'success',
    data: {
      books: filteredBook.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  };
};

const getBookHandler = (req, h) => {
  const { bookId } = req.params;
  const isFind = bookChecker(bookId);

  if (isFind !== undefined) {
    return {
      status: 'success',
      data: {
        book: isFind,
      },
    };
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editBookHandler = (req, h) => {
  const { bookId } = req.params;
  const {
    name, year, author, summary,
    publisher, pageCount, readPage, reading,
  } = req.payload;
  const updatedAt = new Date().toISOString();

  // check if name isn't specified
  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  // check if readpage > pageCOunt

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const isFind = bookChecker(bookId);

  if (isFind === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  }

  // edit obj properties
  isFind.name = name;
  isFind.year = year;
  isFind.author = author;
  isFind.summary = summary;
  isFind.publisher = publisher;
  isFind.pageCount = pageCount;
  isFind.readPage = readPage;
  isFind.reading = reading;
  isFind.updatedAt = updatedAt;

  const response = h.response({
    status: 'success',
    message: 'Buku berhasil diperbarui',
  });
  response.code(200);
  return response;
};

const deleteBookHandler = (req, h) => {
  const { bookId } = req.params;
  const deleteIdx = books.findIndex((book) => book.id === bookId);

  if (deleteIdx === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  }

  books.splice(deleteIdx);

  const response = h.response({
    status: 'success',
    message: 'Buku berhasil dihapus',
  });
  response.code(200);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookHandler,
  editBookHandler,
  deleteBookHandler,
};
