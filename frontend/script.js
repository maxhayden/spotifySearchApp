async function getRecomendations() {
    const artist = document.getElementById("artist").value;
    if (!artist) {
        alert("Please enter an artist name.");
        return;
    }
    const response = await fetch(`/api/recommendation?artist=${artist}`);
    const { data } = await response.json();

    console.log(data);
    
    if (data.error) {
        document.getElementById("search-results").innerHTML = `<p>${data.error}</p>`;
    } else {
        document.getElementById("results").classList.remove("d-none");
        document.getElementById("search-results").innerHTML = `
                <img src="${data[0].images[0].url}" class="card-img-top square-image"
                    alt="...">
                <div class="card-body">
                    <h5 class="card-title" id="artist_name">${data[0].name}</h5>
                    <p class="card-text" id="artist_bio">Genres: ${data[0].genres.toString()}</p>
                    <a href="${data[0].external_urls.spotify}" class="btn btn-success">Spotify
                        Link</a>
                </div>`;

        document.getElementById("recomendations").innerHTML = '<h3 class="col-12 p-0">Similar Artists</h3>';
        for (let i = 1; i<data.length; i++){
            document.getElementById("recomendations").innerHTML+= `
                <div class="card  col-3 h-75">
                    <img src="${data[i].images[0].url}" class="card-img-to square-image"
                        alt="...">
                    <div class="card-body">
                        <h5 class="card-title" id="artist_name">${data[i].name}</h5>
                        <p class="card-text" id="artist_bio">Genres: ${data[i].genres.toString()}</p>
                        <a href="${data[i].external_urls.spotify}" class="btn btn-success">Spotify Link</a>
                    </div>
                </div>`;
        }
    }
}