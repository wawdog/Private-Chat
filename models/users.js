


function User(mysql){

    this.mysql = mysql;
    this.findByEmail = function (email, callback) {
        this.mysql.execute("SELECT id, Email as email, password , Namepic FROM `t_people` WHERE `email` = '" + email + "' limit 0,1", callback);
    };

}

module.exports = new User(global.Mysql.UserDB());