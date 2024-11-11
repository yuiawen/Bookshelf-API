const { insertBookHandler, getAllBooksHandler, getDetaiBookHandler, updateBookHandler, removeBookHandler, } = require('./handler');

const routes = [
    {
        method: 'POST',
        path: '/books',
        handler: insertBookHandler,
    },
    {
        method: 'GET',
        path: '/books',
        handler: getAllBooksHandler,
    },
    {
        method: 'GET',
        path: '/books/{bookId}',
        handler: getDetaiBookHandler,
    },
    {
        method: 'PUT',
        path: '/books/{bookId}',
        handler: updateBookHandler,
    },
    {
        method: 'DELETE',
        path: '/books/{bookId}',
        handler: removeBookHandler,
    },
];

module.exports = routes;