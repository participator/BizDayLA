(function() {
    const activeClass = 'bizday_videos_item--active';
    const videoItems = document.getElementsByClassName('bizday_videos_items')[0];

    videoItems.children.forEach(element => {
        element.addEventListener('click', (event) => {
            videoItems.children.forEach(element => {
                element.classList.remove(activeClass);
            })
            event.currentTarget.classList.add(activeClass);
        })        
    });

    window.onload = function() {
        const videoPlayerViewer = document.getElementsByClassName('bizday_videos_player_viewer')[0];

        const initialVideoUrl = videoPlayerViewer.src;

        videoItems.children.forEach(element => {
            if ( element.href === initialVideoUrl ) {
                element.classList.add(activeClass);
            }
        })
    }
})()