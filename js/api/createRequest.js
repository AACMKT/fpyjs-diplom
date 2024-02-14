/**
 * Основная функция для совершения запросов по Yandex API.
 * */
const createRequest = (options = {}) => {
    const xhr = new XMLHttpRequest();
    const url = new URL(options.url);
    const method = options.method;
    if (options.data){
        const params = new URLSearchParams(options.data);
        url.search = params;
    };
    
    try {
        xhr.open(method, url);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('Authorization', options.auth);
        xhr.send();
        xhr.onload = (e) => {options.callback(e.target.response)};
    }
    catch (err) {
        console.log(err) 
    }
};
