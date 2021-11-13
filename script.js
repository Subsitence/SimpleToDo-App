const list = document.querySelector('.todo-list');
const plusBtn = document.querySelector('.plus-btn');
const inputBox = document.querySelector('.input-box');
const input = document.querySelector('.input-box input');
const addBtn = document.querySelector('.submit-btn');

function Storage(store_key) {
    const todoList = JSON.parse(localStorage.getItem(store_key)) ?? [];
    const save = () => {
        localStorage.setItem(store_key, JSON.stringify(todoList));
    }

    return {
        get() {
            return todoList;
        },
        set(newItem) {
            todoList.push(newItem);
            save();
        },
        delete(index) {
            todoList.splice(index, 1);
            save();
        },
        saveConfig() {
            save();
        }
    }
}

function render(storage_data) {
    let content = storage_data.map(function(data, index) {
        let classConfig = '';
        
        if(data.isDone) {
            classConfig = 'done';
        }

        return `
        <li class="${classConfig}" data-index="${index}">
            <span class="check-btn ${classConfig}"><i class="ti-check"></i></span>
            <p class="${classConfig}">${data.task}</p>
            <span class="delete-btn">
                <i class="ti-trash"></i>
            </span>
        </li>
        `
    })
    
    list.innerHTML = content.join('');
}

function handleEvent(todoApp) {
    
    
    //open inputbox
    plusBtn.onclick = function() {
        inputBox.classList.toggle('active');
    }
    
    // add data to localStorage
    addBtn.onclick = function() {
        if(input.value) {
            todoApp.set({
                task: input.value,
                isDone: false
            });

            input.value = '';
            inputBox.classList.toggle('active');
            console.log(todoApp.get());
            render(todoApp.get());
        }
    }

    
    list.onclick = function(e) {
        let checkBtn = e.target.closest('.check-btn');
        let deleteBtn = e.target.closest('.delete-btn');

        if(checkBtn) {
            checkBtn.classList.toggle('done');
            checkBtn.parentElement.classList.toggle('done');
            checkBtn.parentElement.querySelector('p').classList.toggle('done');
            
            todoApp.get()[checkBtn.parentElement.dataset.index]['isDone'] = 
                                    checkBtn.classList.contains('done') ? true : false;
            todoApp.saveConfig();
        }

        if(deleteBtn) {
            todoApp.delete(deleteBtn.parentElement.dataset.index);
            render(todoApp.get());
        }
    }
    
    
}

function start() {
    const storage_key = 'todo_list';
    const todoApp = Storage(storage_key);

    render(todoApp.get());
    handleEvent(todoApp);
}



start();