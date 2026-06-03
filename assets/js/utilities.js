function copyText(target, button) {
    var targetEl = document.getElementById(target);
    var copyIcon = button.querySelector('.copy-icon');
    var copyTextEl = button.querySelector('.copy-text');

    function onSuccess() {
        copyIcon.classList.remove('bi-clipboard');
        copyIcon.classList.add('bi-check-circle-fill', 'text-success');
        copyTextEl.innerText = 'কপি করা হয়েছে';
        copyTextEl.classList.remove('visually-hidden');

        setTimeout(function () {
            copyIcon.classList.remove('bi-check-circle-fill', 'text-success');
            copyIcon.classList.add('bi-clipboard');
            copyTextEl.innerText = 'কপি করুন';
            copyTextEl.classList.add('visually-hidden');
        }, 1200);
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(targetEl.value).then(onSuccess).catch(function () {
            targetEl.select();
            targetEl.setSelectionRange(0, 99999);
            document.execCommand('copy');
            onSuccess();
        });
    } else {
        targetEl.select();
        targetEl.setSelectionRange(0, 99999);
        document.execCommand('copy');
        onSuccess();
    }
}

function clearText(elementId) {
    var el = document.getElementById(elementId);
    el.value = '';
    el.dispatchEvent(new Event('input'));
}
