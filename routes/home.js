
const user = require('../controllers/userAuthController')

module.exports.Homepage = async function(req, res){
    const User = await user.Finduser(req)
 
     res.render('home',{user:User})
}
