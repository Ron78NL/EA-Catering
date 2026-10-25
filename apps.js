const zoekveld = document.getElementById("zoekveld");
const categorieKeuze = document.getElementById("categorieen");
const aantal = document.getElementById("aantal");
const lijst = document.getElementById("lijst");
const modal = document.getElementById("modal");
const modalTitel = document.getElementById("modalTitel");
const modalVideo = document.getElementById("modalVideo");
const sluitKnop = document.getElementById("sluit");

// Eerste categorie is altijd "Alles"
const alleCategorieen = [{ id: "alle", naam: "Alles" }, ...categorieen];
let actieveCategorie = "alle";

// Zoeken negeert hoofdletters en accenten: "lieren" vindt "Liëren"
const normaliseer = tekst =>
    tekst.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

function toonCategorieen() {
    categorieKeuze.replaceChildren(...alleCategorieen.map(c => {
        const knop = document.createElement("button");
        knop.type = "button";
        knop.textContent = c.naam;
        knop.setAttribute("aria-pressed", String(c.id === actieveCategorie));
        knop.addEventListener("click", () => {
            actieveCategorie = c.id;
            toonCategorieen();
            toonLijst();
        });
        return knop;
    }));
}

function toonLijst() {
    const zoekterm = normaliseer(zoekveld.value.trim());

    const gevonden = videos.filter(v =>
        (actieveCategorie === "alle" || v.categorie === actieveCategorie) &&
        normaliseer(v.titel).includes(zoekterm)
    );

    if (gevonden.length === 0) {
        aantal.textContent = "Geen video's gevonden. Probeer een andere zoekterm.";
    } else if (gevonden.length === 1) {
        aantal.textContent = "1 video";
    } else {
        aantal.textContent = `${gevonden.length} video's`;
    }

    lijst.replaceChildren(...gevonden.map(v => {
        const li = document.createElement("li");
        const knop = document.createElement("button");
        knop.type = "button";
        knop.textContent = v.titel;
        knop.addEventListener("click", () => openVideo(v));
        li.appendChild(knop);
        return li;
    }));
}

function openVideo(video) {
    modalTitel.textContent = video.titel;
    modalVideo.title = video.titel;
    modalVideo.src = `https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0`;
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    sluitKnop.focus();
}

function sluitVideo() {
    modal.hidden = true;
    modalVideo.removeAttribute("src");   // stopt het afspelen
    document.body.style.overflow = "";
}

zoekveld.addEventListener("input", toonLijst);
sluitKnop.addEventListener("click", sluitVideo);
modal.addEventListener("click", e => { if (e.target === modal) sluitVideo(); });
document.addEventListener("keydown", e => {
    if (e.key === "Escape" && !modal.hidden) sluitVideo();
});

toonCategorieen();
toonLijst();
