var usersList = [
    { id: 2, firstName: "Mostafa", lastName: "Hamed", balance: 2000 },
    { id: 1, firstName: "Ahmed", lastName: "Awaga", balance: 1000 },
    { id: 4, firstName: "Mohamed", lastName: "Lotfy", balance: 3000 },
    { id: 3, firstName: "Saleh", lastName: "Mahmoud", balance: 1500 }
];

usersList.forEach(user => {
    console.log(user);
});


function editUserBalanceById(id, newBalance) {
    var userIndex = usersList.findIndex(user => user.id === id);
    if (userIndex !== -1) {
        usersList[userIndex].balance = newBalance;
    } else {
        console.log("User not found");
    }
}

function deleteUserById(id) {
    var userIndex = usersList.findIndex(user => user.id === id);
    if (userIndex !== -1) {
        usersList.splice(userIndex, 1);
    } else {
        console.log("User not found");
    }
}



// editUserBalanceById(2, 8000);
// console.table(usersList);

// deleteUserById(1);
// console.table(usersList);