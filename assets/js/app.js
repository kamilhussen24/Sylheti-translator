// Firebase configuration (replace with your actual config)
const firebaseConfig = {
    apiKey: "AIzaSyBaTKFY31DzZJj--qKHHnpQ_K5m5kxka-s",
    authDomain: "sylhetitranslator.firebaseapp.com",
    projectId: "sylhetitranslator",
    storageBucket: "sylhetitranslator",
    messagingSenderId: "947926921985",
    appId: "1:947926921985:web:745b3366f007cddfe6a100",
    databaseURL: "https://sylhetitranslator-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// DOM elements
const sylhetiToBanglaTab = document.getElementById('sylhetiToBanglaTab');
const banglaToSylhetiTab = document.getElementById('banglaToSylhetiTab');
const inputText = document.getElementById('inputText');
const translateBtn = document.getElementById('translateBtn');
const outputText = document.getElementById('outputText');
const clearInputBtn = document.getElementById('clearInput');
const copyOutputBtn = document.getElementById('copyOutput');
const feedbackYesBtn = document.getElementById('feedbackYes');
const feedbackNoBtn = document.getElementById('feedbackNo');
const correctionBox = document.getElementById('correctionBox');
const cancelCorrectionBtn = document.getElementById('cancelCorrection');
const submitCorrectionBtn = document.getElementById('submitCorrection');
const newSylhetiInput = document.getElementById('newSylheti');
const newBanglaInput = document.getElementById('newBangla');
const addNewBtn = document.getElementById('addNewBtn');
const charCount = document.getElementById('charCount');
const inputLabel = document.getElementById('inputLabel');
const outputLabel = document.getElementById('outputLabel');
const notification = document.getElementById('notification');
const errorModal = document.getElementById('errorModal');
const closeModalBtn = document.getElementById('closeModal');
const modalOkBtn = document.getElementById('modalOk');
const modalMessage = document.getElementById('modalMessage');

// App state
let currentDirection = 'sylhetiToBangla';
let lastTranslationId = null;
let lastInputText = '';

// Initialize the app
function initApp() {
    try {
        setupEventListeners();
        updateUI();
        // Check if Firebase is initialized properly
        if (!firebase.apps.length) {
            throw new Error('Firebase initialization failed');
        }
    } catch (error) {
        showErrorModal('অ্যাপ্লিকেশন লোড করতে সমস্যা হয়েছে। দয়া করে পৃষ্ঠাটি রিফ্রেশ করুন।');
        console.error('Initialization error:', error);
    }
}

// Set up all event listeners
function setupEventListeners() {
    try {
        // Tab switching
        sylhetiToBanglaTab.addEventListener('click', () => switchDirection('sylhetiToBangla'));
        banglaToSylhetiTab.addEventListener('click', () => switchDirection('banglaToSylheti'));
        
        // Translation
        translateBtn.addEventListener('click', translateText);
        inputText.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'Enter') {
                translateText();
            }
        });
        
        // Input/Output actions
        clearInputBtn.addEventListener('click', clearInput);
        copyOutputBtn.addEventListener('click', copyOutput);
        
        // Feedback system
        feedbackYesBtn.addEventListener('click', () => handleFeedback(true));
        feedbackNoBtn.addEventListener('click', () => handleFeedback(false));
        cancelCorrectionBtn.addEventListener('click', cancelCorrection);
        submitCorrectionBtn.addEventListener('click', submitCorrection);
        
        // Add new translation
        addNewBtn.addEventListener('click', addNewTranslation);
        
        // Character count
        inputText.addEventListener('input', updateCharacterCount);
        
        // Modal controls
        closeModalBtn.addEventListener('click', closeModal);
        modalOkBtn.addEventListener('click', closeModal);
    } catch (error) {
        showErrorModal('ইভেন্ট লিসেনার সেটআপে সমস্যা হয়েছে।');
        console.error('Event listener setup error:', error);
    }
}

