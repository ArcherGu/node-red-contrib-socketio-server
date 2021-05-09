<template>
    <el-card class="chat-demo">
        <div class="chat-window">

        </div>

        <div class="chat-input">
            <el-input
                v-model="message"
                placeholder="message..."
            >
                <template #append>
                    <el-button
                        icon="el-icon-chat-dot-round"
                        class="send-btn"
                    ></el-button>
                </template>
            </el-input>
        </div>
    </el-card>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from "vue";

export default defineComponent({
    name: "ChatDemo",
    components: {},
    props: {},
    setup(props) {
        const state = reactive({
            history: [] as any[],
            message: "",
        });

        const initChatDemo = (opts: { [key: string]: string }) => {
            console.log(opts);
        };

        return {
            ...toRefs(state),
            initChatDemo,
        };
    },
});
</script>

<style lang="scss">
.chat-demo {
    height: 50vh;
    min-width: 50vw;

    .el-card__body {
        height: 100%;

        .chat-window {
            height: 80%;
            border-bottom: 1px solid #ebeef5;
        }

        .chat-input {
            height: 20%;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 0 1rem;

            .send-btn {
                background-color: #409eff;
                border-top-left-radius: 0px;
                border-bottom-left-radius: 0px;
                color: #fff;
                border-color: #409eff;
            }

            .send-btn:hover {
                background: #66b1ff;
                border-color: #66b1ff;
                color: #fff;
            }
            .send-btn:active {
                background: #3a8ee6;
                border-color: #3a8ee6;
                color: #fff;
            }
        }
    }

    .el-card__header,
    .el-card__body {
        padding: 0px;
    }
}
</style>