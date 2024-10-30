


function snapsort(designer){

    let topDesigner = []
    
 topDesigner =  designer.sort((a,b)=>{
        if(a.choicelist.length< b.choicelist.length)
            return 1
        else if(a.choicelist.length > b.choicelist.length) return -1 
        else return 0
    })               

    return {topDesigner}
}

module.exports = {snapsort}