// Updated switchDirection function
function switchDirection(direction) {
    try {
        currentDirection = direction;
        
        // Update tab UI
        if (direction === 'sylhetiToBangla') {
            sylhetiToBanglaTab.classList.add('active');
            sylhetiToBanglaTab.setAttribute('aria-selected', 'true');
            banglaToSylhetiTab.classList.remove('active');
            banglaToSylhetiTab.setAttribute('aria-selected', 'false');
            inputLabel.textContent = 'আঞ্চলিক সিলেটি লিখুন';
            outputLabel.textContent = 'প্রমিত বাংলা অনুবাদ';
        } else {
            banglaToSylhetiTab.classList.add('active');
            banglaToSylhetiTab.setAttribute('aria-selected', 'true');
            sylhetiToBanglaTab.classList.remove('active');
            sylhetiToBanglaTab.setAttribute('aria-selected', 'false');
            inputLabel.textContent = 'প্রমিত বাংলা লিখুন';
            outputLabel.textContent = 'আঞ্চলিক সিলেটি অনুবাদ';
        }
        
        // Only clear if the current output is "No translation found" message
        if (outputText.querySelector('.no-translation')) {
            outputText.innerHTML = '<p class="placeholder-text">অনুবাদ এখানে প্রদর্শিত হবে</p>';
            lastTranslationId = null;
        }
        
        // Swap input and output if there's existing translated text
        if (outputText.textContent.trim() && !outputText.querySelector('.placeholder-text') && !outputText.querySelector('.no-translation')) {
            const temp = inputText.value;
            inputText.value = outputText.textContent;
            outputText.innerHTML = `<p>${temp}</p>`;
        } else if (lastInputText) {
            inputText.value = lastInputText;
        }
        
        updateCharacterCount();
    } catch (error) {
        showErrorModal('দিক পরিবর্তন করতে সমস্যা হয়েছে।');
        console.error('Direction switch error:', error);
    }
}

// Update character count
function updateCharacterCount() {
    try {
        const count = inputText.value.length;
        charCount.textContent = count;
        
        if (count > 30) {
            charCount.style.color = 'var(--error-color)';
        } else {
            charCount.style.color = 'var(--medium-color)';
        }
    } catch (error) {
        console.error('Character count update error:', error);
    }
}

// Clear input field
function clearInput() {
    try {
        inputText.value = '';
        outputText.innerHTML = '<p class="placeholder-text">অনুবাদ এখানে প্রদর্শিত হবে</p>';
        lastTranslationId = null;
        updateCharacterCount();
        showNotification('ইনপুট পরিষ্কার করা হয়েছে');
    } catch (error) {
        showErrorModal('ইনপুট পরিষ্কার করতে সমস্যা হয়েছে।');
        console.error('Clear input error:', error);
    }
}

// Copy output to clipboard
function copyOutput() {
    try {
        if (outputText.querySelector('.placeholder-text')) {
            showNotification('কপি করার জন্য কোনো অনুবাদ নেই', 'error');
            return;
        }
        
        const textToCopy = outputText.textContent;
        navigator.clipboard.writeText(textToCopy).then(() => {
            showNotification('অনুবাদ কপি করা হয়েছে!');
        }).catch(err => {
            showErrorModal('কপি করতে সমস্যা হয়েছে। দয়া করে ম্যানুয়ালি কপি করুন।');
            console.error('Copy error:', err);
        });
    } catch (error) {
        showErrorModal('কপি করতে সমস্যা হয়েছে।');
        console.error('Copy output error:', error);
    }
}


