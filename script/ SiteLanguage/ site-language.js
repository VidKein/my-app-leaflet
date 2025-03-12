document.addEventListener("DOMContentLoaded", function() {
    //Определение языка
    const siteLanguage = localStorage.getItem('siteLanguage') || "eng";
    console.log(siteLanguage);
    // Загрузка языка при загрузке страницы
    loadLanguage(siteLanguage);
    // Функция загрузки JSON-файла и перевода страницы
    function loadLanguage(lang) {
        fetch("./language/"+siteLanguage+".json")
            .then(response => response.json())
            .then(data => {
                translatePageLeaflets(data);
                translatePage(data);
                translatePageAtr(data);
            })
            .catch(error => console.error("Error loading language file:", error));
    }
    //Перевод элементов Leaflet
    function translatePageLeaflets(data) {
        const leafletControlZoomIn = document.querySelector('.leaflet-control-zoom-in');
        const leafletControlZoomOut = document.querySelector('.leaflet-control-zoom-out');
        const leafletBarPartLeafletBarPartSingle = document.querySelector('.leaflet-bar-part.leaflet-bar-part-single');
        //console.log(leafletControlZoomIn,leafletControlZoomIn,leafletBarPartLeafletBarPartSingle);    
        leafletControlZoomIn.setAttribute("title", data['leaflet-control-zoom-in']);
        leafletControlZoomOut.setAttribute("title", data['leaflet-control-zoom-out']);
        leafletBarPartLeafletBarPartSingle.setAttribute("title", data['leaflet-bar-part leaflet-bar-part-single']);  
    }
    // Функция перевода элементов по Тегам langs
    //langs = "имя ключа в базе"
    function translatePage(data) {
        const elements = document.querySelectorAll('[langs]');
        elements.forEach(element => {
            //console.log(element);
            const key = element.getAttribute('langs');
            if (data[key]) {               
                element.textContent = data[key]; 
            }
        });
        //Вкрапление в butto->span
        let buttonSpan = document.querySelectorAll('button[langs-child]'); 
        console.log(buttonSpan);
        
        buttonSpan.forEach(button => {
            console.log(button);
            
            const key = button.getAttribute('langs-child');
            // Проверяем, есть ли текст перед <span>
            let textNode = [...button.childNodes].find(node => node.nodeType === 3);
            if (data[key]) {     
                buttonSpan.childNodes[0].nodeValue = data[key]+ " - ";          
            }
        });
    }
    // Функция перевода элементов по Тегам langs-atr
    //langs-atr="имя изменяемого атрибута" data-lang-key = "имя ключа в базе"
    function translatePageAtr(data) {
        const elementsAtr = document.querySelectorAll('[langs-atr]');
        elementsAtr.forEach(element => {
            //console.log(element);
            const attr = element.getAttribute('langs-atr'); // Какой атрибут нужно изменить (например, placeholder)
            const key = element.getAttribute('data-lang-key'); // Берём ключ из текущего атрибута
            if (data[key]) {      
                element.setAttribute(attr, data[key]);
            }
        });
    }

});