<template>
    <p>{{content}}</p>
</template>

<script>
export default {

    props: {
        threadID: Number,
        postID: Number,
        entryID: Number,
        content: String
    },
}
</script>

<style lang="scss">

</style>