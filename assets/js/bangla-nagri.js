var nagri = document.querySelector('#nagri');
var bangla = document.querySelector('#bangla');

var nagriGlyphs = [
    {
        'অ': 'ꠅ',
        'আ': 'ꠀ',
        'ই': 'ꠁ',
        'ঈ': 'ꠁ',
        'উ': 'ꠃ',
        'ঊ': 'ꠃ',
        'ঋ': 'ꠞꠤ',
        'এ': 'ꠄ',
        'ঐ': 'ꠅꠁ',
        'ও': 'ꠅ',
        'ঔ': 'ꠅꠃ',
        'ক': 'ꠇ',
        'খ': 'ꠈ',
        'গ': 'ꠉ',
        'ঘ': 'ꠊ',
        'ঙ': 'ꠋ',
        'চ': 'ꠌ',
        'ছ': 'ꠍ',
        'জ': 'ꠎ',
        'ঝ': 'ꠏ',
        'ঞ': 'ꠘ',
        'ট': 'ꠐ',
        'ঠ': 'ꠑ',
        'ড': 'ꠒ',
        'ঢ': 'ꠓ',
        'ণ': 'ꠘ',
        'ত': 'ꠔ',
        'থ': 'ꠕ',
        'দ': 'ꠖ',
        'ধ': 'ꠗ',
        'ন': 'ꠘ',
        'প': 'ꠙ',
        'ফ': 'ꠚ',
        'ব': 'ꠛ',
        'ভ': 'ꠜ',
        'ম': 'ꠝ',
        'য': 'ꠎ',
        'র': 'ꠞ',
        'ল': 'ꠟ',
        'শ': 'ꠡ',
        'স': 'ꠡ',
        'ষ': 'ꠡ',
        'হ': 'ꠢ',
        'য়': 'ꠁ',
        'ড়': 'ꠠ',
        'ঢ়': 'ꠠ',
        'ৎ': 'ꠔ',
        'ং': 'ꠋ',
        'ঃ': 'ꠂ',
        'ঁ': 'ꠘ',
        '্': '꠆',
        'া': 'ꠣ',
        'ি': 'ꠤ',
        'ী': 'ꠤ',
        'ু': 'ꠥ',
        'ূ': 'ꠥ',
        'ে': 'ꠦ',
        'ৈ': 'ꠧꠁ',
        'ো': 'ꠧ',
        'ৌ': 'ꠧꠃ',
        '।': '*',
        '॥': '॥',
        ' ': ' '
    }
];

bangla.addEventListener('keyup', function () {
    var nagriChars = '';
    var str = this.value;

    for (var i = 0; i < str.length; i++) {
        for (var key in nagriGlyphs) {
            if (typeof nagriGlyphs[key][str[i]] !== 'undefined') {
                nagriChars += nagriGlyphs[key][str[i]];
            } else {
                nagriChars += str[i];
            }
        }
    }

    nagri.value = nagriChars;
});
