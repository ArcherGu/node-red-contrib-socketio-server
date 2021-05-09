<template>
    <el-card class="chat-with-who">
        <div class="title">
            Who do you want to chat with?
        </div>

        <el-input
            v-model="who"
            class="input-name"
            placeholder="An imaginary friend, such as Bob"
        />

        <el-button
            class="ok-btn"
            type="primary"
        >
            Let's Chat!
        </el-button>
    </el-card>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
    name: "ChatWithWho",
    emits: ["update-friend"],
    components: {},
    props: {},
    setup(props, { emit }) {
        const who = ref("");

        const handleOk = () => {
            emit("update-friend", who);
        };

        return {
            who,
            handleOk,
        };
    },
});
</script>

<style lang="scss">
.chat-with-who {
    height: 30vh;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;

    .title {
        font-size: 1.5rem;
        font-weight: 600;
        margin-bottom: 2rem;
    }

    .input-name {
        margin-bottom: 2rem;
        .el-input__inner {
            font-family: Dosis, Lato, sans-serif;
        }
    }

    .ok-btn {
        font-family: Dosis, Lato, sans-serif;
    }
}
</style>