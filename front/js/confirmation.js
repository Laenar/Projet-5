let newUrl = new URL(window.location.href);
let orderId = newUrl.searchParams.get('id');

if (newUrl.searchParams.get('id') == null) {
    document.location.href = 'index.html';
} else {
    document.getElementById('orderId').textContent = orderId;
}