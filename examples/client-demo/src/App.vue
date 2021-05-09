<template>
    <ChatWithWho
        v-if="!friend"
        @update-friend="updateFriend"
    />
    <ChatDemo
        v-else
        :who="friend"
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
import { defineComponent, reactive, toRefs } from "vue";
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
        const state = reactive({
            friend: null as null | string,
        });

        const updateFriend = (who: string) => {
            state.friend = who;
        };

        return {
            ...toRefs(state),
            updateFriend,
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