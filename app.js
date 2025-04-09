<script type="module">
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyBaTKFY31DzZJj--qKHHnpQ_K5m5kxka-s",
    authDomain: "sylhetitranslator.firebaseapp.com",
    databaseURL: "https://sylhetitranslator-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "sylhetitranslator",
    storageBucket: "sylhetitranslator.firebasestorage.app",
    messagingSenderId: "947926921985",
    appId: "1:947926921985:web:745b3366f007cddfe6a100",
    measurementId: "G-T2S2MZJJEQ"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
</script>

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

// Switch translation direction
function switchDirection(direction) {
    try {
        currentDirection = direction;
        
        // Update tab UI
        if (direction === 'sylhetiToBangla') {
            sylhetiToBanglaTab.classList.add('active');
            sylhetiToBanglaTab.setAttribute('aria-selected', 'true');
            banglaToSylhetiTab.classList.remove('active');
            banglaToSylhetiTab.setAttribute('aria-selected', 'false');
            inputLabel.textContent = 'সিলেটি টেক্সট লিখুন';
            outputLabel.textContent = 'বাংলা অনুবাদ';
        } else {
            banglaToSylhetiTab.classList.add('active');
            banglaToSylhetiTab.setAttribute('aria-selected', 'true');
            sylhetiToBanglaTab.classList.remove('active');
            sylhetiToBanglaTab.setAttribute('aria-selected', 'false');
            inputLabel.textContent = 'বাংলা টেক্সট লিখুন';
            outputLabel.textContent = 'সিলেটি অনুবাদ';
        }
        
        // Swap input and output if there's existing text
        if (outputText.textContent.trim() && !outputText.querySelector('.placeholder-text')) {
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
        
        if (count > 400) {
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
        
        if (text.length > 500) {
            showErrorModal('টেক্সট খুব দীর্ঘ। সর্বোচ্চ ৫০০ অক্ষর অনুবাদ করা যাবে।');
            return;
        }
        
        // Show loading state
        outputText.innerHTML = '<p class="placeholder-text"><i class="fas fa-spinner fa-spin"></i> অনুবাদ করা হচ্ছে...</p>';
        translateBtn.disabled = true;
        
        const translationsRef = database.ref('translations');
        
        translationsRef.once('value').then((snapshot) => {
            const translations = snapshot.val();
            let foundTranslation = null;
            let translationId = null;
            let exactMatch = false;

            // Search for exact match first
            for (const id in translations) {
                const translation = translations[id];
                if (currentDirection === 'sylhetiToBangla') {
                    if (translation.sylheti.toLowerCase() === text.toLowerCase()) {
                        foundTranslation = translation.bangla;
                        translationId = id;
                        exactMatch = true;
                        break;
                    }
                } else {
                    if (translation.bangla.toLowerCase() === text.toLowerCase()) {
                        foundTranslation = translation.sylheti;
                        translationId = id;
                        exactMatch = true;
                        break;
                    }
                }
            }

            // If no exact match, look for partial matches
            if (!exactMatch) {
                for (const id in translations) {
                    const translation = translations[id];
                    if (currentDirection === 'sylhetiToBangla') {
                        if (text.toLowerCase().includes(translation.sylheti.toLowerCase())) {
                            foundTranslation = translation.bangla;
                            translationId = id;
                            break;
                        }
                    } else {
                        if (text.toLowerCase().includes(translation.bangla.toLowerCase())) {
                            foundTranslation = translation.sylheti;
                            translationId = id;
                            break;
                        }
                    }
                }
            }

            if (foundTranslation) {
                outputText.innerHTML = `<p>${foundTranslation}</p>`;
                lastTranslationId = translationId;
                showNotification('অনুবাদ সম্পন্ন হয়েছে!');
            } else {
                outputText.innerHTML = `
                    <p class="no-translation">
                        <i class="fas fa-exclamation-circle"></i> অনুবাদ পাওয়া যায়নি<br><br>
                        আপনি নিচের ফর্ম ব্যবহার করে নতুন অনুবাদ যোগ করতে পারেন
                    </p>
                `;
                lastTranslationId = null;
            }
            
            translateBtn.disabled = false;
        }).catch((error) => {
            outputText.innerHTML = `
                <p class="error-message">
                    <i class="fas fa-exclamation-triangle"></i> ত্রুটি: অনুবাদ ব্যর্থ হয়েছে
                </p>
            `;
            translateBtn.disabled = false;
            showErrorModal('অনুবাদ করতে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।');
            console.error('Translation error:', error);
        });
    } catch (error) {
        showErrorModal('অনুবাদ প্রক্রিয়ায় সমস্যা হয়েছে।');
        console.error('Translation process error:', error);
        translateBtn.disabled = false;
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
        
        if (isCorrect) {
            // Increment votes for correct translation
            translationRef.transaction((translation) => {
                if (translation) {
                    translation.votes = (translation.votes || 0) + 1;
                }
                return translation;
            }).then(() => {
                showNotification('ধন্যবাদ আপনার ফিডব্যাকের জন্য!');
            }).catch(error => {
                showErrorModal('ফিডব্যাক সংরক্ষণ করতে সমস্যা হয়েছে।');
                console.error('Feedback save error:', error);
            });
        } else {
            // Show correction input
            correctionBox.style.display = 'block';
            correctionBox.querySelector('textarea').focus();
        }
    } catch (error) {
        showErrorModal('ফিডব্যাক প্রক্রিয়ায় সমস্যা হয়েছে।');
        console.error('Feedback process error:', error);
    }
}

// Cancel correction
function cancelCorrection() {
    try {
        correctionBox.style.display = 'none';
        correctionBox.querySelector('textarea').value = '';
    } catch (error) {
        console.error('Cancel correction error:', error);
    }
}

// Submit correction
function submitCorrection() {
    try {
        const correctionText = correctionBox.querySelector('textarea').value.trim();
        if (!correctionText) {
            showNotification('একটি সংশোধন লিখুন', 'error');
            return;
        }

        const feedbackRef = database.ref('userFeedback').push();
        const translationRef = database.ref(`translations/${lastTranslationId}`);
        
        // Save feedback
        feedbackRef.set({
            translationId: lastTranslationId,
            feedback: "incorrect",
            suggestedCorrection: correctionText,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        }).catch(error => {
            showErrorModal('সংশোধন সংরক্ষণ করতে সমস্যা হয়েছে।');
            console.error('Correction save error:', error);
        });

        // Update translation if multiple users suggest the same correction
        translationRef.once('value').then((snapshot) => {
            const translation = snapshot.val();
            const updates = {};
            
            if (currentDirection === 'sylhetiToBangla') {
                updates[`translations/${lastTranslationId}/bangla`] = correctionText;
            } else {
                updates[`translations/${lastTranslationId}/sylheti`] = correctionText;
            }
            
            database.ref().update(updates).then(() => {
                showNotification('আপনার সংশোধন জমা হয়েছে। ধন্যবাদ!');
                correctionBox.style.display = 'none';
                correctionBox.querySelector('textarea').value = '';
                
                // Update the displayed translation
                outputText.innerHTML = `<p>${correctionText}</p>`;
            }).catch(error => {
                showErrorModal('অনুবাদ আপডেট করতে সমস্যা হয়েছে।');
                console.error('Translation update error:', error);
            });
        });
    } catch (error) {
        showErrorModal('সংশোধন জমা দিতে সমস্যা হয়েছে।');
        console.error('Submit correction error:', error);
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

        const newTranslationRef = database.ref('translations').push();
        
        newTranslationRef.set({
            sylheti: sylhetiText,
            bangla: banglaText,
            votes: 0,
            userAdded: true,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        }).then(() => {
            showNotification('নতুন অনুবাদ সফলভাবে যোগ হয়েছে!');
            newSylhetiInput.value = '';
            newBanglaInput.value = '';
        }).catch((error) => {
            showErrorModal(`ত্রুটি: ${error.message}`);
            console.error('Add translation error:', error);
        });
    } catch (error) {
        showErrorModal('নতুন অনুবাদ যোগ করতে সমস্যা হয়েছে।');
        console.error('Add translation process error:', error);
    }
}

// Show notification
function showNotification(message, type = 'success') {
    try {
        notification.textContent = message;
        notification.classList.add('show');
        
        // Set color based on type
        if (type === 'error') {
            notification.style.backgroundColor = 'var(--error-color)';
        } else if (type === 'warning') {
            notification.style.backgroundColor = 'var(--warning-color)';
        } else {
            notification.style.backgroundColor = 'var(--primary-color)';
        }
        
        // Hide after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
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
