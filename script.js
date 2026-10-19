// Native <details> keeps every chapter usable without JavaScript.
// Keep one thread open at a time, without moving the visitor away from the list.
const entries = [...document.querySelectorAll('.entry-disclosure')];

for (const entry of entries) {
  entry.addEventListener('toggle', () => {
    if (!entry.open) return;
    for (const other of entries) {
      if (other !== entry && other.open) other.open = false;
    }
  });
}
