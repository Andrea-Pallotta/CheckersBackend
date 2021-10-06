const colors = require('colors');

const users = [];

const joinUser = (id, username, room) => {
    const user = { id, username, room };
    users.push(user);
    console.log(users .colors.red);

    return user;
};

console.log('user out', users);

const getCurrentUser = (id) => users.find((user) => user.id === id);

const userDisconnect = (id) => {
    const index = users.findIndex((user) => user.id === id);

    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
};

module.exports = {
    joinUser,
    getCurrentUser,
    userDisconnect,
};