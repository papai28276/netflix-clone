let allMovies = [];
let currentGenre = 'All';
let currentMovie = null;

document.querySelector('.movie-row').innerHTML = `
  <div class="skeleton-loader">
    <div class="skeleton-card"></div>
    <div class="skeleton-card"></div>
    <div class="skeleton-card"></div>
    <div class="skeleton-card"></div>
  </div>
`;

window.onload = () => {
  fetch('movies.json')
    .then(res => res.json())
    .then(data => {
      allMovies = data;
      renderMovies(data);
    });
};

function renderMovies(movies) {
  const row = document.querySelector('.movie-row');
let isDown = false;
let startX;
let scrollLeft;

row.addEventListener('mousedown', (e) => {
  isDown = true;
  row.classList.add('active');
  startX = e.pageX - row.offsetLeft;
  scrollLeft = row.scrollLeft;
});

row.addEventListener('mouseleave', () => {
  isDown = false;
  row.classList.remove('active');
});

row.addEventListener('mouseup', () => {
  isDown = false;
  row.classList.remove('active');
});

row.addEventListener('mousemove', (e) => {
  if (!isDown) return;
  e.preventDefault();
  const x = e.pageX - row.offsetLeft;
  const walk = (x - startX) * 2;
  row.scrollLeft = scrollLeft - walk;
});

  row.innerHTML = '';

  movies.forEach(movie => {
    if (currentGenre === 'All' || movie.genre === currentGenre) {
      const card = document.createElement('div');
      card.className = 'movie-card';
      card.setAttribute('data-title', movie.title);

      const isHovered = `
        <video muted loop class="trailer-preview">
          <source src="${movie.trailer}" type="video/mp4">
        </video>`;

      const ratingStars = '⭐'.repeat(Math.round(movie.rating));

      card.innerHTML = `
        <div class="card-img">
          <img src="${movie.img}" alt="${movie.title}" />
          ${isHovered}
        </div>
        <div class="card-info">
          <h3>${movie.title}</h3>
          <p>${ratingStars} (${movie.rating})</p>
          <p>${movie.views.toLocaleString()} views</p>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${movie.progress}%"></div>
          </div>
        </div>
      `;

      // Hover trailer
      card.addEventListener('mouseenter', () => {
        card.querySelector('video').play();
      });
      card.addEventListener('mouseleave', () => {
        const vid = card.querySelector('video');
        vid.pause();
        vid.currentTime = 0;
      });

      card.onclick = () => openModal(movie);
      row.appendChild(card);
    }
  });
}


function openModal(movie) {
  currentMovie = movie;
  document.getElementById('modalTitle').innerText = movie.title;
  document.getElementById('modalTrailer').src = movie.trailer;
  document.getElementById('movieModal').style.display = 'flex';
}

function closeModal() {
  document.getElementById('movieModal').style.display = 'none';
  document.getElementById('modalTrailer').src = ''; // stop video
}

function toggleFavorite() {
  if (!currentMovie) return;
  const list = JSON.parse(localStorage.getItem('myList')) || [];
  const exists = list.find(item => item.title === currentMovie.title);
  if (!exists) {
    list.push(currentMovie);
    alert(`${currentMovie.title} added to My List`);
  } else {
    alert(`${currentMovie.title} is already in your list`);
  }
  localStorage.setItem('myList', JSON.stringify(list));
}

function filterByGenre(genre) {
  currentGenre = genre;
  renderMovies(allMovies);
}

document.getElementById('searchInput').addEventListener('input', function (e) {
  const searchValue = e.target.value.toLowerCase();
  const cards = document.querySelectorAll('.movie-card');

  cards.forEach(card => {
    const title = card.getAttribute('data-title').toLowerCase();
    card.style.display = title.includes(searchValue) ? 'block' : 'none';
  });
});

document.getElementById('themeToggle').addEventListener('click', () => {
  document.body.classList.toggle('light');
});


