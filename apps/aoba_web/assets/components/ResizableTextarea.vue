// https://github.com/lorisleiva/vue-lab/tree/master/components/resizable-textarea
<template>
    <textarea rows="1" class="resize-none outline-0 h-full" 
      placeholder="Write something..." @keydown.ctrl.enter="close"
      @focus="aobaOnFocus"
      @blur="aobaOnBlur"
    ></textarea>
</template>


<script>

export default {

    props: ['id'],



    data() {
        return {
            maxWidth: 0,
            interval: null,
            charCount: 0
        }
    },


    methods: {

        resizeTextarea (event) {
            
            if (event.target.scrollWidth < this.maxWidth){
                
                event.target.style.width = 'auto'
                event.target.style.width = event.target.scrollWidth + 'px'
                
            }
            else{
                
                event.target.style.whiteSpace = "pre-line"
                event.target.style.width = this.maxWidth + 'px'
            }

            // Reset the textarea height to auto in order to shrink back to its default size.

            event.target.style.height = 'auto'
            event.target.style.height = (event.target.scrollHeight) + 'px'
            
            
        },

        close(event) {
            alert(this.id)
            this.$emit('close', event)
        },

        push(){
            var currentCharCount = this.$el.value.length
            if (currentCharCount > this.charCount) {
                console.log('id '+ this.id + ' push')
                this.charCount = currentCharCount
            }


        },

        aobaOnFocus: function () {
            this.interval = setInterval(
                this.push,
                5000
            );
        
        },

        aobaOnBlur () {
            clearInterval(this.interval)
            this.interval = null
        }


    },
    mounted () {
        this.$nextTick(() => {
            this.$el.setAttribute('style', 'width:' + (this.$el.scrollWidth) + 'px;')
            
        })
        this.maxWidth = Math.min(
            700,
            window.innerWidth-200
        )

        this.$el.addEventListener('input', this.resizeTextarea)
    },
    beforeDestroy () {
        this.$el.removeEventListener('input', this.resizeTextarea)
    },
    render () {
        return this.$slots.default[0]
    },
}




</script>


<style scoped lang="scss">
    textarea {
        display: block;
        overflow-y: hidden;
        overflow-x: hidden;
        resize: none;
        vertical-align: baseline;
        outline: none;
        white-space: nowrap;

    }
</style>