    //Дата сегодня
    const todayDate = new Date();
    const year = todayDate.getFullYear();
    const month = String(todayDate.getMonth() + 1).padStart(2, '0'); // Добавляет ведущий ноль, если нужно
    const day = String(todayDate.getDate()).padStart(2, '0'); // Добавляет ведущий ноль, если нужно
    const searchDateInput = `2024-11-18`;//${year}-${month}-${day}
    const fileUrl = './xlsx/Jobs_kalendar.xlsx'; // Укажите URL-адрес Excel файла
    const jsonFileUrl = './koordinaty/koordinats.json'; // Укажите URL-адрес json файла
    //Для контроля
    //console.log('Дата:', searchDateInput);
    
    // Функция преобразования даты в формат Excel
    function dateToExcelDate(date) {
        const excelEpoch = new Date(Date.UTC(1899, 11, 30)); // Excel "нулевой день"
        const dayInMilliseconds = 24 * 60 * 60 * 1000;
        return Math.floor((date - excelEpoch) / dayInMilliseconds);
    }

    try {
        // Преобразуем дату в числовой формат Excel
        const searchDate = dateToExcelDate(new Date(searchDateInput));

        // Загружаем файл по URL
        const response = await fetch(fileUrl);
        if (!response.ok) {
            throw new Error('Не удалось загрузить файл');
        }

        const fileData = await response.arrayBuffer();
        const workbook = XLSX.read(fileData, { type: 'array' });
        
        // Загружаем JSON файл
        const jsonResponse = await fetch(jsonFileUrl);
        if (!jsonResponse.ok) {throw new Error('Не удалось загрузить JSON файл');}
        const jsonData = await jsonResponse.json();
        //Для контроля
        //console.log('JSON данные Базовые:', jsonData.Base, 'JSON данные Рабочие:', jsonData.poligons);
        
        const results = [];
        const resultsTip = {niv: [], trig: [], nivBase: [], trigBase: []};

        // Обрабатываем каждый лист
        for (const sheetName of workbook.SheetNames) {
            const sheet = workbook.Sheets[sheetName];
            const sheetData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
            //Для контроля
            //console.log(`Обрабатываем лист: ${sheetName}`); // Лог текущего листа
            
            if (sheetData.length === 0) {
                results.push(`${sheetName}: Лист пустой`);                
                continue;
            }

            let columnIndex = -1;
            // Ищем дату в первой строке (заголовке)
            const targetRow = sheetData[0];
            targetRow.forEach((cell, index) => {              
                if (cell === searchDate) {
                    columnIndex = index;
                }
            });

            if (columnIndex === -1) {
                results.push(`${sheetName}: Дата не найдена`);
                continue;
            }

            // Проверяем, есть ли значение "1" в найденном столбце
            const colData = sheetData
                .slice(2) // Пропускаем заголовок
                .map(row => row[columnIndex]); // Значения из найденного столбца
            const hasOne = colData.some(value => value === 1);
            //Для контроля
            //console.log(`Количество найденных точек на листе "${sheetName}":`, colData[0]);
            
            if (hasOne) {
                // Выводим значения из столбца B и C
                const columnData = sheetData
                    .slice(2) // Пропускаем заголовок
                    .filter((row,index) => colData[index] === 1) // Берем только строки, где в найденном столбце "1"
                    .map(row => ({
                        B: row[1], // Столбец B
                        C: row[2], // Столбец C
                    }));
                    //Для контроля
                   //console.log(columnData);
                    if (sheetName == "Base") {
                        //Base
                        columnData.forEach(row => {  
                            if (row.C == 'n') {    
                                if (jsonData.Base.niv[row.B] !== undefined) {
                                    resultsTip.nivBase.push(`place: ${sheetName} , namber: ${row.B} , position: ${jsonData.Base.niv[row.B].position[0]} , ${jsonData.Base.niv[row.B].position[1]}, vycka: ${jsonData.Base.niv[row.B].vycka}, date: ${jsonData.Base.niv[row.B].date}, systemCoordinates: ${jsonData.Base.niv[row.B].systemCoordinates}, positionType: ${jsonData.Base.niv[row.B].positionType}`);
                                }
                                else{resultsTip.nivBase.push(`place: ${sheetName} , namber: ${row.B} , data not found in database`);}
                            } else {
                                if (jsonData.Base.trig[row.B] !== undefined) {
                                    resultsTip.trigBase.push(`place: ${sheetName} , namber: ${row.B} , position: ${jsonData.Base.trig[row.B].position[0]} , ${jsonData.Base.trig[row.B].position[1]}, vycka: ${jsonData.Base.trig[row.B].vycka}, date: ${jsonData.Base.trig[row.B].date}, systemCoordinates: ${jsonData.Base.trig[row.B].systemCoordinates}, positionType: ${jsonData.Base.trig[row.B].positionType}`);
                                }
                                else{resultsTip.trigBase.push(`place: ${sheetName} , namber: ${row.B} , data not found in database`);}
                            }
                        });
                        results.push(`${sheetName} (leng ${colData[0]}):\n` + resultsTip.nivBase.join('\n') + resultsTip.trigBase.join('\n'));  
                    } else {//poligons
                        columnData.forEach(row => {  
                            if (row.C == 'n') { 
                                if (jsonData.poligons[sheetName][row.B] !== undefined) {
                                    resultsTip.niv.push(`place: ${sheetName} , namber: ${row.B} , position: ${jsonData.poligons[sheetName][row.B].position[0]} , ${jsonData.poligons[sheetName][row.B].position[1]}, vycka: ${jsonData.poligons[sheetName][row.B].vycka}, date: ${jsonData.poligons[sheetName][row.B].date}, systemCoordinates: ${jsonData.poligons[sheetName][row.B].systemCoordinates}, positionType: ${jsonData.poligons[sheetName][row.B].positionType}`);
                                }
                                else{resultsTip.niv.push(`place: ${sheetName} , namber: ${row.B} , data not found in database`);}
                            } else {
                                if (jsonData.poligons[sheetName][row.B] !== undefined) {
                                    resultsTip.trig.push(`place: ${sheetName} , namber: ${row.B} , position: ${jsonData.poligons[sheetName][row.B].position[0]} , ${jsonData.poligons[sheetName][row.B].position[1]}, vycka: ${jsonData.poligons[sheetName][row.B].vycka}, date: ${jsonData.poligons[sheetName][row.B].date}, systemCoordinates: ${jsonData.poligons[sheetName][row.B].systemCoordinates}, positionType: ${jsonData.poligons[sheetName][row.B].positionType}`);
                                }
                                else{resultsTip.trig.push(`place: ${sheetName} , namber: ${row.B} , data not found in database`);}
                            }
                        });
                        results.push(`${sheetName} (leng ${colData[0]}):\n` + resultsTip.niv.join('\n') + resultsTip.trig.join('\n')); 
                    }
            } else {
                    results.push(`${sheetName}: В столбце нет значения "1".`);
            }
        }
        //Для контроля
        //console.log(results.join('\n\n\n'));
        /// Создаем и отправляем пользовательское событие с данными
        const planning = new CustomEvent("planningWork", { detail: {baseNiv: resultsTip.nivBase, baseTrig: resultsTip.trigBase ,planningNiv: resultsTip.niv, planningTrig: resultsTip.trig}});
        document.dispatchEvent(planning);
    } catch (error) {
        console.error('Ошибка при обработке файла:', error);
        alert('Ошибка при обработке файла. Проверьте файл и повторите попытку.');
    }
    