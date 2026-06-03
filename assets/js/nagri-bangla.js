var nagri = document.querySelector('#nagri');
var bangla = document.querySelector('#bangla');

var banglaGlyphs = [
    {
        'ꠅ': 'অ',
        'ꠀ': 'আ',
        'ꠁ': 'ই',
        'ꠃ': 'উ',
        'ꠄ': 'এ',
        'ꠇ': 'ক',
        'ꠈ': 'খ',
        'ꠉ': 'গ',
        'ꠊ': 'ঘ',
        'ꠋ': 'ং',
        'ꠌ': 'চ',
        'ꠍ': 'ছ',
        'ꠎ': 'জ',
        'ꠏ': 'ঝ',
        'ꠐ': 'ট',
        'ꠑ': 'ঠ',
        'ꠒ': 'ড',
        'ꠓ': 'ঢ',
        'ꠘ': 'ন',
        'ꠔ': 'ত',
        'ꠕ': 'থ',
        'ꠖ': 'দ',
        'ꠗ': 'ধ',
        'ꠙ': 'প',
        'ꠚ': 'ফ',
        'ꠛ': 'ব',
        'ꠜ': 'ভ',
        'ꠝ': 'ম',
        'ꠞ': 'র',
        'ꠟ': 'ল',
        'ꠡ': 'স',
        'ꠢ': 'হ',
        'ꠠ': 'ড়',
        'ꠂ': 'ঃ',
        '꠆': '্',
        'ꠣ': 'া',
        'ꠤ': 'ি',
        'ꠥ': 'ু',
        'ꠦ': 'ে',
        'ꠧ': 'ো',
        '*': '।',
        '॥': '॥',
        ' ': ' '
    }
];

nagri.addEventListener('keyup', function () {
    var banglaChars = '';
    var str = this.value;

    for (var i = 0; i < str.length; i++) {
        for (var key in banglaGlyphs) {
            if (typeof banglaGlyphs[key][str[i]] !== 'undefined') {
                banglaChars += banglaGlyphs[key][str[i]];
            } else {
                banglaChars += str[i];
            }
        }
    }

    bangla.value = banglaChars;
});
