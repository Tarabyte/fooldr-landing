/*global window, XMLHttpRequest*/
/**
 * Add subscribe functionality;
 */
(function(win){
  var doc = win.document,
      form = doc.getElementById('subscribe'),
      email = doc.getElementById('email');

  form.addEventListener('submit', subscribe, false);

  function subscribe(ev) {
    var value = email.value;
    ev.preventDefault(); //stop form from being sent

    send(value);
  }

  function send(email) {
    var request = new XMLHttpRequest();

    request.open('POST', 'api/subscriptions', true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.onreadystatechange = function() {
      if(request.readyState === 4) {
        if(request.status === 200) {
          form.className += ' done success';
        }
        else {
          form.className += ' done error';
        }
      }
    };

    request.send(JSON.stringify({email: email}));
  }

}(window));
