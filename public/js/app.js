let inputText = document.querySelector('#inputText');

function todoTemplate(item) {
    return ` <li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
                    <span class="item-text">${item.text}</span>
                    <div>
                     <button data-id="${item._id}" class="edit-me btn btn-secondary btn-sm mr-1">Edit</button> 
                     <button data-id="${item._id}" class="delete-me btn btn-danger btn-sm"> Delete</button>
                     </div>
            </li>`
}

let ourHTML = items.map(function (item) {
    return todoTemplate(item)
}).join('');
document.querySelector('#todoList').insertAdjacentHTML('beforeend', ourHTML);

document.querySelector('#todoForm').addEventListener('submit', e => {
    e.preventDefault();
    axios.post('/create-item', { text: inputText.value }).then(function (response) {
        document.querySelector('#todoList').insertAdjacentHTML('beforeend', todoTemplate(response.data))
        inputText.value = '';
        inputText.focus();
    }).catch(function () {
        console.log('Please try again');
    });
})


document.addEventListener('click', e => {
    if (e.target.classList.contains('delete-me')) {
        if (confirm('Do you really want to delete this item ? ')) {
            axios.post('/delete-item', { id: e.target.getAttribute('data-id') }).then(function () {
                e.target.parentElement.parentElement.remove();
            }).catch(function () {
                console.log('Please try again');
            });
        }
    }

    if (e.target.classList.contains('edit-me')) {
        let userInput = prompt('Enter new To do', e.target.parentElement.parentElement.querySelector('.item-text').innerHTML);
        if (userInput) {
            axios.post('/update-item', { text: userInput, id: e.target.getAttribute('data-id') }).then(function () {
                e.target.parentElement.parentElement.querySelector('.item-text').innerHTML = userInput;
            }).catch(function () {
                console.log('Please try again');
            });
        }
    }
})