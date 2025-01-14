import * as _ from 'lodash';
import { onMounted, onUnmounted } from 'vue'

export default function useScreenAdapt(dWith: number = 1920, dHeight: number = 1080) {
    // 节流
    const throttleAdjustZoom = _.throttle(() => {
        AdjustZoom();
    })
    function AdjustZoom() {
        // 设计图尺寸及宽高比
        const designWidth = dWith;
        const designHeight = dHeight;
        const designRatio = designWidth / designHeight; //1.78

        // 当前屏幕的尺寸及宽高比
        const deviceWidth = document.documentElement.clientWidth;
        const deviceHeight = document.documentElement.clientHeight;
        const deviceRatio = deviceWidth / deviceHeight;

        // 计算缩放比
        let scaleRatio = 1;
        //  如果当前屏幕的宽高比大于设计稿的，则以高度比作为缩放比
        if (deviceRatio > designRatio) {
            scaleRatio = deviceHeight / designHeight;
        } else {
            // 否则以宽度比作为缩放比
            scaleRatio = deviceWidth / designWidth;
        }
        document.body.style.transform = `scale(${scaleRatio}) translateX(-50%)`
    }
    onMounted(() => {
        AdjustZoom();
        // 响应式
        window.addEventListener('resize', throttleAdjustZoom);
    })

    // 释放资源
    onUnmounted(() => {
        window.removeEventListener('resize', throttleAdjustZoom);
    })
}