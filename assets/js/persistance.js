
function storeObject(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function retreiveObject(key) {
    var value = localStorage.getItem(key);
    return value && JSON.parse(value);
}