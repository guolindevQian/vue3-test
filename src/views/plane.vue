<template>
    <div class="container">
        <div ref="plane" id="plane">
            <i aria-hidden="true">✈</i>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { onMounted, ref, Ref } from 'vue';
const plane = ref<HTMLElement | null>(null);
console.log(plane)
let deg = 0, ex = 0, ey = 0, vx = 0, vy = 0, count = 0;
const draw = () => {
    plane.value!.style.transform = 'rotate(' + deg + 'deg)';
    if (count < 100) {
        plane.value!.style.left = vx + 'px';
        plane.value!.style.top = vy + 'px';
        count++;
    }
}
onMounted(() => {
    window.addEventListener('mousemove', (e) => {
        ex = e.pageX - plane.value!.offsetLeft - plane.value!.clientWidth / 2;
        ey = e.pageY - plane.value!.offsetTop - plane.value!.clientHeight / 2;
        deg = 360 * Math.atan(ey / ex) / (2 * Math.PI) + 5;
        if (ex < 0) {
            deg += 180;
        }
        count = 0;
    })
    setInterval(draw, 1)
})
</script>
<style lang="less" scoped>
.container {
    height: 100vh;
    background: linear-gradient(200deg, #005bea, #00c6fb);

    #plane {
        color: #fff;
        font-size: 70px;
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
    }
}
</style>
