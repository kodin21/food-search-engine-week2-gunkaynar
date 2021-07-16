// Loading shows up but the it loads too fast to see

let foodArray = [];
var favorites = [];

let search = true;

async function load() {
    await fetch("https://jsonplaceholder.typicode.com/users/1")
    .then(response => {
    response.json().then(res => {
        document.getElementById('username').innerText = "Merhaba, " + res.username;
        })
    })


    await fetch("https://jsonplaceholder.typicode.com/todos")
    .then(response => response.json())
    .then(res => {
        let foodList = res;

        for (const key in foodList) {
            if (Object.hasOwnProperty.call(foodList, key)) {
                const element = foodList[key];
                
                foodArray.push(element.title);
            }
        }
    })

    if (localStorage.getItem("favorites") != null) {
        let str = localStorage.getItem("favorites");

        favorites = str.split(",");
    };
}

load()
.then(() => {
    document.getElementById('main').classList.remove("invisible");
    document.getElementById('loading').remove();

    const fuse = new Fuse(foodArray);

    const foodName = document.getElementById('foodName');
    
    const button = document.getElementById('click');

    foodName.onkeyup = function() {
        let results = document.getElementById('results');

        results.innerHTML = "";

        fuse.search(foodName.value).forEach(food => {
            let c = card(food.item);
            results.appendChild(c);

            if (favorites.includes(food.item)) {
                document.getElementById(food.item).classList.add("favorite");
            }

            document.getElementById(food.item).onclick = function() {
                document.getElementById(food.item).classList.toggle("favorite");

                if (favorites.includes(food.item)) favorites.slice(favorites.indexOf(food.item), favorites.indexOf(food.item));
                else favorites.push(food.item);

                localStorage.setItem("favorites", favorites);
            }

            c.onkeyup = function(e) {
                if (e.key == "f") {
                    document.getElementById(food.item).classList.toggle("favorite");

                    if (favorites.includes(food.item)) favorites.slice(favorites.indexOf(food.item), favorites.indexOf(food.item));
                    else favorites.push(food.item);

                    localStorage.setItem("favorites", favorites);
                }
            }
        })
    }

    button.onclick = function() {   
        search = !search;

        if (search) {
            foodName.classList.remove("invisible");
            button.value = "Show Favorites";
            results.innerHTML = "";
        } else {
            foodName.classList.add("invisible");
            button.value = "Hide Favorites";

            results.innerHTML = "";
            
            favorites.forEach(fav => {
                let f = card(fav);
                document.getElementById("results").appendChild(f);

                document.getElementById(fav).classList.add("favorite");

                document.getElementById(fav).onclick = function() {
                    favorites.slice(favorites.indexOf(fav), favorites.indexOf(fav));
                    f.remove();
                    localStorage.setItem("favorites", favorites);
                }

                f.onkeyup = function(e) {
                    if (e.key == "f") {
                        favorites.slice(favorites.indexOf(fav), favorites.indexOf(fav));
                        f.remove();
                        localStorage.setItem("favorites", favorites);
                    }
                }
            })
        }
    }
})




function card(text) {
    let a = document.createElement('div');
    a.classList.add("card");

    a.tabIndex = 0;

    let b = document.createElement('div');
    b.classList.add("card-body");
    b.innerText = text;

    let c = document.createElement("button");
    c.innerText = "☆";
    c.style = "float:right;border: 2px gold solid;color:gold;font-size:100%;";
    c.classList.add("btn");
    c.id = text;

    a.appendChild(b);

    b.appendChild(c);

    return a;
}

