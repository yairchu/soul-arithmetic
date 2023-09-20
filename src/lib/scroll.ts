export function scrollIntoView(id: string) {
    let elem = document.getElementById(id);
    if (elem == null) {
        return;
    }
    // Check whether element is fully visible already
    let rect = elem.getBoundingClientRect();
    if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
        return;
    }
    elem.scrollIntoView({ behavior: 'smooth' });
}

export function onScrollStop(action: () => void) {
    let lastPos: number | null = null;
    let checkPos = () => {
        let pos = window.scrollY;
        console.log(lastPos);
        if (pos == lastPos) {
            action();
        } else {
            lastPos = pos;
            requestAnimationFrame(checkPos);
        }
    };
    requestAnimationFrame(checkPos);
}
