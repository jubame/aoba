function isElementInViewport(el) {
    var rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document. documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document. documentElement.clientWidth)
    );
  }


function putElementInViewport(el, relativeTo) {
    var rect = el.getBoundingClientRect();
    var content = relativeTo.getBoundingClientRect();
    //let windowWidth = (window.innerWidth || document.documentElement.clientWidth)
    //let windowHeight = (window.innerHeight || document.documentElement.clientHeight)
    

    if (rect.top < content.top){
        el.style.top = 0
    }
    if (rect.right > content.right) {
        el.style.left( -(rect.right - content.right) ) + 'px'
    }
    if (rect.bottom > content.bottom) {
        el.style.top = -(rect.bottom - content.bottom) + 'px'
    }
    if (rect.left < content.left) {
        el.style.left = -rect.left + 'px'
    }
    

}

export {isElementInViewport, putElementInViewport}