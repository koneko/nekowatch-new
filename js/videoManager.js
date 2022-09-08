var finished = false
function changeSource (src) {
    let main = document.getElementById("main-video");
    main.src = src;
}
var interval = setInterval(async function () {
    if (typeof window.gogo == 'undefined') return;
    if (finished == true) return
    clearInterval(interval)
    let scraper = window.gogo
    var title, url, videos, data, image, number, episodes, datatitle, max
    let params = new URLSearchParams(window.location.search)
    var q = params.get('q')
    title = q.split("-episode")[0]
    url = "/category/" + title
    videos = await window.gogo.getSources("/" + q)
    data = await window.gogo.get(url)
    image = await window.gogo.getImage(url)
    number = q.split("episode-")[1]

    if (videos.length == 0) {
        data = await scraper.get(url);
        image = await scraper.getImage(url);
        let trytitle = data.title
        //replace all spaces with -
        trytitle = trytitle.replace(/\s+/g, "-");
        //replace all uppercase with lowercase
        trytitle = trytitle.toLowerCase();
        trytitle = trytitle + "-episode-" + number
        // console.log("trytitle " + trytitle)
        videos = await scraper.getSources("/" + trytitle)
    }
    max = data.episodes
    episodes = data.episodes
    datatitle = data.title
    finished = true
    console.log(finished)
    var container = document.getElementById("ep-cont");
    container.innerHTML = `<iframe id="main-video" src='${videos[0]}' scrolling='no' frameborder='0' id="player-iframe" width='770px;' height='442px;' allowfullscreen='true' webkitallowfullscreen='true' mozallowfullscreen='true'></iframe>`;
    let controls = document.querySelector(".episode-controls");
    var sources = document.createElement("div")
    document.querySelector(".content").appendChild(document.createElement("br"))
    document.querySelector(".content").appendChild(sources);
    sources.style.textAlign = "center";
    sources.style.padding = "10px"
    sources.className = "episode-sources";
    if (number > 1) {
        let a = document.createElement("a");
        a.innerHTML = `<i class="fa-solid fa-arrow-left"></i>`;
        a.href = "/view?q=" + title + "-episode-" + (+number + -1);
        controls.appendChild(a);
    }
    let b = document.createElement("a");
    b.textContent = "All Episodes";
    b.href = "/anime?q=" + title;
    controls.appendChild(b);
    if (number != max) {
        let c = document.createElement("a");
        c.innerHTML = `<i class="fa-solid fa-arrow-right"></i>`;
        c.href = "/view?q=" + title + "-episode-" + (+number + 1);
        controls.appendChild(c);
    }

    let i = 1;
    videos.forEach(element => {
        if (i > videos.length) return;
        let a = document.createElement("a");
        a.innerHTML = `Source ${i}`;
        a.id = "source-element"
        a.href = "#";
        a.setAttribute("onclick", `changeSource('${element}')`);
        sources.appendChild(a);
        i++
    });

    async function hohol () {
        if (!localStorage.nekowatchtoken) return
        let res = await editItem(number, datatitle)
        if (res == false) return
    }
    hohol()
    document.getElementById("bigboytitlethingy").innerHTML = `${data.title} Episode <span id="blocker">${number}</span>`
    document.getElementById("theimage").src = image
    document.head.innerHTML += `
    <meta property="og:title" content="${data.title}" />
    <meta name="og:description" content="${data.title} Episode ${number} on NekoWatch." />
    <meta property="og:image" content="${image}" />
    <meta property="twitter:title" content="${data.title}" />
    <title>Episode ${number} of ${data.title} | NekoWatch</title>
    `
}, 100);
