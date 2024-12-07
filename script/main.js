//Импорт информации с таблицы с планом работы
document.addEventListener("planningWork", (planning) => {
    parsinWork(planning.detail.planningNiv, jobsNiv);
    parsinWork(planning.detail.planningTrig, jobsTrig);
});

function parsinWork(planingWork, markerPoimt) {    
    planingWork.forEach(point => {
        const parsedData = {};
        const regex = /namber:\s*([\w\d\(\)-]+)|position:\s*([\d\s,.]+)|vycka:\s*([\d.,]+)|date:\s*([\d.]+)|JTSK:\s*([\w\d\s]+)|positionType:\s*(\w+)/g;
        let match;
        while ((match = regex.exec(point)) !== null) {            
            if (match[1]) parsedData["namber"] = match[1];
            if (match[2]) parsedData["position"] = match[2]
                .split(/[,\s]+/) // Разделяем по запятым и пробелам
                .filter(num => num.trim() !== "") // Убираем пустые строки
                .map(Number); // Преобразуем в числа
            if (match[3]) parsedData["vycka"] = parseFloat(match[3].replace(',', '.'));;
            if (match[4]) parsedData["date"] = match[4];
            if (match[5]) parsedData["JTSK"] = match[5].trim();
            if (match[6]) parsedData["positionType"] = match[6];
        }
        if (parsedData["position"] !== undefined) {
            createMarker(parsedData["namber"], parsedData["position"], parsedData["JTSK"], parsedData["vycka"], parsedData["positionType"], markerPoimt); 
        }         
    });
}


