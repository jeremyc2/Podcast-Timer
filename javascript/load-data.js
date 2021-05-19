// TODO Refactor to use fetch JSON 
, and maybe get rid of this file completely

const id = new URLSearchParams(document.location.search).get("id") ?? defaultId,
        datasource = document.querySelector("#datasource");

datasource.addEventListener('load', () => {
    document.dispatchEvent(new Event('data-loaded'));
});

datasource.src = `data/main/${id}.js`;