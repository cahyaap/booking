const userResolver = require('./users');
const eventResolver = require('./events');
const bookingResolver = require('./bookings');

const rootResolver = {
    ...userResolver,
    ...eventResolver,
    ...bookingResolver
};

module.exports = rootResolver;