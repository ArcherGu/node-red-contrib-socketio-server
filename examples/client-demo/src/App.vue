<template>
    <div class="chat-demo-content">
        <ChatWithWho
            v-if="!isChatTime"
            @update-opts="updateOpts"
        />

        <ChatDemo
            v-else
            ref="chatDemo"
            @link-error="handleLinkError"
        />
    </div>

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
import { ElMessage } from "element-plus";

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
            chatDemo.value.initChatSocketIO(opts);
        };

        const handleLinkError = () => {
            ElMessage.warning(
                "Failed to connect to the chat room, check the console for error messages!"
            );

            isChatTime.value = false;
        };

        return {
            isChatTime,
            chatDemo,
            updateOpts,
            handleLinkError,
        };
    },
});
</script>

<style lang="scss">
.chat-demo-content {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 1rem;
}

.copyright {
    position: absolute;
    bottom: 10px;
    width: 100%;
    text-align: center;
    a {
        color: #337ab7;
        text-decoration: none;
        font-weight: 700;
    }
}
</style>