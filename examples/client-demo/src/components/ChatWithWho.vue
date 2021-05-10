<template>
    <el-card class="chat-with-who">
        <div class="title">
            Your name
        </div>
        <el-input
            v-model="you"
            class="demo-input"
            placeholder="An imaginary you, such as Tom"
        />

        <div class="title">
            Who do you want to chat with?
        </div>

        <el-input
            v-model="friend"
            class="demo-input"
            placeholder="An imaginary friend, such as Jerry"
        />

        <div class="title">
            Server address
        </div>
        <el-input
            v-model="address"
            class="demo-input"
            placeholder="Socket.io server address"
        />

        <el-button
            class="ok-btn"
            type="primary"
            @click="handleOk"
        >
            Let's Chat!
        </el-button>
    </el-card>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from "vue";
import { ElMessage } from "element-plus";

export default defineComponent({
    name: "ChatWithWho",
    emits: ["update-opts"],
    components: {},
    props: {},
    setup(props, { emit }) {
        const state = reactive({
            you: "",
            friend: "",
            address: "http://127.0.0.1:3000/",
        });

        const handleOk = () => {
            if (!state.you || !state.friend || !state.address) {
                ElMessage.warning("Please fill in the full information!");
                return;
            }

            emit("update-opts", { ...state });
        };

        return {
            ...toRefs(state),
            handleOk,
        };
    },
});
</script>

<style lang="scss">
.chat-with-who {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;

    .title {
        font-size: 1.5rem;
        font-weight: 600;
        margin-bottom: 1rem;
    }

    .demo-input {
        margin-bottom: 1.5rem;
        .el-input__inner {
            font-family: Dosis, Lato, sans-serif;
        }
    }

    .ok-btn {
        font-family: Dosis, Lato, sans-serif;
    }
}
</style>