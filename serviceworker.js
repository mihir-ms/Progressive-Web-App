const staticFiles = [
    './',
    './style.css',
    './app.js',
    './index.html'
];

// On installing the app, first time, cache all the staticFiles =>
self.addEventListener("install", (e) => {
    console.log("[Service Worker] Installed");
    // wait untill event is complete =>
    e.waitUntil(
        caches.open("staticCache").then((cache) => {
            console.log("Caching static files")
            cache.addAll(staticFiles);
        })
    )
})

// On fetching some data from app =>
self.addEventListener("fetch", (e) => {
    console.log("[Service Worker] Fetch", e.request.url);
    var dictUrl = "https://dictionaryapi.com/api/v3/references/learners/json/";

    // If >-1, ie. the URL is present in the request, ie. request successful and WE ARE ONLINE =>
    if(e.request.url.indexOf(dictUrl) > -1){
        e.respondWith(
            // open dynamicCache =>
            caches.open("dynamicCache").then((cache) => {
                // fetch data from URL =>
                return fetch(e.request).then((res) => {
                    // cache the data fetched =>
                    cache.put(e.request.url, res.clone());
                    // return the data =>
                    return res;
                })
            })
        )
    }
    // ELSE, WE ARE OFFLINE, fetch data from cache, or try to fetch it.
    else{
        e.respondWith(
            // Search cache for a match =>
            caches.match(e.request).then((res) => {
                // Return matched result or fetch =>
                return res || fetch(e.request);
            })
        )
    }
})