// Translate text
function translateText() {
    try {
        const text = inputText.value.trim();
        lastInputText = text;

        if (!text) {
            showNotification('অনুবাদের জন্য কিছু টেক্সট লিখুন', 'error');
            return;
        }

        if (text.length > 30) {
            showErrorModal('টেক্সট খুব দীর্ঘ। সর্বোচ্চ ৩০ অক্ষর অনুবাদ করা যাবে।');
            return;
        }

        
    // Show loading state
outputText.innerHTML = '<p class="placeholder-text"><i class="fas fa-spinner fa-spin"></i> অনুবাদ করা হচ্ছে...</p>';
translateBtn.disabled = true;

// Check if the input contains only English characters
const isEnglishText = /^[a-zA-Z\s]*$/.test(text);

if (isEnglishText) {
    outputText.innerHTML = `
        <p class="no-translation">
            <i class="fas fa-exclamation-circle"></i> দুঃখিত, ইংরেজি অনুবাদ হবে না
        </p>`;
    translateBtn.disabled = false;
    return;
}

const translationsRef = database.ref('translations');

translationsRef.once('value').then((snapshot) => {
    const translations = snapshot.val();
    const wordTranslations = new Map();
    let usedTranslationIds = new Set();

    // ১. বাংলা কার/মাত্রা সাপোর্ট সহ ডাটাবেজ প্রসেসিং
    Object.entries(translations).forEach(([id, trans]) => {
        const sourceField = currentDirection === 'sylhetiToBangla' ? 'sylheti' : 'bangla';
        const targetField = currentDirection === 'sylhetিToBangla' ? 'bangla' : 'sylheti';

        const sourceWords = trans[sourceField]
            .split(/\s+/)
            .map(word => word
                .trim()
                .normalize('NFC') // বাংলা ইউনিকোড স্ট্যান্ডার্ডাইজেশন
                .replace(/[^\p{L}\p{M}\p{N}]/gu, '') // কার/মাত্রা রাখা হয়েছে (\p{M})
            );

        const targetWords = trans[targetField].split(/\s+/);

        sourceWords.forEach((cleanSourceWord, index) => {
            if(targetWords[index]) {
                const existing = wordTranslations.get(cleanSourceWord);
                const currentVotes = trans.votes || 0;

                if (!existing || currentVotes > existing.votes) {
                    wordTranslations.set(cleanSourceWord, {
                        translation: targetWords[index],
                        id: id,
                        votes: currentVotes
                    });
                }
            }
        });
    });

    // ২. ইউজার ইনপুট প্রসেসিং (বাংলা কার সম্পূর্ণ সাপোর্ট)
    const lines = text.split('\n');
    let outputLines = [];

    lines.forEach(line => {
        const words = line.split(/(\s+)/);
        let translatedLine = [];

        words.forEach(word => {
            const cleanWord = word
                .trim()
                .normalize('NFC') // একই নর্মালাইজেশন
                .replace(/[^\p{L}\p{M}\p{N}]/gu, ''); // মাত্রা/কার অক্ষত

            let translatedWord = word;

            if (wordTranslations.has(cleanWord)) {
                const { translation, id } = wordTranslations.get(cleanWord);
                translatedWord = translation;
                usedTranslationIds.add(id);
            }

            translatedLine.push(translatedWord);
        });

        outputLines.push(translatedLine.join(''));
    });

    // ৩. ফলাফল ডিসপ্লে
    const finalTranslation = outputLines.join('<br>');
    lastTranslationId = usedTranslationIds.size > 0 ? Array.from(usedTranslationIds)[0] : null;

    if (usedTranslationIds.size > 0) {
        outputText.innerHTML = `<p>${finalTranslation}</p>`;
        showNotification('অনুবাদ সম্পন্ন হয়েছে!');
    } else {
        outputText.innerHTML = `
            <p class="no-translation">
                <i class="fas fa-exclamation-circle"></i> অনুবাদ পাওয়া যায়নি<br><br>
                আপনি নিচের ফর্ম ব্যবহার করে নতুন অনুবাদ যোগ করতে পারেন
            </p>`;
    }

    translateBtn.disabled = false;
}).catch((error) => {
    outputText.innerHTML = `
        <p class="no-translation">
            <i class="fas fa-exclamation-triangle"></i> ত্রুটি: ${error.message}
        </p>`;
    console.error("Translation error:", error);
    translateBtn.disabled = false;
});

    } catch (error) {
        // Error handling remains same
    }
}

    // Handle user feedback
function handleFeedback(isCorrect) {
    try {
        if (!lastTranslationId) {
            showNotification('প্রথমে একটি অনুবাদ করুন', 'error');
            return;
        }

        const translationRef = database.ref(`translations/${lastTranslationId}`);
        
        // For both correct and incorrect, we'll just update votes
        translationRef.transaction((translation) => {
            if (translation) {
                if (isCorrect) {
                    translation.votes = (translation.votes || 0) + 1;
                } else {
                    translation.votes = (translation.votes || 0) - 1;
                    // Ensure votes don't go negative
                    if (translation.votes < 0) translation.votes = 0;
                }
            }
            return translation;
        }).then(() => {
            // Show appropriate notification based on the feedback
            if (isCorrect) {
                showNotification('ধন্যবাদ আপনার সঠিক ফিডব্যাকের জন্য!');
            } else {
                showNotification('শুধুমাত্র ভুল শব্দটি নিচের বক্সে জমা দিন', 'error');
            }
        }).catch(error => {
            showErrorModal('ফিডব্যাক সংরক্ষণ করতে সমস্যা হয়েছে।');
            console.error('Feedback save error:', error);
        });

    } catch (error) {
        showErrorModal('ফিডব্যাক প্রক্রিয়ায় সমস্যা হয়েছে।');
        console.error('Feedback process error:', error);
    }
}

