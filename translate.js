window.onload = function () {
    const translateDiv = document.createElement("div");
    translateDiv.id = "google_translate_element";
    document.body.insertBefore(translateDiv, document.body.firstChild);

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "
    document.body.appendChild(script);
  };

  function googleTranslateElementInit() {
    new google.translate.TranslateElement({
      pageLanguage: 'ar',
      includedLanguages: 'en,ar,ckb',
      layout: google.translate.TranslateElement.InlineLayout.SIMPLE
    }, 'google_translate_element');
  }
  