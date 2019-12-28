function scriptLoaderFromArray(arr) {
    const body = document.body;
    arr.forEach(url => {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.url = url;
        body.appendChild(script);
    });
};