// Add new translation
function addNewTranslation() {
    try {
        const sylhetiText = newSylhetiInput.value.trim();
        const banglaText = newBanglaInput.value.trim();

        if (!sylhetiText || !banglaText) {
            showNotification('উভয় ফিল্ড পূরণ করুন', 'error');
            return;
        }

        // Check if both inputs contain only one word
        if (sylhetiText.split(/\s+/).length > 1 || banglaText.split(/\s+/).length > 1) {
            showNotification('একটি শব্দের বেশি জমা দেয়া যাবে না একবারে', 'error');
            return;
        }

        // Check for special characters (e.g., punctuation marks) in both inputs
        const invalidChars = /[.,'?!]/;
        if (invalidChars.test(sylhetiText) || invalidChars.test(banglaText)) {
            showNotification('স্পেশাল ক্যারেক্টার ব্যবহার করা যাবে না', 'error');
            return;
        }

        // Check for English characters in both inputs
        const englishRegex = /[a-zA-Z]/;
        if (englishRegex.test(sylhetiText) || englishRegex.test(banglaText)) {
            showNotification('ইংরেজি শব্দ ব্যবহার করা যাবে না', 'error');
            return;
        }

        const sylhetiCount = sylhetiText.split(/\s+/).length;
        const banglaCount = banglaText.split(/\s+/).length;

        function convertToBanglaNumber(number) {
            const engToBan = { '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪', '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯' };
            return number.toString().split('').map(d => engToBan[d] || d).join('');
        }

        if (sylhetiCount !== banglaCount) {
            showNotification(
                `সিলেটি (${convertToBanglaNumber(sylhetiCount)} শব্দ) ও বাংলা (${convertToBanglaNumber(banglaCount)} শব্দ) সমান নয়!`,
                'error'
            );
            return;
        }

        const translationsRef = database.ref('translations');
        translationsRef.once('value')
            .then(snapshot => {
                const allData = snapshot.val();
                let foundExactMatch = false;
                let bestMatchedId = null;
                let bestMatchedVote = -1;

                if (allData) {
                    for (const id in allData) {
                        const item = allData[id];
                        if (item.sylheti === sylhetiText && item.bangla === banglaText) {
                            // Exact match found
                            const updatedVotes = (item.votes || 0) + 1;
                            translationsRef.child(id).update({ votes: updatedVotes }).then(() => {
                                showNotification(
                                    `এই অনুবাদটি আগে থেকেই রয়েছে<br>বাংলা: ${item.bangla}<br>আপনার ভোট যোগ হয়েছে! মোট ভোট: ${convertToBanglaNumber(updatedVotes)}`,
                                    'success'
                                );
                                newSylhetiInput.value = '';
                                newBanglaInput.value = '';
                            });
                            foundExactMatch = true;
                            break;
                        }

                        // Store the entry with max votes (same Sylheti or Bangla)
                        if ((item.sylheti === sylhetiText || item.bangla === banglaText) && item.votes > bestMatchedVote) {
                            bestMatchedId = id;
                            bestMatchedVote = item.votes;
                        }
                    }
                }

                if (!foundExactMatch) {
                    // Add new translation
                    const newRef = translationsRef.push();
                    newRef.set({
                        sylheti: sylhetiText,
                        bangla: banglaText,
                        votes: 0,
                        userAdded: true,
                        timestamp: firebase.database.ServerValue.TIMESTAMP
                    }).then(() => {
                        let message = 'নতুন অনুবাদ সফলভাবে যোগ হয়েছে!';
                        if (bestMatchedId) {
                            const matched = allData[bestMatchedId];
                            message += `<br><br>তবে আগের অনুবাদ পাওয়া গেছে<br><b>${matched.sylheti}</b> ➔ <b>${matched.bangla}</b><br>মোট ভোট: ${convertToBanglaNumber(matched.votes)}`;
                        }

                        showNotification(message, 'success');
                        newSylhetiInput.value = '';
                        newBanglaInput.value = '';
                    }).catch((error) => {
                        showErrorModal(`ত্রুটি: ${error.message}`);
                        console.error('Add translation error:', error);
                    });
                }

            }).catch(error => {
                showErrorModal('অনুবাদ যাচাই করতে সমস্যা হয়েছে।');
                console.error('Check existing error:', error);
            });

    } catch (error) {
        showErrorModal('নতুন অনুবাদ যোগ করতে সমস্যা হয়েছে।');
        console.error('Add translation process error:', error);
    }
}


// Show notification
function showNotification(message, type = 'success') {
    try {
        const notification = document.getElementById('notification'); // ID দিয়ে ধরলাম

        notification.innerHTML = message; // HTML সাপোর্টের জন্য
        notification.classList.add('show');
        
        // Set color based on type
        if (type === 'error') {
            notification.style.backgroundColor = 'var(--error-color)';
        } else if (type === 'warning') {
            notification.style.backgroundColor = 'var(--warning-color)';
        } else {
            notification.style.backgroundColor = 'var(--primary-color)';
        }

        // Hide after 5 seconds or on touch/click
        const hideNotification = () => {
            notification.classList.remove('show');
            notification.removeEventListener('click', hideNotification);
        };

        setTimeout(hideNotification, 5000);
        notification.addEventListener('click', hideNotification);

    } catch (error) {
        console.error('Notification error:', error);
    }
}

// Show error modal
function showErrorModal(message) {
    try {
        modalMessage.textContent = message;
        errorModal.classList.add('show');
    } catch (error) {
        console.error('Error modal error:', error);
    }
}

// Close modal
function closeModal() {
    try {
        errorModal.classList.remove('show');
    } catch (error) {
        console.error('Close modal error:', error);
    }
}

// Update UI based on state
function updateUI() {
    try {
        updateCharacterCount();
    } catch (error) {
        console.error('UI update error:', error);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);
