const id = new URLSearchParams(document.location.search).get("id") ?? 1,
        datasource = document.querySelector("#datasource");

datasource.addEventListener('load', () => {
    document.dispatchEvent(new Event('data-loaded'));
});

datasource.src = `data/${id}.js`;