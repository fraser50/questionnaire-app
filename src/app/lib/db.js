const sqlite3 = require("sqlite3");

let db = undefined;

export function getDB() {
    if (db == undefined) {
        db = new sqlite3.Database("db.sqlite3");

        // Initialise tables

        db.run("CREATE TABLE IF NOT EXISTS forms (id INTEGER PRIMARY KEY, formData TEXT)");
        db.run("CREATE TABLE IF NOT EXISTS answers (id INTEGER PRIMARY KEY, answerData TEXT, formID INTEGER REFERENCES forms(id))")
    }
    
    return db;
}

export function dbGet(sql, parameters) {
    let db = getDB();

    return new Promise((resolve, reject) => {
        db.get(sql, parameters, (err, row) => {
            if (err) {
                reject(err);

            } else {
                resolve(row);
            }
        });
    });

}

export function dbRun(sql, parameters) {
    let db = getDB();
    
    return new Promise((resolve, reject) => {
        db.run(sql, parameters, function(err)  {
            if (err) {
                reject(err);

            } else {
                resolve(this);
            }
        });
    });
}