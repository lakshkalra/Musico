const router = require("express").Router()
const mongoose = require("mongoose")
const User = require("../../models/Artist/user")
const jwt = require("jsonwebtoken")
const config = require("config")
const bcrypt = require("bcryptjs")
const { check, validationResult } = require("express-validator");


router.post("/signup",
    [
        check("name", "name is required").not().isEmpty(),
        check("username", "username is required").not().isEmpty(),
        check("email", "enter a valid email").isEmail(),
        check("password", "password must be 6 character long").isLength({ min: 6 })
    ],
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        const { name, username, email, password } = req.body;

        try {
            let user = await User.findOne({ username })

            //Checking if user already exist
            if (user) {
                return res.status(400).json({ errors: "user already exists" })
            }

            user = new User({
                name, username, email, password,
            });


            //Encrypting of password
            const salt = await bcrypt.genSalt(10)

            user.password = await bcrypt.hash(password, salt)

            await user.save()

            // JWT
            const payload = {
                user: {
                    id: user.id
                }
            }

            jwt.sign(
                payload, config.get("JWTtoken"),
                { expiresIn: 360000 },
                (err, token) => {
                    if (!err) {
                        return res.status(200).json({ token })
                    }
                }
            )
        } catch (error) {
            console.log(error)
            res.status(500).json("server error")
        }
    })


router.post("/signin",
    [
        check("username", "username is required").not().isEmpty(),
        check("password", "password must be 6 character long").isLength({ min: 6 })
    ], async (req, res) => {
        const errors = validationResult(req)
        if (!errors) {
            return res.status(400).json({ errors: errors.array() })
        }

        const { username, password } = req.body;

        try {
            let user = await User.findOne({ username })

            if (!user) {
                return res.status(400).json({ msg: "invalid credentials" })
            }
            const ispass = await bcrypt.compare(password, user.password);
            if (!ispass) {
                return res.status(400).json({ msg: "invalid credentials" });
            }

            const payload = {
                user: {
                    id: user.id
                }
            }


            jwt.sign(payload, config.get("JWTtoken"),
                { expiresIn: 360000 },
                (err, token) => {
                    if (!err) {
                        return res.status(200).json({ token })
                    }
                }
            )
        } catch (error) {
            res.status(500).json({ msg: "server error" })
        }
    })
module.exports = router