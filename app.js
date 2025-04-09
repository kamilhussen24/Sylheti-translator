// Firebase 9+ Modular Version
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getDatabase, ref, set, get, child, push, update, remove } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";

// Your Firebase Config (same as you provided)
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
const database = getDatabase(app);

// DOM Elements
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

// App State
let currentDirection = 'sylhetiToBangla';
let lastTranslationId = null;

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
  console.log("DOM fully loaded");
  setupEventListeners();
  testFirebaseConnection();
});

// Test Firebase Connection
async function testFirebaseConnection() {
  try {
    const testRef = ref(database, 'testConnection');
    await set(testRef, {
      timestamp: Date.now(),
      message: "Testing connection"
    });
    console.log("Firebase connection successful");
    await remove(testRef); // Clean up test data
  } catch (error) {
    console.error("Firebase connection failed:", error);
    showError("Firebase connection failed. Check console for details.");
  }
}

function setupEventListeners() {
  console.log("Setting up event listeners");
  
  // Tab switching
  sylhetiToBanglaTab.addEventListener('click', () => switchDirection('sylhetiToBangla'));
  banglaToSylhetiTab.addEventListener('click', () => switchDirection('banglaToSylheti'));

  // Translation
  translateBtn.addEventListener('click', translateText);
  
  // Clear input
  clearInputBtn.addEventListener('click', clearInput);
  
  // Copy output
  copyOutputBtn.addEventListener('click', copyOutput);
  
  // Feedback
  feedbackYesBtn.addEventListener('click', () => handleFeedback(true));
  feedbackNoBtn.addEventListener('click', () => handleFeedback(false));
  
  // Correction
  cancelCorrectionBtn.addEventListener('click', cancelCorrection);
  submitCorrectionBtn.addEventListener('click', submitCorrection);
  
  // Add new translation
  addNewBtn.addEventListener('click', addNewTranslation);
}

function switchDirection(direction) {
  console.log(`Switching direction to: ${direction}`);
  currentDirection = direction;
  
  // Update UI
  if (direction === 'sylhetiToBangla') {
    sylhetiToBanglaTab.classList.add('active');
    banglaToSylhetiTab.classList.remove('active');
    document.getElementById('inputLabel').textContent = 'সিলেটি টেক্সট লিখুন';
    document.getElementById('outputLabel').textContent = 'বাংলা অনুবাদ';
  } else {
    banglaToSylhetiTab.classList.add('active');
    sylhetiToBanglaTab.classList.remove('active');
    document.getElementById('inputLabel').textContent = 'বাংলা টেক্সট লিখুন';
    document.getElementById('outputLabel').textContent = 'সিলেটি অনুবাদ';
  }
}

async function translateText() {
  const text = inputText.value.trim();
  console.log(`Translating: ${text}`);
  
  if (!text) {
    showError("অনুবাদের জন্য কিছু টেক্সট লিখুন");
    return;
  }

  outputText.innerHTML = '<p><i class="fas fa-spinner fa-spin"></i> অনুবাদ করা হচ্ছে...</p>';
  
  try {
    const translationsRef = ref(database, 'translations');
    const snapshot = await get(translationsRef);
    
    if (!snapshot.exists()) {
      outputText.innerHTML = '<p>কোনো অনুবাদ ডাটা পাওয়া যায়নি</p>';
      return;
    }

    const translations = snapshot.val();
    let foundTranslation = null;
    let translationId = null;

    for (const id in translations) {
      const translation = translations[id];
      
      if (currentDirection === 'sylhetiToBangla') {
        if (translation.sylheti.toLowerCase() === text.toLowerCase()) {
          foundTranslation = translation.bangla;
          translationId = id;
          break;
        }
      } else {
        if (translation.bangla.toLowerCase() === text.toLowerCase()) {
          foundTranslation = translation.sylheti;
          translationId = id;
          break;
        }
      }
    }

    if (foundTranslation) {
      outputText.innerHTML = `<p>${foundTranslation}</p>`;
      lastTranslationId = translationId;
      console.log("Translation successful");
    } else {
      outputText.innerHTML = '<p>অনুবাদ পাওয়া যায়নি</p>';
      lastTranslationId = null;
      console.log("No translation found");
    }
  } catch (error) {
    console.error("Translation error:", error);
    outputText.innerHTML = '<p>ত্রুটি: অনুবাদ ব্যর্থ হয়েছে</p>';
    showError("অনুবাদ করতে সমস্যা হয়েছে");
  }
}

function clearInput() {
  inputText.value = '';
  outputText.innerHTML = '<p>অনুবাদ এখানে প্রদর্শিত হবে</p>';
  lastTranslationId = null;
  console.log("Input cleared");
}

function copyOutput() {
  const textToCopy = outputText.textContent;
  navigator.clipboard.writeText(textToCopy)
    .then(() => showSuccess("অনুবাদ কপি করা হয়েছে!"))
    .catch(err => {
      console.error("Copy failed:", err);
      showError("কপি করতে সমস্যা হয়েছে");
    });
}

async function handleFeedback(isCorrect) {
  if (!lastTranslationId) {
    showError("প্রথমে একটি অনুবাদ করুন");
    return;
  }

  try {
    const translationRef = ref(database, `translations/${lastTranslationId}`);
    
    if (isCorrect) {
      const snapshot = await get(translationRef);
      const translation = snapshot.val();
      
      await update(translationRef, {
        votes: (translation.votes || 0) + 1
      });
      
      showSuccess("ধন্যবাদ আপনার ফিডব্যাকের জন্য!");
    } else {
      correctionBox.style.display = 'block';
    }
  } catch (error) {
    console.error("Feedback error:", error);
    showError("ফিডব্যাক দিতে সমস্যা হয়েছে");
  }
}

function cancelCorrection() {
  correctionBox.style.display = 'none';
}

async function submitCorrection() {
  const correctionText = correctionBox.querySelector('textarea').value.trim();
  if (!correctionText) {
    showError("সংশোধন লিখুন");
    return;
  }

  try {
    const feedbackRef = push(ref(database, 'userFeedback'));
    
    await set(feedbackRef, {
      translationId: lastTranslationId,
      suggestedCorrection: correctionText,
      timestamp: Date.now()
    });
    
    showSuccess("সংশোধন জমা হয়েছে");
    correctionBox.style.display = 'none';
  } catch (error) {
    console.error("Error submitting correction:", error);
    showError("সংশোধন জমা দিতে সমস্যা হয়েছে");
  }
}

async function addNewTranslation() {
  const sylhetiText = newSylhetiInput.value.trim();
  const banglaText = newBanglaInput.value.trim();
  
  if (!sylhetiText || !banglaText) {
    showError("উভয় ফিল্ড পূরণ করুন");
    return;
  }

  try {
    const newTranslationRef = push(ref(database, 'translations'));
    
    await set(newTranslationRef, {
      sylheti: sylhetiText,
      bangla: banglaText,
      votes: 0,
      userAdded: true,
      timestamp: Date.now()
    });
    
    showSuccess("নতুন অনুবাদ যোগ করা হয়েছে!");
    newSylhetiInput.value = '';
    newBanglaInput.value = '';
  } catch (error) {
    console.error("Error adding translation:", error);
    showError("অনুবাদ যোগ করতে সমস্যা হয়েছে");
  }
}

// Helper functions for notifications
function showError(message) {
  alert(`ত্রুটি: ${message}`);
}

function showSuccess(message) {
  alert(message);
}
