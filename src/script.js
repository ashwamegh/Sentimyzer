    const form = document.querySelector('form.user-input');

    const onFormSubmission = (event) => {
      event.preventDefault();
      const username = document.querySelector('input.handle-input');

      fetch('https://sentimyzer-server.glitch.me/gettweets/'+username.value)
      .then(
        function(response) {
          if (response.status !== 200) {
            console.log('Looks like there was a problem. Status Code: ' +
              response.status);
            return;
          }
    
          // Examine the text in the response
          response.json().then(function(data) {
            console.log(data);
          });
        }
      )
      .catch(function(err) {
        console.log('Fetch Error :-S', err);
      });

      username.value = '';
    }

    form.addEventListener('submit', onFormSubmission);