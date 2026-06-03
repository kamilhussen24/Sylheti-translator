function copyText(target, button) {
    var targetEl = document.getElementById(target);
    var copyIcon = button.querySelector('.copy-icon');
    var copyText = button.querySelector('.copy-text');

    targetEl.select();
    targetEl.setSelectionRange(0, 99999);
    document.execCommand('copy');

    copyIcon.classList.remove('bi-clipboard');
    copyIcon.classList.add('bi-check-circle-fill', 'text-success');
    copyText.innerText = 'কপি করা হয়েছে';
    copyText.classList.remove('visually-hidden');

    setTimeout(function () {
        copyIcon.classList.remove('bi-check-circle-fill', 'text-success');
        copyIcon.classList.add('bi-clipboard');
        copyText.innerText = 'কপি করুন';
        copyText.classList.add('visually-hidden');
    }, 1200);
}

function clearText(elementId) {
    var el = document.getElementById(elementId);
    el.value = '';
    el.dispatchEvent(new Event('input'));
}
