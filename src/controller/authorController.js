const authorModel = require("../model/authorModel");
const emailValidator = require("email-validator");
const jwt = require('jsonwebtoken');

//======regex of name and password============
let nameRegex = /^[a-zA-Z]{1,20}$/
// let passwordRegex = /^[a-zA-Z]\w{3,14}$/


//=======route handler for creating author========
const createAuthor = async function (req, res) {
    try {
        let authorData = req.body;
        let { fname, lname, title, email, password } = authorData;

        if (Object.keys(authorData).length != 0) {

            //====fname validation====
            if (!fname || fname == "") {
                return res.status(400).send({ status: false, msg: "Invalid request , fname is required." });
            }
            fname = authorData.fname = fname.trim();
            if (!nameRegex.test(fname)) {
                return res.status(400).send({ status: false, msg: "Please provide valid fname" });
            }

            //====lname validation====
            if (!lname || lname == "") {
                return res.status(400).send({ status: false, msg: "Invalid request , lname is required." });
            }
            lname = authorData.lname = lname.trim();
            if (!nameRegex.test(lname)) {
                return res.status(400).send({ status: false, msg: "Please provide valid lname" });
            }

            //====title validation====
            if (!title || title == "") {
                return res.status(400).send({ status: false, msg: "Invalid request , title is required." });
            }
            title = authorData.title = title.trim();
            if (title) {
                if (!(["Miss", "Mrs", "Mr"].includes(title))) {
                    return res.status(400).send({ status: false, msg: "Invalid request , Please provide valid title." });
                }
            }

            //====email validation====
            if (!email) {
                return res.status(400).send({ status: false, msg: "Invalid request , email is required." });
            }
            if (!emailValidator.validate(email)) {
                return res.status(400).send({ status: false, msg: "Invalid email" });
            }
            const emailExist = await authorModel.findOne({ email: authorData.email });
            if (emailExist) {
                return res.status(400).send({ status: false, msg: "Email Already Exist Try with anothor Email Id" });
            }

            //====password validation====
            if (!password) {
                return res.status(400).send({ status: false, msg: "Invalid request , password is required." });
            }
            // if (!passwordRegex.test(password)) {
            //     return res.status(400).send({ status: false, msg: "Please provide valid alphanumeric password having minimum character 8" });
            // }

            //============after all validation passed auth data created===========
            const saveData = await authorModel.create(authorData);
            res.status(201).send({ status: true, msg: saveData });

        } else {
            return res.status(400).send({ status: false, msg: "Invalaid Request" });
        }
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
};

//================login route handler============
const logInAuthor = async function (req, res) {
    try {
        let data = req.body;
        let email = req.body.email;
        let password = req.body.password;
        if (Object.keys(data).length != 0) {

            //======varifing email and password============
            let author = await authorModel.findOne({ email: email, password: password });
            if (!author) {
                return res.status(401).send({ status: false, msg: "Email or password is Incorrect or missing." });
            }

            //======after varification get successful token will create==========
            const token = jwt.sign({ authorId: author._id.toString() }, "sanket-screte-key");
            res.header("x-api-key",token);//setting token too the response header

            res.status(201).send({ status: true, "token": token  });

        } else {
            return res.status(400).send({ status: false, msg: "invalid request" });
        }
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
};


module.exports.createAuthor = createAuthor;
module.exports.logInAuthor = logInAuthor;