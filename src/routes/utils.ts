export function scrollIntoView(id: string) {
    let elem = document.getElementById(id);
    if (elem) {
        elem.scrollIntoView({ behavior: 'smooth' });
    }
}
