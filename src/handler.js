const books = require("./books");
const { nanoid } = require("nanoid");

const currentDate = () => new Date().toISOString();

const filterBook = (bookId) => {
  const result = books.filter((book) => book.id === bookId);
  return result.length > 0 ? result[0] : null;
};
const filterBookIndex = (bookId) => {
  const result = books.filter((book) => book.id === bookId);
  return result.length > 0 ? books.indexOf(result[0]) : -1;
};

const insertBook = (bookRecords) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = bookRecords;
  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = (updatedAt = currentDate());

  books.push({
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
  });
  return id;
};

// Menyimpan buku
const insertBookHandler = (request, h) => {
  const bookRecords = request.payload;

  if (!bookRecords.name) {
    const response = h.response({
      status: "fail",
      message: "Gagal menambahkan buku. Mohon isi nama buku",
    });
    response.code(400);
    return response;
  }

  if (bookRecords.readPage > bookRecords.pageCount) {
    const response = h.response({
      status: "fail",
      message:
        "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
    });
    response.code(400);
    return response;
  }

  const bookId = insertBook(bookRecords);

  if (!filterBook(bookId)) {
    const response = h.response({
      status: "fail",
      message: "Gagal menambahkan buku.",
    });
    response.code(500);
    return response;
  }

  const response = h.response({
    status: "success",
    message: "Buku berhasil ditambahkan",
    data: {
      bookId,
    },
  });
  response.code(201);
  return response;
};

// Menampilkan seluruh buku
const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;
  let filteredBooks = books.map((book) => ({ ...book }));

  if (name) {
    filteredBooks = filteredBooks.filter((b) =>
      b.name.toLowerCase().includes(name.toLowerCase())
    );
  } else if (reading) {
    filteredBooks = filteredBooks.filter(
      (b) => Number(b.reading) === Number(reading)
    );
  } else if (finished) {
    filteredBooks = filteredBooks.filter(
      (b) => Number(b.finished) === Number(finished)
    );
  }

  const response = h.response({
    status: "success",
    data: {
      books: filteredBooks.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  });
  response.code(200);
  return response;
};

// Menampilkan detail buku
const getDetaiBookHandler = (request, h) => {
  const { bookId } = request.params;
  const book = filterBook(bookId);

  if (!book) {
    const response = h.response({
      status: "fail",
      message: "Buku tidak ditemukan",
    });
    response.code(404);
    return response;
  }

  const response = h.response({
    status: "success",
    data: { book },
  });
  response.code(200);
  return response;
};

// Mengubah data buku
const updateBookHandler = (request, h) => {
  const bookRecords = request.payload;
  const { bookId } = request.params;
  const book = filterBook(bookId);

  let response;

  if (!bookRecords.name) {
    response = h.response({
      status: "fail",
      message: "Gagal memperbarui buku. Mohon isi nama buku",
    });
    response.code(400);
  } else if (bookRecords.readPage > bookRecords.pageCount) {
    response = h.response({
      status: "fail",
      message:
        "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
    });
    response.code(400);
  } else if (!book) {
    response = h.response({
      status: "fail",
      message: "Gagal memperbarui buku. Id tidak ditemukan",
    });
    response.code(404);
  } else {
    Object.assign(book, bookRecords);

    response = h.response({
      status: "success",
      message: "Buku berhasil diperbarui",
    });
    response.code(200);
  }

  return response;
};

// Menghapus buku
const removeBookHandler = (request, h) => {
  const { bookId } = request.params;
  const bookIndex = filterBookIndex(bookId);

  if (bookIndex === -1) {
    const response = h.response({
      status: "fail",
      message: "Buku gagal dihapus. Id tidak ditemukan",
    });
    response.code(404);
    return response;
  }

  books.splice(bookIndex, 1);

  const response = h.response({
    status: "success",
    message: "Buku berhasil dihapus",
  });
  response.code(200);
  return response;
};

module.exports = {
  insertBookHandler,
  getAllBooksHandler,
  getDetaiBookHandler,
  updateBookHandler,
  removeBookHandler,
};
