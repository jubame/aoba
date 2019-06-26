import Vue from 'vue'


// https://medium.com/@Aenon/javascript-helper-functions-for-implementing-data-structures-a60117c1d17a
const Drag = () => {
// https://jsfiddle.net/tovic/Xcb8d/

    let selected = null, // Object of the element to be moved
        x_pos = 0, y_pos = 0, // Stores x & y coordinates of the mouse pointer
        x_elem = 0, y_elem = 0; // Stores top, left values (edge) of the element

    // Will be called when user starts dragging an element
    function _drag_init(ev) {
        // Store the object of the element which needs to be moved
        selected = ev.target;
        x_elem = x_pos - selected.offsetLeft;
        y_elem = y_pos - selected.offsetTop;
    }

    // Will be called when user dragging an element
    function _move_elem(e) {
        x_pos = document.all ? window.event.clientX : e.pageX;
        y_pos = document.all ? window.event.clientY : e.pageY;
        if (selected !== null) {
            selected.style.left = (window.event.clientX- x_elem) + 'px';
            selected.style.top = (window.event.clientY - y_elem) + 'px';
        }
    }
    
    // Destroy the object when we are done
    function _drag_destroy() {
        selected = null;
    }

    // Bind the functions...
    /*
    document.getElementById('draggable-element').onmousedown = function () {
        _drag_init(this);
        return false;
    };*/

    return {_drag_init, _move_elem, _drag_destroy}

}

// https://forum.vuejs.org/t/how-to-use-helper-functions-for-imported-modules-in-vuejs-vue-template/6266/7
const dragPlugin = {
	install (Vue, options) {
		Vue.prototype.$Drag = Drag; // we use $ because it's the Vue convention
	}
};


export default dragPlugin