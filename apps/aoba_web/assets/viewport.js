function isElementInViewport(el) {
    var rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document. documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document. documentElement.clientWidth)
    );
  }


function putElementInViewport(el) {
    var rect = el.getBoundingClientRect();
    let windowWidth = (window.innerWidth || document.documentElement.clientWidth)
    let windowHeight = (window.innerHeight || document.documentElement.clientHeight)
    

    if (rect.top < 0){
        el.style.top = 0
    }
    if (rect.right > windowWidth) {
        el.style.left( -(rect.right - windowWidth) ) + 'px'
    }
    if (rect.bottom > windowHeight) {
        el.style.top = -(rect.bottom - windowHeight) + 'px'
    }
    if (rect.left < 0) {
        el.style.left = -rect.left + 'px'
    }
    

}

export {isElementInViewport, putElementInViewport}