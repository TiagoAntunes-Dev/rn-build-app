const url = 'https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc';
const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzYTI2ZDU2NDExNzFiYjg5OWE5MDVkZTJkNzY3NGE1OCIsIm5iZiI6MTc5MDE5NzcyOS44MDE5OTk4LCJzdWIiOiI2YWI0M2ZlMWNhOTEyNmU2Y2RhOTIyYmMiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.G6OPAz5vgtJ4t-B2Zu68eJvy0H5kgYBV75gX5b56O88'
  }
};

fetch(url, options)
  .then(res => res.json())
  .then(json => console.log(json))
  .catch(err => console.error(err));