//Карта
//СЛОИ КАРТЫ
//Спутник
let key = "328W3i5uAdhtTMZr8hrV";
let OSMsatelitMap = L.tileLayer('https://api.maptiler.com/maps/satellite/{z}/{x}/{y}.jpg?key='+key, {maxZoom: 22,attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a>'});
//Растр
let OSMstritMap = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 20, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'});
//Определие слоя КАРТЫ
let map = L.map('map', {
  center: [50.047266, 14.440722],
  zoom: 15,
  //вращение карты
  rotate: true,
  rotateControl: {
    closeOnZeroBearing: false,
    position: 'topleft',
    },
  bearing: 0, 
  compassBearing: false, 
  //сенсорное взаимодействие вращало карту
  touchRotate: true,
  layers: [OSMstritMap]});

//Наполнение слоя
//Формируем наполнение на карте
//Базовые точки
let mainNiv = L.icon({
    iconUrl: './icons/main-niv.png',
    iconRetinaUrl: './icons/main-niv-2x.png',
    shadowUrl: './icons/main-niv-shadow.png',

    iconSize:     [20, 20],
    iconAnchor:   [0,0], 
    popupAnchor:  [8, -1]
});
let mainTrig = L.icon({
    iconUrl: './icons/main-trig.png',
    iconRetinaUrl: './icons/main-trig-2x.png',
    shadowUrl: './icons/main-trig-shadow.png',

    iconSize:     [20, 20],
    iconAnchor:   [0,0],
    popupAnchor:  [8, -1]
});
//Рабочие точки
let jobsNiv = L.icon({
    iconUrl: './icons/jobs-niv.png',
    iconRetinaUrl: './icons/jobs-niv-2x.png',
    shadowUrl: './icons/jobs-niv-shadow.png',

    iconSize:     [20, 20],
    iconAnchor:   [0,0], 
    popupAnchor:  [8, -1]
});
let jobsTrig = L.icon({
    iconUrl: './icons/jobs-trig.png',
    iconRetinaUrl: './icons/jobs-trig-2x.png',
    shadowUrl: './icons/jobs-trig-shadow.png',

    iconSize:     [20, 20],
    iconAnchor:   [0,0],
    popupAnchor:  [8, -1]
});

/*СЛОИ*/
//КАРТ
let baseMaps = {
    "Satelit Map": OSMsatelitMap,
    "Strit Map": OSMstritMap
  };

//ТОЧЕК
//Бызовые точки
//Нивилирования
let pointLayerNiv =[];
//Тахеометрии
let pointLayerTax =[];

//Рабочии точки
//Нивилирования
let operatingPointsNiv = L.marker([39.75, -110.09],{icon: jobsNiv}).bindPopup('Operating points Niv .');
//Тахеометпии
let operatingPointsTax = L.marker([39.75, -109.09],{icon: jobsTrig}).bindPopup('Operating points Tax.');

//Меню отображения слоев Базовая
let layerControl = L.control.layers(baseMaps).addTo(map);
//Виды слоев точек Дополнительная
//Нивелирование
//layerControl.addOverlay(basePointsNiv, "<span style='color: red'>Base points Niv.</span>");
//layerControl.addOverlay(operatingPointsNiv, "<span style='color: green'>Operating points Niv.</span><hr>");
//Тахеометрия
//layerControl.addOverlay(basePointsTax, "<span style='color: red'>Base points Tax.</span>");
//layerControl.addOverlay(operatingPointsTax, "<span style='color: green'>Operating points Tax.</span>");

/*------------------------------------------*/

//Извлекаем информацию о точках
let xhr = new XMLHttpRequest();
//запрос на извлечение
xhr.open("GET","./koordinaty/koordinats.json");
//Устанавливаем что будем возврашать
xhr.responseType = "json";
xhr.send();
createСontent();
//Считываем информацию для отображения информации на карте
function createСontent() {
    xhr.onload = ()=>{
        if (xhr.readyState === 4 && xhr.status === 200) {
            let respon = xhr.response;
            for (const infoPoint of Object.entries(respon)) {
                switch (infoPoint[0]) {
                        case "base":
                        for (const info of Object.entries(infoPoint[1].niv)){
                            //createMarker(info[0], info[1].position, info[1].systemCoordinates, info[1].vycka, info[1].positionType, mainNiv);
                            //console.log(info[0], info[1].position, info[1].systemCoordinates, info[1].vycka, info[1].positionType);   
                            pointLayerNiv.push(createMarker(info[0], info[1].position, info[1].systemCoordinates, info[1].vycka, info[1].positionType, mainNiv));
                        }
                        let basePointsNiv = L.layerGroup(pointLayerNiv);
                        layerControl.addOverlay(basePointsNiv, "<span style='color: red'>Base points Niv.</span>");
                        
                        for (const info of Object.entries(infoPoint[1].trig)){
                            //createMarker(info[0], info[1].position, info[1].systemCoordinates, info[1].vycka, info[1].positionType, mainTrig);
                            //console.log(info[0], info[1].position, info[1].systemCoordinates, info[1].vycka, info[1].positionType);
                            pointLayerTax.push(createMarker(info[0], info[1].position, info[1].systemCoordinates, info[1].vycka, info[1].positionType, mainTrig));
                        }
                        let basePointsTax = L.layerGroup(pointLayerTax);
                        layerControl.addOverlay(basePointsTax, "<span style='color: red'>Base points Tax.</span>");
                        break;
                        case "poligons":
                        for (const info of Object.entries(infoPoint[1])){
                            for (const  value of Object.entries(info)) {
                                if (value[0] == 0) {
                                    //console.log(value[1]);
                                }
                                if (value[0] == 1) {
                                    for (const  bot of Object.entries(value[1])) {
                                        //createMarker(bot[0], bot[1].position, bot[1].systemCoordinates, bot[1].vycka, bot[1].positionType, jobsNiv)
                                        //console.log(bot[0], bot[1].position, bot[1].systemCoordinates, bot[1].vycka, bot[1].positionType);   
                                    }
                                }
                            }
                        }
                        break;
                }
            }
        }    
    }
}

function createMarker(name, position, systemCoordinates, vycka, positionType, iconPoint) {
    console.log(name, position, systemCoordinates, vycka, positionType, iconPoint);
    
 if (systemCoordinates == "JTSK") {
        var conv = new JTSK_Converter();
        var wgs = conv.JTSKtoWGS84(position[1], position[0]);
        //Подключение маркера с конвертацией JTSKtoWGS84
        var marker = L.marker([wgs.lat,wgs.lon],{icon: iconPoint}).bindPopup("<b>"+name+"</b><br>Vycka: "+vycka+" m.<br>Type: "+positionType);
        return marker;
    } else {
        //Подключение маркера с WGS84
    }
}

/*Моя геолокация*/
let lc = L.control.locate({
    locateOptions: {
        maxZoom: 18,//масштабиролвание
        enableHighAccuracy: true//высокая точность
      },
        strings: {
            title: "Find my location"
          },
        enableHighAccuracy: true,
        flyTo: true,//Плавное увеличение
        returnToPrevBounds: true//Возврат назат
  }).addTo(map);
//Выводит ошибки геолокации
function onLocationError(e) {alert(e.message);}
map.on('locationerror', onLocationError);

/*Масштабная линейка*/
L.control.betterscale().addTo(map);
/*------------------------------------------*/
/*
//Определяем координаты
var popup = L.popup();
function onMapClick(e) {
    //JTSK
    var conv = new JTSK_Converter();
    var wgs = conv.WGS84toJTSK(e.latlng.lat, e.latlng.lng);
    console.log(typeof(e.latlng.lat));
    
popup
    .setLatLng(e.latlng)
    .setContent("You clicked the map at:  <br><b>WGS84 -</b> <br>" + (e.latlng.lat).toFixed(8)+","+(e.latlng.lng).toFixed(8)+"<br> <b>JTSK - </b><br>"+(wgs.x).toFixed(0)+","+(wgs.y).toFixed(0) )
    .openOn(map);  
}
map.on('click', onMapClick);

//Подключаем камеру
let constraints = { audio: false, video: { width: 1280, height: 720 } };
let setting = document.querySelector(".setting");
setting.addEventListener("click",()=>{
    promise = navigator.mediaDevices.getUserMedia(constraints);
})
*/