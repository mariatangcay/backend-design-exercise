let users = [];

const getUsers = () => users;
const saveUsers = (newUsers) => {users = newUsers};

module.exports = {getUsers, saveUsers};