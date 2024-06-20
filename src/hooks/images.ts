import { onMounted, Ref } from "vue";
const options = {
    rootMargin: '0px', //根元素的边距
    threshold: 0.5, //触发事件的阈值
    once: true
}

function callback(entries: IntersectionObserverEntry[], observer: IntersectionObserver) {
    entries.forEach(entry => {
        // 处理每个目标元素的可见性变化
        if (entry.intersectionRatio <= 0) return;
        const img = entry.target as HTMLImageElement;
        const src = img.getAttribute('data-src');
        img.setAttribute('src', src ?? '');  // 将真实的图片地址赋给 src 属性
        img.onload = () => {
            img.setAttribute('class', 'fade-in');
        }
        observer.unobserve(img); // 停止观察目标元素
    })
}

export const useInView = (ref: Ref) => {
    const observer = new IntersectionObserver(callback, options);
    onMounted(() => {
        Object.keys(ref.value).forEach((e) => observer.observe(ref.value[e]))
    })
}