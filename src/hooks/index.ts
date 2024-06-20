import { onMounted, Directive } from "vue";

interface Result {
    vFocus: Directive,
    vMove: Directive
}

export const toolDirective = (): Result => {
    const vFocus: Directive = {
        mounted(el: HTMLInputElement) {
            el.focus()
        }
    }
    const vMove: Directive = {
        mounted(el: HTMLElement) {
            let moveEl = el.firstElementChild as HTMLElement;
            const moveDown = (e: MouseEvent) => {
                let X = e.clientX - el.offsetLeft;
                let Y = e.clientY - el.offsetTop;
                const move = (e: MouseEvent) => {
                    el.style.left = e.clientX - X + 'px';
                    el.style.top = e.clientY - Y + 'px';
                }
                document.addEventListener('mousemove', move)
                document.addEventListener('mouseup', () => {
                    document.removeEventListener('mousemove', move)
                })
            }
            moveEl.addEventListener('mousedown', moveDown)
        }
    }
    return {
        vFocus,
        vMove
    }
}