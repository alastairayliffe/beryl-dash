

const prodMapHashed = prodMapArray => {
    let prodMapNew = {
        byHash: {},
        byId: []
    }
    if (prodMapArray!= undefined && prodMapArray.length > 0) {
        prodMapArray.forEach(prodMap => {
            let prodMapGuid = encodeURIComponent(prodMap[2])
            let prodMapTrim = {
                ProductCode: prodMap[0],
                ProductDescription: prodMap[1],
                ProductGuid: prodMap[2],
                ProductGroupName: prodMap[3],
                Mapping: prodMap[4],
            }
            prodMapNew.byHash[prodMapGuid] = prodMapTrim
            prodMapNew.byId.push(prodMapGuid);
        })
    }
    return prodMapNew;

}

module.export = {
    prodMapHashed
}