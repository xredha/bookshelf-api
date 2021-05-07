const { nanoid } = require('nanoid');
const books = require('./books');
const responseDataAPI = require('./function');

const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage;

  if (!name) {
    const response = h.response(
      responseDataAPI('fail', 'Gagal menambahkan buku. Mohon isi nama buku'),
    );
    response.code(400);
    return response;
  }

  const typeString = {
    name,
    author,
    summary,
    publisher,
  };
  const typeNumber = { year, pageCount, readPage };
  const typeBoolean = { reading };

  for (const prop in typeString) {
    if (typeof typeString[prop] !== 'string') {
      const response = h.response(
        responseDataAPI('fail', `${prop} harus bertipe data string`),
      );
      response.code(400);
      return response;
    }
  }

  for (const prop in typeNumber) {
    if (typeof typeNumber[prop] !== 'number') {
      const response = h.response(
        responseDataAPI('fail', `${prop} harus bertipe data number`),
      );
      response.code(400);
      return response;
    }
  }

  for (const prop in typeBoolean) {
    if (typeof typeBoolean[prop] !== 'boolean') {
      const response = h.response(
        responseDataAPI('fail', `${prop} harus bertipe data boolean`),
      );
      response.code(400);
      return response;
    }
  }

  if (readPage > pageCount) {
    const response = h.response(
      responseDataAPI('fail', 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'),
    );
    response.code(400);
    return response;
  }

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

  const isSuccess = books.filter((book) => book.id === id).length > 0;
  if (isSuccess) {
    const response = h.response(
      responseDataAPI('success', 'Buku berhasil ditambahkan', { bookId: id }),
    );
    response.code(201);
    return response;
  }

  const response = h.response(
    responseDataAPI('fail', 'Buku gagal ditambahkan'),
  );
  response.code(500);
  return response;
};

const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;

  if (books.length === 0) {
    const response = h.response(
      responseDataAPI('success', undefined, { books }),
    );
    response.code(200);
    return response;
  }

  if (name) {
    const nameLower = name.toLowerCase();
    const booksFilterByName = books.filter(
      (book) => book.name.toLowerCase().indexOf(nameLower) !== -1,
    );
    const customBook = booksFilterByName.map((book) => ({
      id: book.id,
      name: book.name,
      publisher: book.publisher,
    }));

    const response = h.response(
      responseDataAPI('success', undefined, { books: customBook }),
    );
    response.code(200);
    return response;
  }
  if (reading) {
    const booksFilterByReading = books.filter(
      (book) => Number(book.reading) === Number(reading),
    );
    const customBook = booksFilterByReading.map((book) => ({
      id: book.id,
      name: book.name,
      publisher: book.publisher,
    }));

    const response = h.response(
      responseDataAPI('success', undefined, { books: customBook }),
    );
    response.code(200);
    return response;
  }
  if (finished) {
    const booksFilterByFinished = books.filter(
      (book) => Number(book.finished) === Number(finished),
    );
    const customBook = booksFilterByFinished.map((book) => ({
      id: book.id,
      name: book.name,
      publisher: book.publisher,
    }));

    const response = h.response(
      responseDataAPI('success', undefined, { books: customBook }),
    );
    response.code(200);
    return response;
  }
  const customBook = books.map((book) => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher,
  }));
  const response = h.response(
    responseDataAPI('success', undefined, { books: customBook }),
  );
  response.code(200);
  return response;
};

const getBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const book = books.filter((n) => n.id === id)[0];

  if (book !== undefined) {
    return responseDataAPI('success', undefined, { book });
  }

  const response = h.response(
    responseDataAPI('fail', 'Buku tidak ditemukan'),
  );
  response.code(404);
  return response;
};

const editBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  const updatedAt = new Date().toISOString();

  if (!name) {
    const response = h.response(
      responseDataAPI('fail', 'Gagal memperbarui buku. Mohon isi nama buku'),
    );
    response.code(400);
    return response;
  }

  const typeString = {
    name,
    author,
    summary,
    publisher,
  };
  const typeNumber = { year, pageCount, readPage };
  const typeBoolean = { reading };

  for (const prop in typeString) {
    if (typeof typeString[prop] !== 'string') {
      const response = h.response(
        responseDataAPI('fail', `${prop} harus bertipe data string`),
      );
      response.code(400);
      return response;
    }
  }

  for (const prop in typeNumber) {
    if (typeof typeNumber[prop] !== 'number') {
      const response = h.response(
        responseDataAPI('fail', `${prop} harus bertipe data number`),
      );
      response.code(400);
      return response;
    }
  }

  for (const prop in typeBoolean) {
    if (typeof typeBoolean[prop] !== 'boolean') {
      const response = h.response(
        responseDataAPI('fail', `${prop} harus bertipe data boolean`),
      );
      response.code(400);
      return response;
    }
  }

  if (readPage > pageCount) {
    const response = h.response(
      responseDataAPI('fail', 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'),
    );
    response.code(400);
    return response;
  }

  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };
    const response = h.response(
      responseDataAPI('success', 'Buku berhasil diperbarui'),
    );
    response.code(200);
    return response;
  }

  const response = h.response(
    responseDataAPI('fail', 'Gagal memperbarui buku. Id tidak ditemukan'),
  );
  response.code(404);
  return response;
};

const deleteBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const index = books.findIndex((book) => book.id === id);
  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response(
      responseDataAPI('success', 'Buku berhasil dihapus'),
    );
    response.code(200);
    return response;
  }

  const response = h.response(
    responseDataAPI('fail', 'Buku gagal dihapus. Id tidak ditemukan'),
  );
  response.code(404);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
