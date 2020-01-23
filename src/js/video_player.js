(function() {
    const videoItems = document.getElementsByClassName('bizday_videos_items');
    videoItems[0].children.forEach(element => {
        element.addEventListener('click', (event) => {
            videoItems[0].children.forEach(element => {
                element.classList.remove('bizday_videos_item--active');
            })
            event.currentTarget.classList.add('bizday_videos_item--active');
        })        
    });
})()