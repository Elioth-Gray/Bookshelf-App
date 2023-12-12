const RENDER_EVENT = "render-book";
const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOKSHELF_APPS";
const books = [];

function generateId(){
    return +new Date();
}


function generateBooks(id, title, author, year, isComplete){
    return{
        id,
        title,
        author,
        year: parseInt(year),
        isComplete
    }

}

function addBook(){
    const textTitle = document.getElementById("title").value;
    const textAuthor = document.getElementById("author").value;
    const textYear = document.getElementById("year").value;
    const bookStatus = document.getElementById("inputDone").checked;
    const generateID = generateId();
    let completed
    if (bookStatus == true){
        completed = true;
    } else {
        completed = false;
    }

    const booksObject = generateBooks(generateID, textTitle, textAuthor, textYear, completed);
    
    books.push(booksObject)
    document.dispatchEvent(new Event(RENDER_EVENT))
    saveData();
}


function makeBook(booksObject){
    const bookTitle = document.createElement("h2");
    bookTitle.innerText = booksObject.title;

    const bookAuthor = document.createElement("p");
    bookAuthor.innerText = booksObject.author

    const bookYear = document.createElement("p");
    bookYear.innerText = booksObject.year;

    

    const textContainer = document.createElement("div");
    textContainer.classList.add("inner");
    textContainer.append(bookTitle, bookAuthor, bookYear);

    const container = document.createElement("div");
    container.classList.add("item", "shadow")
    container.append(textContainer)
    container.setAttribute("id", `todo-${booksObject.id}`);


    if (booksObject.isComplete){
        const undobutton = document.createElement("button");
        undobutton.classList.add("undo-button");

        undobutton.addEventListener("click", function(){
            undoBooksFromCompleted(booksObject.id)
        })

        const trashButton = document.createElement("button");
        trashButton.classList.add("trash-button");

        trashButton.addEventListener("click", function(){
            removeBooksFromCompleted(booksObject.id);
        })

        container.append(undobutton, trashButton)

    } else {
        const checkbutton = document.createElement("button");
        checkbutton.classList.add("check-button")

        checkbutton.addEventListener('click', function(){
            addBooksToCompleted(booksObject.id)
            
        })

        const trashButton = document.createElement("button");
        trashButton.classList.add("trash-button");

        trashButton.addEventListener("click", function(){
            removeBooksFromCompleted(booksObject.id);
        })

        container.append(checkbutton, trashButton);
    }

    return container;


}

function addBooksToCompleted (booksId){
    const booksTarget = findBooks(booksId);

    if (booksTarget == null) return;

    booksTarget.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT))
    saveData();
}

function findBooks(booksId){
    for (const booksItem of books){
        if (booksItem.id === booksId){
            return booksItem;
        }
    }
    return null;
}

function removeBooksFromCompleted(booksId){
    const booksTarget = findBooksIndex(booksId);

    if (booksTarget === -1) return;

    books.splice(booksTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function undoBooksFromCompleted(booksId){
    const booksTarget = findBooks(booksId);

    if (booksTarget == null) return;

    booksTarget.isComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT))
    saveData();
}


function findBooksIndex(booksId){
    for (const index in books){
        if (books[index].id === booksId){
            return index;
        }
    }

    return -1
}

document.addEventListener("DOMContentLoaded", function(){
    const submitform = document.getElementById("form");
    submitform.addEventListener("submit", function(event){
        event.preventDefault();
        addBook();
    })

    document.addEventListener(RENDER_EVENT, function(){
        console.log(books)
        const uncompletedBooksList = document.getElementById("unreadedBooks");
        uncompletedBooksList.innerHTML="";
    
        const completedBooksList = document.getElementById("readedBooks");
        completedBooksList.innerHTML="";
    
        for (const bookItem of books){
            const booksElement = makeBook(bookItem);
           if (!bookItem.isComplete)
            uncompletedBooksList.append(booksElement);
            else 
            completedBooksList.append(booksElement);
           
        }
})

if (isStorageExist()){
    loadDataFromStorage();
}

})

function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
  }
  
  function isStorageExist () {
    if (typeof (Storage) === 'undefined') {
        alert('Browser kamu tidak mendukung local storage');
        return false;
    }
    return true;
  }
  
  document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
    alert("Data berhasil ditambahkan.");
  });
  
  function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);
   
    if (data !== null) {
      for (const book of data) {
        books.push(book);
      }
    }
   
    document.dispatchEvent(new Event(RENDER_EVENT));
  }