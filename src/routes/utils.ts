export function scrollIntoView(id: string) {
    let elem = document.getElementById(id);
    if (elem == null) {
        return;
    }
    // Check whether element is fully visible already
    let rect = elem.getBoundingClientRect();
    console.log(rect);
    console.log(window.innerHeight);
    if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
        return;
    }
    elem.scrollIntoView({ behavior: 'smooth' });
}
