import Vue from 'vue'


// https://medium.com/@Aenon/javascript-helper-functions-for-implementing-data-structures-a60117c1d17a
const Drag = () => {
    // https://jsfiddle.net/tovic/Xcb8d/
    /*
     * Estas variables están en un closure y las funciones de abajo
     * (_drag_init, _move_elem y _drag_destroy) tienen acceso a ellas.
     * Recuerda: no es que tengan una copia de la variable, tienen acceso al
     * contexto, a las propias variables, si una función las cambia las demás
     * verán dicho cambio.
     */

    let selected = null, // Object of the element to be moved
        x_pos = 0, y_pos = 0, // Stores x & y coordinates of the mouse pointer
        x_elem = 0, y_elem = 0; // Stores top, left values (edge) of the element

    console.log('HOLA')
    console.log(this)
    // Will be called when user starts dragging an element
    const _drag_init = (ev) => {
        // Store the object of the element which needs to be moved
        selected = ev.target;
        /* En el ejemplo https://jsfiddle.net/tovic/Xcb8d/ mousemove
         * tiene eventListener desde el principio, así que x_pos e
         * y_pos ya tienen el valor del puntero cuando hacemos mousedown.
         * Mi caso es diferente porque añado addEventListener
         * de mousemove dentro del mousedown, así que necesito obtener la
         * posición del puntero aquí también.
         * El ejemplo sólo tenía mousemove sobre el elemento, en mi
         * caso el Post. Si movía el ratón muy rápido se salía de aquél y 
         * dejaba de arrastrar, así que lo pongo para todo el window. Al hacer
         * _drag_destroy lo elimino para que no llamar a esta función
         * inútilmente una vez termine de arrastrar.
         */
        x_pos = document.all ? window.event.clientX : ev.pageX;
        y_pos = document.all ? window.event.clientY : ev.pageY;
        x_elem = x_pos - selected.offsetLeft;
        y_elem = y_pos - selected.offsetTop;
        /* Por si luego en CSS utilizo right y/o bottom para la posición
         * inicial.Debo setear inmediatamente left y top después para
         * evitar que se mueva a su posición por defecto cuando no
         * tiene ni right ni bottom ni left ni top.
         */
        selected.style.right = 'auto';
        selected.style.bottom = 'auto';
        if (selected !== null) {
            selected.style.left = (x_pos- x_elem) + 'px';
            selected.style.top = (y_pos - y_elem) + 'px';
        }    

        window.addEventListener("mousemove", _move_elem);
        window.addEventListener("mouseup", _drag_destroy);
    }

    // Will be called when user dragging an element
    const _move_elem = (ev) => {
        console.log('MOVE')
        x_pos = document.all ? window.event.clientX : ev.pageX;
        y_pos = document.all ? window.event.clientY : ev.pageY;
        if (selected !== null) {
            selected.style.left = (x_pos- x_elem) + 'px';
            selected.style.top = (y_pos - y_elem) + 'px';
        }
    }
    
    // Destroy the object when we are done
    const _drag_destroy = () => {
        selected = null;
        window.removeEventListener("mousemove", _move_elem);
        window.removeEventListener("mouseup", _drag_destroy);
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