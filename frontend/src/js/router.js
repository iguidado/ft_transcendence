async function fetchHTMLContent(url) {
    try {
        url = `./fragments/${url}.html`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const htmlContent = await response.text();
        // console.log(htmlContent); // Affiche le contenu HTML dans la console
        return htmlContent;
    } catch (error) {
        console.error('Erreur lors de la récupération du fichier HTML:', error);
    }
}

function load_page(url) {
    fetchHTMLContent(url).then(htmlContent => {
        document.getElementById('app').innerHTML = htmlContent;
    if (url === 'pong') loadGame();
    });
}