/**
 * Funkcja pobierająca tabelkę z bazy danych oraz tworząca kod HTML który zosaje dodany do elementu
 */
function getData() {

    var ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function() {
        if (ajax.readyState == 4 && ajax.status == 200) {
            response = JSON.parse(ajax.responseText);
            if (response.return) {
                var _t = document.getElementById('table-body'),
                    table = '';
                for (var item in response.data) {
                    var ischecked = (response.data[item].status == 0) ? 'checked="checked"' : '';
                    var disabled = (response.data[item].status == 0) ? 'class="disabled"' : '';
                    table += `<tr ${disabled}>`
                    table += `<td><input id="status-task" data-id="${response.data[item].id}" type="checkbox" ${ischecked} /></td>`
                    table += `<td><div>${response.data[item].name}</div><button class="remove" data-id="${response.data[item].id}"><i class="fa fa-trash"></i></button></td>`
                    table += `</tr>`
                }
                _t.innerHTML = table;
            }
        } else if (ajax.readyState == 4 && ajax.status == 400){
            console.error('GET error');
        }
    }
    ajax.open("GET", "http://localhost:8080/api");
    ajax.send();
}
getData();


/**
 * Jeśli klikniemy w przycisk "+" zostanie wywołana funkcja add
 */
document.querySelector('.plus').addEventListener('click', add);
/**
 * Jeśli klikniemy enter zostanie wywołana funkcja add
 */
document.getElementById('add-field').addEventListener('keydown', function(event) {
    if (event.keyCode == 13) {
        add();
    }
})

/**
 * Funkcja dodająca nowy wpis do listy
 * jeśli wpis nie jest pusty i nie przekracza 40 znaków wykona się ajax
 * w przeciwnym wypadku do konsoli zostanie dodany błąd o odpowiednim komunikacie
 */
function add() {
    var name = document.getElementById('add-field');
    if (name.value != '' && name.value.length <= 40) {
        var data = {
            name: name.value
        }
        var ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function() {
            if (ajax.readyState == 4 && ajax.status == 200) {
                response = JSON.parse(ajax.responseText);
                if (response.return) {
                    getData();
                    name.value = '';
                }
            } else if(ajax.readyState == 4 && ajax.status == 400){
                console.error('DELETE error');
            }
        }
        ajax.open("POST", "http://localhost:8080/api");
        ajax.setRequestHeader("Content-Type", "application/json");
        ajax.send(JSON.stringify(data));

    } else {
        var reason = (name.value.length == 0) ? 'empty fied' : 'too long task';
        console.error(reason);
    }
}

/**
 * Funkcja zmieniająca status na wykonany
 * ustawia status w zależności od checkboxa oraz pobiera id z atrybutu data-id
 * po kliknięciu w checkbox zostanie wysłany PUT to api
 * jeśli operacja się powiedzie zostanie wykonana funkcja getData()
 * która ponownie stworzy nam tabelkę
 */
document.querySelector('body').addEventListener('change', function(event) {
    if (event.target.id == 'status-task') {
        var status = (event.target.checked) ? 0 : 1;
        var id = event.target.getAttribute('data-id');

        var data = {
            id: id,
            status: status
        }

        var ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function() {
            if (ajax.readyState == 4 && ajax.status == 200) {
                response = JSON.parse(ajax.responseText);
                if (response.return) {
                    getData();
                }
            } else if (ajax.readyState == 4 && ajax.status == 400){
                console.error('PUT error');
            }
        }
        ajax.open("PUT", "http://localhost:8080/api");
        ajax.setRequestHeader("Content-Type", "application/json");
        ajax.send(JSON.stringify(data));

    }

});


/**
 * Funkcja kasująca element z tabli
 * pobiera id z atrybutu data-id
 * i przesyła go do funkcji ajax()
 */
document.querySelector('body').addEventListener('click', function(event) {

    if (event.target.className == 'fa fa-trash') {
        var id = event.target.parentNode.getAttribute('data-id');
        ajax(id)
    }
    if (event.target.className == 'remove') {
        var id = event.target.getAttribute('data-id');
        ajax(id)
    }

    /**
     * Funkcja wysyłająca id do kasowania
     * @parm {number} id wpisu
     */
    function ajax(id) {
        var data = {
            id: id
        }

        var ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function() {
            if (ajax.readyState == 4 && ajax.status == 200) {
                response = JSON.parse(ajax.responseText);
                if (response.return) {
                    getData();
                }
            } else if(ajax.readyState == 4 && ajax.status == 400){
                console.error('DELETE error');
            }
        }
        ajax.open("DELETE", "http://localhost:8080/api");
        ajax.setRequestHeader("Content-Type", "application/json");
        ajax.send(JSON.stringify(data));
    }

});
