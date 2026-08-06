window.onload = function () {
    // إنشاء عنصر الترجمة وإضافته إلى الصفحة
    const translateDiv = document.createElement("div");
    translateDiv.id = "google_translate_element";
    document.body.insertBefore(translateDiv, document.body.firstChild);
  
    // إضافة سكربت الترجمة من Google
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    document.body.appendChild(script);
  };
  
  function googleTranslateElementInit() {
    new google.translate.TranslateElement({
      pageLanguage: 'ar', // اللغة الافتراضية
      includedLanguages: 'en,ar,ckb', // إضافة الكردية السورانية
      layout: google.translate.TranslateElement.InlineLayout.SIMPLE
    }, 'google_translate_element');
  }
  