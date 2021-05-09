<template>
    <div class="chat-demo">

    </div>
</template>

<script lang="ts">
import { defineComponent, PropType, watch } from "vue";

export default defineComponent({
    name: "ChatDemo",
    components: {},
    props: {
        who: {
            type: Object as PropType<null | string>,
            default: () => null,
        },
    },
    setup(props) {
        const initChatDemo = () => {
            console.log(props.who);
        };

        watch(() => props.who, initChatDemo);
    },
});
</script>

<style>
</style>