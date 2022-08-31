var finished = false
var datatitle
function openEpisode (iurl) {
    let url = `/view?q=${iurl}`;
    location = url;
}
var interval = setInterval(async function () {
    if (window.gogo == undefined) return
    if (finished == true) return
    clearInterval(interval)
    let params = new URLSearchParams(window.location.search);
    var url = "/category/" + params.get("q")
    var data = await window.gogo.get(url)
    var title = params.get("q")
    var image = await window.gogo.getImage(url)
    var episodes = data.episodes
    datatitle = data.title
    let genrecombined = data.genres.join(", ")
    console.log(data)
    finished = true
    let globalCurrentEpisode = 0
    for (let i = 1; i <= episodes; i++) {
        const episode = i;
        let div = document.createElement("div");
        let url = `${title}-episode-${i}`
        div.setAttribute("onclick", `openEpisode("${url}")`);
        div.innerHTML = `<a href="/view?q=${url}">Episode ${i}</a>`;
        document.querySelector(".regular").appendChild(div);
    }
	document.head.innerHTML += `
			<title>${data.title} | NekoWatch</title>
		<meta property="og:title" content="${data.title} | NekoWatch" />
		<meta name="description" content="${data.description}" />
		<meta property="og:description" content="${data.description}" />
		<meta property="og:image" content="${image}" />
		<meta property="twitter:title" content="${data.title}" />
	`
    async function podarok () {
        if (!localStorage.nekowatchtoken) return
        let item = await itemInfoName(datatitle);
        console.log(item)
        if (item) {
            let div = document.createElement("div");
            let container = document.querySelector(".anime-info-right")
            div.innerHTML = `
		<h3>Status: <span id="item-status-front"><b>${item.state}</b></span></h3>
		<h4>Current episode: <span id="item-episode-front"><b style="font-size:20px;">${item.currentEpisode}</b></span></h4>
		<button onclick="editInformationStart()" id="item-edit-front">Edit stored information</button>
		`
            globalCurrentEpisode = item.currentEpisode
            container.appendChild(div);
        } else {
            let container = document.querySelector(".anime-info-right")
            let btn = document.createElement("button");
            btn.innerHTML = "Add to tracker";
            btn.setAttribute("onclick", `addItemExtra()`);
            container.appendChild(btn);
        }
        let div = document.createElement("div");
        let container = document.querySelector(".anime-info-right")
        div.innerHTML = `<button style="padding-left: 20px;padding-right:20px;margin-top: 10px;" onclick="seeMore()">More Information</button>`
        container.appendChild(div);
    }
    podarok()


    function seeMore () {
        window.location.href = "/more?query=" + datatitle
    }
    document.querySelector(".anime-info-right").innerHTML = `
    <h1>${data.title}</h1>
    <p><b>Description: </b>${data.description}</p>
    <p><b>Date: </b>${data.date}</p>
    <p><b>Genres: </b>${genrecombined}</p>
    <p><b>Alt: </b>${data.alternative}</p>
    `
    document.querySelector("#img-src").src = image
}, 100);

async function addItemExtra () {
    await addItem(datatitle, document.getElementById('img-src').src, "0")
    location.reload()
}

async function editInformationStart () {
    let statusFront = document.getElementById("item-status-front")
    let episodeFront = document.getElementById("item-episode-front")
    let editFront = document.getElementById("item-edit-front")
    let item = await itemInfoName(datatitle);
    statusFront.innerHTML = `
<select id="item-status-select">
    <option value="watching" ${item.state == "watching" ? "selected" : ""}>Watching</option>
    <option value="planing" ${item.state == "planing" ? "selected" : ""}>Planning to watch</option>
    <option value="finished" ${item.state == "finished" ? "selected" : ""}>Finished</option>
    <option value="dropped" ${item.state == "dropped" ? "selected" : ""}>Dropped</option>
    <option value="undecided" ${item.state == "undecided" ? "selected" : ""}>Undecided</option>
</select>
`
    episodeFront.innerHTML = `
<input type="number" id="item-episode-input" value="${globalCurrentEpisode}" style="width: 100px">
`
    editFront.textContent = "Save changes"
    editFront.setAttribute("onclick", `editInformationFinish()`);
}

async function editInformationFinish () {
    let statusFront = document.getElementById("item-status-select")
    let episodeFront = document.getElementById("item-episode-input")

    if (!localStorage.nekowatchtoken) return
    let item = await itemInfoName(datatitle);
    if (item) {
        let checkState = item.state == statusFront.value ? false : statusFront.value
        let checkEpisode = item.currentEpisode == episodeFront.value ? false : episodeFront.value
        if (checkState != false) await editStatus(datatitle, checkState)
        if (checkEpisode != false) await editItem(checkEpisode, datatitle)
        if (checkEpisode || checkState) location.reload()
    } else {
        return alert("no item found?? report to koneko on github (check out home page extras for that)")
    }
}
