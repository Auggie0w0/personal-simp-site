const track = document.getElementById("image-track")

window.onmousedown = e => {
    track.dataset.mouseDownAt = e.clientX;
}

window.onmouseup = () => {
    track.dataset.mouseDownAt = "0";
    track.dataset.prevPercentage = track.dataset.percentage;
}

window.onmousemove = e => {
    if(track.dataset.mouseDownAt === "0") return;
    const mouseDelta = parseFloat(track.dataset.mouseDownAt) - e.clientX,
        maxDelta = window.innerWidth / 2;
    const percentage = (mouseDelta / maxDelta) * -100,
    nextPercentage = parseFloat(track.dataset.prevPercentage) + percentage; 
    track.dataset.percentage = nextPercentage;
    const limitedNextPercentage = Math.min(0, Math.max(nextPercentage, -100));
    track.dataset.percentage = limitedNextPercentage;

    track.animate({
        transform:  `translate(${nextPercentage}%,-50%)`
    }, {duration: 1200, fill:"forwards"});
    
    for(const image of track.getElementsByClassName("image")) {
        image.animate({
            objecPosition: `${100 + nextPercentage}% center`
        }, {duration:1200, fill:"forwards"});
    }
}