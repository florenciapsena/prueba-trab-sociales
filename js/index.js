
const shareButton = document.querySelector('.share-button');
const toggleSocials = () => {
    const socialsWrapper = document.querySelector('.socials-wrapper')
    const shareButtonImage = shareButton.querySelector('img')
    
    socialsWrapper.classList.toggle('active')

    if (shareButtonImage.src.includes('close')) {
        shareButtonImage.src = 'img/chat.svg';
    } else {
        shareButtonImage.src = 'img/close.svg';
    }
}

shareButton.addEventListener('click', toggleSocials);

document.addEventListener("DOMContentLoaded", function() {
    var menuIcon = document.getElementById("hamburger");
    var sidebar = document.getElementById('sidebar');
  
    menuIcon.addEventListener('click', function(e) {
        menuIcon.classList.toggle("open");
        sidebar.classList.toggle("active");
    });
  });
