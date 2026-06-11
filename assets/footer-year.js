// Automatically keeps footer copyright years up to date
document.addEventListener('DOMContentLoaded', () => {
    const year = new Date().getFullYear();
    const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    const bengaliYear = String(year).replace(/[0-9]/g, (digit) => bengaliDigits[digit]);

    document.querySelectorAll('.copyright-year').forEach((el) => {
        el.textContent = year;
    });

    document.querySelectorAll('.copyright-year-bn').forEach((el) => {
        el.textContent = bengaliYear;
    });
});
