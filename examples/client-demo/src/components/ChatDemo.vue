<template>
    <div class="chat-demo">

    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: "ChatDemo",
    components: {},
    props: {},
    setup(props) {
        const initChatDemo = (opts: { [key: string]: string }) => {
            console.log(opts);
        };

        return {
            initChatDemo,
        };
    },
});
</script>

<style>
</style>