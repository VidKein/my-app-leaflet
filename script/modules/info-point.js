//Дата - выводим информацию о сегоднешей дате
let data = document.querySelector(".todayDate");
let todayDate = new Date();
let DaysOfWeek = ['Mon','Tue','Wed','Thu','Eri','Sat','Sun'];
data.innerText = todayDate.getDay() > 0 ? DaysOfWeek[todayDate.getDay()-1] : DaysOfWeek[6]+" / "+todayDate.getFullYear()+"-"+(todayDate.getMonth()+1)+"-"+todayDate.getDate();
//Анимация информации по работе
 let dataBlock = document.querySelector("#dataBlock");
 let infiPointkBlock = document.querySelector("#infoPointkBlock ");
 let closePoints = document.querySelector(".close-points");
 dataBlock.addEventListener("click",start_stopInfoBloka);
 closePoints.addEventListener("click",start_stopInfoBloka);
function start_stopInfoBloka() {
    dataBlock.classList.toggle("activ"); 
    if (dataBlock.className == "dataBlock activ") {
        infiPointkBlock.style.display = "block";
    } else {
        infiPointkBlock.style.display = "none";
    }
}
//Действия при нажатии на РАБОЧИИ кнопки внутри блок
let infoPoint= document.querySelector(".points-wrapper").children;
for (let i = 0; i < infoPoint.length; i++) {
    if (infoPoint[i].localName == "div") {
        infoPoint[i].addEventListener("click",(e)=>{
            //Действия при нажатии errorPoin
            if (e.target.className == "pointJobsError") {
                let point = e.target;
                let namePointError = point.textContent;
                let place = point.getAttribute('place');
                let dataName = point.getAttribute('data-name');
                let dataJobs = point.getAttribute('data-jobs');
                document.querySelector(".close-import").id ='infoPoint';
                //Номер точки
                let naminfoData = document.querySelector(".namePoint");
                //Тип и Вид работы
                let typeAndJobsPoint = document.querySelector(".typeAndJobsPoint");
                //Название Участка работы
                let plasePoint = document.querySelector(".plasePoint");
                //Создаем новые атрибуты
                naminfoData.setAttribute("place", place);
                naminfoData.setAttribute("data-name", dataName);
                naminfoData.setAttribute("data-jobs", dataJobs);
                naminfoData.innerText = namePointError;   
                typeAndJobsPoint.innerText = dataName+"/"+dataJobs;
                plasePoint.innerText = place;
                document.querySelector("#import").style.display = "block";
                document.querySelector("#funktionalEdit").style.display = "none";
                document.querySelector("#infoPoint").addEventListener("click", ()=>{
                  document.querySelector("#settingBlock").style.display = "none";
                  document.querySelector("#import").style.display = "none";
                  document.querySelector("#funktionalEdit").style.display = "block";
                  document.querySelector(".close-import").removeAttribute("id");
                });
            }   
        })  
    }
}

//Effects анимация accordion
let acc = document.getElementsByClassName("accordion");
for (let i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function() {
  //Toggle between adding and removing the "active" class to highlight the option that controls the panel
  this.classList.toggle("activeAccord");
  //Switch between hiding and showing the active panel
    var panel = this.nextElementSibling;
    if (panel.style.display === "block") {
      panel.style.display = "none";
    } else {
      panel.style.display = "block";
    }
  });
}  