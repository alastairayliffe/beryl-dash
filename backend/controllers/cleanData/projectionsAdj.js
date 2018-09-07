


const projectionsAdjHashed = projectionsAdjArray => {
    let projectionsAdjNew = {
        byHash: {},
        byId: []
    }
    if (projectionsAdjArray != undefined && projectionsAdjHashed.length > 0) {
        let index = 1;
        projectionsAdjArray.forEach(projectionAdj => {
            let projectionAdjGuid = index
            if (projectionAdj[0] != "") {
                let projectionAdjTrim = {
                    date: projectionAdj[0],
                    dateNum: parseInt(projectionAdj[1]),
                    adjType: projectionAdj[2],
                    prodMap: projectionAdj[3],
                    salesOrderType: projectionAdj[4],
                    customerType: projectionAdj[5],
                    quantity: projectionAdj[6],
                }

                projectionsAdjNew.byHash[projectionAdjGuid] = projectionAdjTrim
                projectionsAdjNew.byId.push(projectionAdjGuid);
            }
            index = index + 1
        })
    }
    return projectionsAdjNew;
}

module.exports = {
    projectionsAdjHashed
}