
const projectionsHashed = projectionsArray => {
    let projectionsNew = {
        byHash: {},
        byId: []
    }
    if (projectionsArray!= undefined &&  projectionsArray.length > 0) {
        let index = 1;
        projectionsArray.forEach(projection => {
            let projectionGuid = index
            let projectionTrim = {
                date: projection[0],
                dateNum: parseInt(projection[1]),
                productMap: projection[2],
                product: projection[5],
                customerType: projection[4],
                salesOrderType: projection[3],
                quantity: parseFloat(projection[6]),
                revenue: parseFloat(projection[7]),
            }
            projectionsNew.byHash[projectionGuid] = projectionTrim
            projectionsNew.byId.push(projectionGuid);
            index = index + 1
        })
    }
    return projectionsNew;
}

module.exports = {
    projectionsHashed
}