let currentMoive = null;
let movieData = [];

document.addEventListener('DOMContentLoaded', function() {
    // Function to make GET request
    function getRequest(url, callback) {
        fetch(url)
            .then(response => response.json())
            .then(data => callback(data))
            .catch(error => console.error('Error:', error));
    }

    // Function to display movie details
    function displayMovieDetails(movie) {
        movieImage.innerHTML = `<img src="${movie.poster}" alt="${movie.title} Image" width="300">`;
        movieDescription.innerHTML = `
                
                <h2>${movie.title}</h2>
                <p>Runtime: ${movie.runtime} minutes</p>
                <p>Showtime: ${movie.showtime}</p>
                <p>Avail<img src="${movie.poster}" alt="${movie.title} Image" width="300">able Tickets: ${availableTickets}</p>
        `;
    }
    // Function to display movie list
    function displayMovieList(movies) {
        let filmsList = document.getElementById('films');
        filmsList.innerHTML = '';
        movies.forEach(function(movie) {
            let listItem = document.createElement('li');
            listItem.textContent = movie.title;
            listItem.addEventListener('click', function() {
                getRequest(`http://localhost:3000/films/${movie.id}`, function(movie) {
                    displayMovieDetails(movie);
                });
            });
            filmsList.appendChild(listItem);
        });
    }

    

     // Function to handle buying ticket
     function buyTicket(movieId, availableTickets) {
        if (availableTickets > 0) {
            fetch(`http://localhost:3000/films/${movieId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ tickets_sold: availableTickets - 1 })
            })
            .then(response => response.json())
            .then(updatedMovie => {
                alert('Ticket purchased successfully!');
                getRequest(`/films`, function(movies) {
                    displayMovieList(movies);
                });
            })
            .catch(error => console.error('Error:', error));
        } else {
            alert('Sorry, this movie is sold out!');
        }
    }
   // Function to handle buying a ticket for a movie
function buyTicket(movieId) {
    fetch(`http://localhost:3000/films/${movieId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ tickets_sold: 1 }) // Assuming buying 1 ticket
    })
      .then(response => response.json())
      .then(data => {
        // Update UI to reflect the purchase
        const availableTickets = data.capacity - data.tickets_sold;
        document.getElementById('ticket-num').textContent = `${availableTickets} remaining tickets`;
        alert('Ticket purchased successfully.');
      })
      .catch(error => console.error('Error buying ticket:', error));
  }
  

    // Get movie details and list of movies on page load
    getRequest('http://localhost:3000/films', function(movies) {
        displayMovieList(movies);
    }); 
});