//Функционал
let funktionalDelatCodOk = document.querySelector("#funktionalDelatCod");  
funktionalDelatCodOk.addEventListener("click",funktionalDelatCod)
async function funktionalDelatCod() {
    let idCod = document.querySelector("#delateNameCod").getAttribute('data-id');//id
    let nameCod = document.querySelector("#delateNameCod").innerHTML;//name
    let nameTyp = document.querySelector("#delateNameCod").getAttribute('data-typ');//name typ
    let siteLanguage = localStorage.getItem('siteLanguage') || "eng";//Определение языка
    //Контроль
    //console.log(nameTyp,nameCod, idCod);
        if (!nameCod) {
        alert("The code was entered incorrectly.");
        e.preventDefault(); // Останавливаем отправку формы
        } else {
        const API_URL = `http://localhost:4000/delatCod`;
        const response = await fetch(API_URL, {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({idCod, nameCod, nameTyp, siteLanguage})
        });
        const result = await response.json();
        alert(result.message || result.error);    
        // Перезагрузка страницы
        location.reload();
        //Удаление блока
        document.getSelection(".textWindows").remove();
        //обнуление
        document.querySelector("#infoWindows").style.display = "none";
        }
    
}    

