var request = new XMLHttpRequest();

request.open('GET', 'http://localhost:3333', false);
request.send()

var data = request.response;

if (request.status >= 200 && request.status < 400) {
    if (data === 'yes') {
        // boost.turn(30, true);
        boost.led('red');
    } else {
        // boost.drive(30, true);
        boost.led('green');
    }
}