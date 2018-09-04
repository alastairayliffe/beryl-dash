

const dateMapHashed = dateMapArray => {
    let dateMapNew = {
        byHash: {},
        byId: []
    }
    if(dateMapArray!= undefined && dateMapArray.length > 0){
    dateMapArray.forEach(dateMap => {
        let dateMapGuid = encodeURIComponent(dateMap[1])
        let dateMapTrim = {
            date: dateMap[0],
            dateNum: dateMap[1],
            week: dateMap[2],
            month: dateMap[3],
            finYear: dateMap[4],
            calYear: dateMap[5],
            currentWeek: dateMap[6],
            previousWeek: dateMap[7],
            currentMonth: dateMap[8],
            previousMonth: dateMap[9]
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