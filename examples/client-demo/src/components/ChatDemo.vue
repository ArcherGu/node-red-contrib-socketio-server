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
                    v-if="isSendMsg(item.from)"
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
import {
    defineComponent,
    reactive,
    ref,
    toRefs,
    nextTick,
    onBeforeUnmount,
} from "vue";
import { io, Socket } from "socket.io-client";

interface HistoryItem {
    from: string;
    to: string;
    msg: string;
}

export default defineComponent({
    name: "ChatDemo",
    emits: ["link-error"],
    components: {},
    props: {},
    setup(props, { emit }) {
        const chatWindow = ref<any>(null);
        const state = reactive({
            history: [] as HistoryItem[],
            message: "",
            opts: null as null | { [key: string]: string },
        });

        let client: Socket;

        const initChatSocketIO = (opts: { [key: string]: string }) => {
            state.opts = { ...opts };
            const roomArr = [opts.you, opts.friend].sort((a, b) =>
                b.localeCompare(a)
            );

            try {
                client = io(opts.address, {
                    reconnection: false,
                    query: {
                        room: `${roomArr[0]}@${roomArr[1]}`,
                    },
                });

                client.on("connect_error", (err) => {
                    console.error(err);
                    emit("link-error");
                });

                client.on("message", receiveMsg);
            } catch (error) {
                console.error(error);
                emit("link-error");
            }
        };

        const isSendMsg = (person: string) => {
            return person == state.opts?.you;
        };

        const receiveMsg = async (data: HistoryItem) => {
            state.history.push(data);

            await nextTick();
            chatWindow.value.scrollTop = chatWindow.value.scrollHeight;
        };

        const sendMsg = () => {
            if (!state.message.trim()) {
                state.message = "";
                ElMessage.warning("Please enter the message!");
                return;
            }

            client.emit("message", {
                from: state.opts.you,
                to: state.opts.friend,
                msg: state.message,
            });

            state.message = "";
        };

        onBeforeUnmount(() => {
            client?.emit("leave");
            client?.close();
        });

        return {
            ...toRefs(state),
            chatWindow,
            initChatSocketIO,
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