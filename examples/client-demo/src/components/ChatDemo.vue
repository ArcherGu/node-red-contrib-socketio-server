<template>
    <el-card class="chat-demo">
        <div class="chat-title">
            Chat with {{ opts?.friend }}
        </div>
        <div
            class="chat-window"
            ref="chatWindow"
        >
            <template v-for="item in history">
                <div
                    v-if="isSendMsg(item.person)"
                    class="history-send"
                >
                    <div class="message-text">
                        {{ item.msg }}
                    </div>

                    <img
                        class="avatar"
                        src="../assets/jerry.png"
                    />
                </div>
                <div
                    v-else
                    class="history-receive"
                >
                    <img
                        class="avatar"
                        src="../assets/tom.png"
                    />

                    <div class="message-text">
                        {{ item.msg }}
                    </div>
                </div>
            </template>
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
                        @click="sendMsg"
                    ></el-button>
                </template>
            </el-input>
        </div>
    </el-card>
</template>

<script lang="ts">
import { ElMessage } from "element-plus";
import { defineComponent, reactive, ref, toRefs, nextTick } from "vue";

interface HistoryItem {
    person: string;
    msg: string;
    time: string;
}

export default defineComponent({
    name: "ChatDemo",
    components: {},
    props: {},
    setup(props) {
        const chatWindow = ref<any>(null);

        const state = reactive({
            history: [] as HistoryItem[],
            message: "",
            opts: null as null | { [key: string]: string },
        });

        const initChatDemo = (opts: { [key: string]: string }) => {
            state.opts = { ...opts };
        };

        const isSendMsg = (person: string) => {
            return person == state.opts?.you;
        };

        let isYou = true;
        const sendMsg = async () => {
            if (!state.message.trim()) {
                state.message = "";
                ElMessage.warning("Please enter the message!");
                return;
            }

            if (isYou) {
                state.history.push({
                    person: state.opts!.you,
                    msg: state.message,
                    time: Date.now().toString(),
                });
            } else {
                state.history.push({
                    person: state.opts!.friend,
                    msg: state.message,
                    time: Date.now().toString(),
                });
            }

            isYou = !isYou;
            state.message = "";
            await nextTick();
            chatWindow.value.scrollTop = chatWindow.value.scrollHeight;
        };

        return {
            ...toRefs(state),
            chatWindow,
            initChatDemo,
            isSendMsg,
            sendMsg,
        };
    },
});
</script>

<style lang="scss">
.chat-demo {
    height: 450px;
    min-width: 90vw;
    @media (min-width: 768px) {
        min-width: 50vw;
    }

    .el-card__body {
        height: 100%;

        .chat-title {
            height: 10%;
            border-bottom: 1px solid #ebeef5;
            display: flex;
            align-items: center;
            padding-left: 30px;
            position: relative;

            &::before {
                content: "";
                position: absolute;
                width: 12px;
                height: 12px;
                background: #67c23a;
                border-radius: 50%;
                left: 10px;
            }
        }

        .chat-window {
            height: calc(70% - 40px);
            border-bottom: 1px solid #ebeef5;
            padding: 20px;
            overflow: auto;

            .avatar {
                width: 30px;
                border-radius: 50%;
            }

            .history-send {
                width: 300px;
                display: flex;
                width: 100%;
                justify-content: flex-end;
                margin-bottom: 10px;

                .avatar {
                    margin-left: 10px;
                }

                .message-text {
                    max-width: 200px;
                    word-wrap: break-word;
                    padding: 6px 10px;
                    font-size: 14px;
                    border-radius: 5px;
                    background: #67c23a;
                    color: #fff;
                }
            }

            .history-receive {
                display: flex;
                width: 100%;
                margin-bottom: 10px;

                .avatar {
                    margin-right: 10px;
                }

                .message-text {
                    max-width: 200px;
                    word-wrap: break-word;
                    padding: 6px 10px;
                    font-size: 14px;
                    border-radius: 5px;
                    background: #fff;
                    color: #8492a6;
                    border: 1px solid #dcdfe6;
                }
            }
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