let add = [];
let funktionalAddEdit = document.querySelector("#funktionalAdd");
funktionalAddEdit.addEventListener("click",funktionalAdd);
async function funktionalAdd(e) {   
    let dataPlace = document.querySelector(".namePoint").getAttribute('place'); //имя участка работы SOD-11
    let dataName = document.querySelector(".namePoint").getAttribute('data-name');//имя тип точек Рабочии Базовые
    let dataJobs = document.querySelector(".namePoint").getAttribute('data-jobs');//Тип сьемки Нив Тах
    let id = document.querySelector(".namePoint").textContent;
    let positionX = document.getElementById("position X").value.trim();
    let positionY = document.getElementById("position Y").value.trim();
    let vyckaPoint = document.getElementById("vycka").value.trim();
    let date = document.getElementById("date").value.trim();
    // Получаем элементы systemCoordinates
    let selektCoordinateSystem = document.getElementById("coordinateSystem");
    let coordinateSystem = selektCoordinateSystem.options[selektCoordinateSystem.selectedIndex].text;
    // Получаем элементы systemCoordinates
    let selektPositionType = document.getElementById("positionType");
    let positionType = selektPositionType.options[selektPositionType.selectedIndex].text;
    // Контроль
    /*
    add.push(`dataName: ${dataName}, dataJobs: ${dataJobs} / ${id}:{position:[${positionX},${positionY}], vycka: ${vycka}, date: ${date}, systemCoordinates : ${coordinateSystem}, positionType: ${positionType}}`);    
    console.log(add);
    */
  
   if (!positionX || !positionY || !vyckaPoint || !date || positionType == "Select" || coordinateSystem == "Select") {
   alert("You have not filled in all the fields or the fields were filled in incorrectly.");
    e.preventDefault(); // Останавливаем отправку формы
   } else {
    const API_URL = 'http://localhost:4000/addDat';
    const response = await fetch(API_URL, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({dataPlace, dataName, dataJobs, id, positionX, positionY, vyckaPoint, date, coordinateSystem, positionType})
    });
    const result = await response.json();
    alert(result.message || result.error);
    // Перезагрузка страницы
    location.reload();
    //обнуление
    document.querySelector("#import").style.display = "none"; 
    add =[];
   }
}