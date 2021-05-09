<template>
    <ChatWithWho
        v-if="!isChatTime"
        @update-opts="updateOpts"
    />

    <ChatDemo
        v-else
        ref="chatDemo"
    />

    <div class="copyright">
        Chat Demo with <a
            href="https://socket.io/docs/v4/client-installation/"
            target="_BLANK"
        >Socket.IO Client</a>
        ©2021 - Present
        <a
            href="https://github.com/ArcherGu"
            target="_BLANK"
        >Archer Gu</a>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, nextTick } from "vue";
import ChatWithWho from "./components/ChatWithWho.vue";
import ChatDemo from "./components/ChatDemo.vue";

export default defineComponent({
    name: "App",
    components: {
        ChatWithWho,
        ChatDemo,
    },
    props: {},
    setup(props) {
        const isChatTime = ref(false);
        const chatDemo = ref<any>(null);

        const updateOpts = async (opts: { [key: string]: string }) => {
            isChatTime.value = true;
            await nextTick();
            chatDemo.value.initChatDemo(opts);
        };

        return {
            isChatTime,
            chatDemo,
            updateOpts,
        };
    },
});
</script>

<style lang="scss">
#app {
    display: flex;
    height: 100vh;
    justify-content: center;
    align-items: center;
    padding: 0 1rem;
}

.copyright {
    position: absolute;
    bottom: 2vh;
    a {
        color: #337ab7;
        text-decoration: none;
        font-weight: 700;
    }
}
</style>