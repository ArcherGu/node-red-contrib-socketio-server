import 'element-plus/packages/theme-chalk/src/base.scss';
import { App } from 'vue';
import { ElButton, ElCard, ElInput } from "element-plus";

export function setupElement(app: App) {
    const components = [
        ElButton,
        ElCard,
        ElInput
    ];

    for (const component of components) {
        app.use(component);
    }
}