const moment = require('moment');


const dateMapHashed = dateMapArray => {
    let dateMapNew = {
        byHash: {},
        byId: []
    }
    if(dateMapArray!= undefined && dateMapArray.length > 0){
    dateMapArray.forEach(dateMap => {

    let prevMonday = new Date();
    prevMonday.setDate(prevMonday.getDate() - (prevMonday.getDay() + 6) % 7);
    const currentWeekMon = (prevMonday.getTime())
    const currentWeekNum = moment(currentWeekMon).week();
    const currentMonthNum = moment(currentWeekMon).month();
    
    const recordDate = (parseInt(dateMap[1]) - 25569) * 24 * 60 * 60 * 1000
    let recordWeekNumber = moment(recordDate - (24 * 60 * 60 * 1000)).week();
    let recordMonthNumber = moment(recordDate).month();

    let currentWeek = false;
    let currentMonth = false;
    let previousWeek = false;
    let previousMonth = false;

    if(currentWeekNum === recordWeekNumber) {
        currentWeek = true;
    }
    if(currentWeekNum ===1 && recordWeekNumber === 52) {
        previousWeek = true;
    }
    if(currentWeekNum -1 === recordWeekNumber) {
        previousWeek = true;
    }
    
    if(currentMonthNum === recordMonthNumber) {
        currentMonth = true;
    }

    if(currentMonthNum === 0 && recordMonthNumber === 12) {
        previousMonth = true;
    }
    if(currentMonthNum - 1 === recordMonthNumber) {
        previousMonth = true;
    }



        let dateMapGuid = encodeURIComponent(dateMap[1])
        let dateMapTrim = {
            date: dateMap[0],
            dateNum: dateMap[1],
            week: dateMap[2],
            month: dateMap[3],
            finYear: dateMap[4],
            calYear: dateMap[5],
            currentWeek: currentWeek,
            previousWeek: previousWeek,
            currentMonth: currentMonth,
            previousMonth: previousMonth
        }
        dateMapNew.byHash[dateMapGuid] = dateMapTrim
        dateMapNew.byId.push(dateMapGuid);
    })
}


    return dateMapNew;

}




module.exports = {
    dateMapHashed
}