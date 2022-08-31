let page = 1;
async function loadPage () {
    page++
    let data = await window.gogo.newEpisodes(page)
    // remove button
    document.getElementById("searchdiv").remove();
    data.forEach(item => {
        let url = "/view?q=" + item.url.replace("/", "")
        let div = document.createElement("div");
        let title = item.url.replace("/category/", "").replace("/", "");
        let episode = item.url.split("-episode-")[1]
        let anime = "/anime?q=" + item.url.split("-episode-")[0].replace("/", "")
        div.innerHTML = `
				<img referrerpolicy="no-referrer" src="${item.image}" style="width:100px;height:145px;">
                <h3><a href="${url}">${item.title} Episode ${episode}</a><a href="${anime}"><i class="fa-solid fa-eye eye-button"></i></a></h3>
                `;
        div.setAttribute("onclick", "");
        document.getElementById("searchres").appendChild(div);
    });
    // append button
    let div = document.createElement("div");
    div.id = "searchdiv";
    div.innerHTML = `
            <button onclick="loadPage()" style="width: 100%; height: 100%;">More</button>
            `;
    document.getElementById("searchres").appendChild(div);
}
