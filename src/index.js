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
        let movieDetailsDiv = document.getElementById('movieDetails');
        let availableTickets = movie.capacity - movie.tickets_sold;
        let buyButton = `<button onclick="buyTicket(${movie.id}, ${availableTickets})" ${availableTickets === 0 ? 'disabled' : ''}>${availableTickets === 0 ? 'Sold Out' : 'Buy Ticket'}</button>`;
        movieDetailsDiv.innerHTML = `
            <div>
                <img src="${movie.poster}" alt="${movie.title}" width="200">
                <h2>${movie.title}</h2>
                <p>Runtime: ${movie.runtime} minutes</p>
                <p>Showtime: ${movie.showtime}</p>
                <p>Available Tickets: ${availableTickets}</p>
                ${buyButton}
            </div>
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
                getRequest(`/films/${movie.id}`, function(movie) {
                    displayMovieDetails(movie);
                });
            });
            filmsList.appendChild(listItem);
        });
    }

    // Function to handle buying ticket
    function buyTicket(movieId, availableTickets) {
        if (availableTickets > 0) {
            fetch(`/films/${movieId}`, {
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

    // Get movie details and list of movies on page load
    getRequest('/films', function(movies) {
        displayMovieList(movies);
    });
});