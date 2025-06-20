require("dotenv").config();
const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const System = require("../new-models/system");
const Competition = require("../new-models/competition");
const User = require("../new-models/user");
const Task = require("../new-models/task");
const Quiz = require("../new-models/quiz");

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD
    }
})

const isAuthenticated = (req, res, next) => {
    if (!req.session.userId) {
        res.redirect("/login");
    } else {
        next();
    }
};
const General = async (req, res, next) => {
    let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    await Competition.updateOne({},{ $inc: { 'analytics.views': 1 } });
    if(await System.findOne({banned_IPList: ip})) {
        res.render("error", {
            code: "403",
            msg: "You are banned from this site.",
            icon: "fa-solid fa-ban",
            username: []
        });
    }
    if(!await System.findOne({IPList: ip})){
        await Competition.updateOne({},{ $inc: { 'analytics.unique_visitors': 1 } });
    }
}
const isEnabled = async (req, res, next) => {
    try {
        const data = await Competition.findOne({});
        if (!data.competition_enabled) {
            let username = [];
            if (req.session.userId) {
                username.push(req.session.username);
            }
            res.render("error", {
                code: "403",
                msg: "Competition Will Start Soon...",
                icon: "fa-solid fa-clock",
                username: username
            });
        } else {
            next();
        }
    }
    catch (e) {
        console.error('Error');
        next();
    }
};


// General
router.get("/",General, async (req, res, next) => {
    let username = [];
    if (req.session.userId) {
        username.push(req.session.username);
    }
    res.render("index.ejs", {
        username: username
    });
});

router.get("/help",General, (req, res, next) => {
    let username = [];
    if (req.session.userId) {
        username.push(req.session.username);
    }
    res.render("help", {
        username: username
    });
})

router.get("/thanks",General, (req, res, next) => {
    let username = [];
    if (req.session.userId) {
        username.push(req.session.username);
    }
    res.render("thanks", {
        username: username
    });
})

router.get("/leaderboard",General, isEnabled, async (req, res, next) => {
    let username = [];
    if (req.session.userId) {
        username.push(req.session.username);
    }

    const users = await User.find().filter(function (data) {
        return data.admin === false && data.competitionData.points !== 0;
    }).sort((a, b) => {
        return b.competitionData.points - a.competitionData.points;
    })
    let leaderboard = [];

    for (let i = 0; i < users.length; i++) {
        const tasks = users[i].competitionData.tasks.filter(function (data) {
            return data.status === 2;
        })
        leaderboard.push({
            username: users[i].username,
            points: users[i].competitionData.points,
            grade: users[i].grade,
            tasks: tasks.length
        })
    }

    res.render("leaderboard", {
        db: leaderboard,
        i: 1,
        username: username
    });
});


//Account Management
router.get("/signup", General, (req, res, next) => {
    let username = [];
    if (req.session.userId) {
        username.push(req.session.username);
    }
    return res.render("signup.ejs", {
        username: username
    });
});

router.post("/signup", async (req, res, next) => {
    let personInfo = req.body;

    if (
        !personInfo.email ||
        !personInfo.username ||
        !personInfo.password ||
        !personInfo.passwordConf
    ) {
        res.send();
    } else {
            User.findOne({ email: personInfo.email }, async (err, data) => {
                if (!data) {

                        let newPerson = new User({
                            email: personInfo.email,
                            username: personInfo.username,
                            name: personInfo.fullname,
                            age: personInfo.age,
                            grade: personInfo.grade,
                            contact: personInfo.contact,
                            password: personInfo.password,
                            admissionNo: req.body.admission,
                        });

                        newPerson.save((err, Person) => {
                            if (err) console.log(err);
                            else {
                                async function main() {
                                    await Competition.updateOne({},{ $inc: { 'analytics.signups': 1 } });
                                    transporter.sendMail({
                                        from: {
                                            address: process.env.SMTP_EMAIL,
                                            name: "Bits'25",
                                        },
                                        to: personInfo.email,
                                        subject: `Welcome To Bits'25`,
                                        html: `<!DOCTYPE html>
<html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">

<head>
    <title></title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0"><!--[if mso]>
    <xml><w:WordDocument xmlns:w="urn:schemas-microsoft-com:office:word"><w:DontUseAdvancedTypographyReadingMail/></w:WordDocument>
        <o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml>
    <![endif]--><!--[if !mso]><!-->
    <link href="https://fonts.googleapis.com/css2?family=Ubuntu:wght@100;200;300;400;500;600;700;800;900" rel="stylesheet" type="text/css"><!--<![endif]-->
    <style>
        * {
            box-sizing: border-box;
        }

        body {
            margin: 0;
            padding: 0;
        }

        a[x-apple-data-detectors] {
            color: inherit !important;
            text-decoration: inherit !important;
        }

        #MessageViewBody a {
            color: inherit;
            text-decoration: none;
        }

        p {
            line-height: inherit
        }

        .desktop_hide,
        .desktop_hide table {
            mso-hide: all;
            display: none;
            max-height: 0px;
            overflow: hidden;
        }

        .image_block img+div {
            display: none;
        }

        sup,
        sub {
            font-size: 75%;
            line-height: 0;
        }

        @media (max-width:620px) {
            .desktop_hide table.icons-inner {
                display: inline-block !important;
            }

            .icons-inner {
                text-align: center;
            }

            .icons-inner td {
                margin: 0 auto;
            }

            .mobile_hide {
                display: none;
            }

            .row-content {
                width: 100% !important;
            }

            .stack .column {
                width: 100%;
                display: block;
            }

            .mobile_hide {
                min-height: 0;
                max-height: 0;
                max-width: 0;
                overflow: hidden;
                font-size: 0px;
            }

            .desktop_hide,
            .desktop_hide table {
                display: table !important;
                max-height: none !important;
            }
        }
    </style><!--[if mso ]><style>sup, sub { font-size: 100% !important; } sup { mso-text-raise:10% } sub { mso-text-raise:-10% }</style> <![endif]-->
</head>

<body class="body" style="background-color: #f0f0f0; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
<table class="nl-container" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f0f0f0; background-size: auto; background-image: none; background-position: top left; background-repeat: no-repeat;">
    <tbody>
    <tr>
        <td>
            <table class="row row-1" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-size: auto;">
                <tbody>
                <tr>
                    <td>
                        <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url(https://i.imgur.com/g9HweM6.png); background-repeat: no-repeat; background-size: cover; background-color: #050f19; color: #000000; width: 600px; margin: 0 auto;" width="600">
                            <tbody>
                            <tr>
                                <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top;">
                                    <div class="spacer_block block-1" style="height:60px;line-height:60px;font-size:1px;">&#8202;</div>
                                    <table class="image_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                        <tr>
                                            <td class="pad" style="width:100%;padding-right:0px;padding-left:0px;">
                                                <div class="alignment" align="center">
                                                    <div style="max-width: 180px;"><img src="https://bits.acicts.lk/img/bits-logo.png" style="display: block; height: auto; border: 0; width: 100%;" width="180" alt title height="auto"></div>
                                                </div>
                                            </td>
                                        </tr>
                                    </table>
                                    <div class="spacer_block block-3" style="height:60px;line-height:60px;font-size:1px;">&#8202;</div>
                                    <table class="heading_block block-4" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                        <tr>
                                            <td class="pad" style="text-align:center;width:100%;">
                                                <h1 style="margin: 0; color: #2788f7; text-shadow: 0 0 60px #2788F7; direction: ltr; font-family: 'Ubuntu', Tahoma, Verdana, Segoe, sans-serif; font-size: 40px; font-weight: 700; letter-spacing: normal; line-height: 1.2; text-align: center; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 48px;"><span class="tinyMce-placeholder" style="word-break: break-word;">WELCOME TO</span></h1>
                                            </td>
                                        </tr>
                                    </table>
                                    <table class="heading_block block-5" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                        <tr>
                                            <td class="pad" style="text-align:center;width:100%;">
                                                <h1 style="margin: 0; color: #2788f7; text-shadow: 0 0 60px #2788F7; direction: ltr; font-family: 'Ubuntu', Tahoma, Verdana, Segoe, sans-serif; font-size: 50px; font-weight: 700; letter-spacing: normal; line-height: 1.2; text-align: center; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 60px;"><span class="tinyMce-placeholder" style="word-break: break-word;">BITS'25</span></h1>
                                            </td>
                                        </tr>
                                    </table>
                                    <table class="paragraph_block block-6" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                        <tr>
                                            <td class="pad" style="padding-left:50px;padding-right:50px;padding-top:30px;">
                                                <div style="color:#dce7fe;direction:ltr;font-family:'Ubuntu', Tahoma, Verdana, Segoe, sans-serif;font-size:19px;font-weight:500;letter-spacing:0px;line-height:1.3;text-align:center;mso-line-height-alt:25px;">
                                                    <p style="margin: 0;">Hello there, Welcome to BITS'25 organized by ACICTS of Ananda College, Colombo. Please verify all information below before continuing, If there are any issues please contact one of our site admins immediately. If everything is correct you are good to go.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
                </tbody>
            </table>
            <table class="row row-2" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-size: auto;">
                <tbody>
                <tr>
                    <td>
                        <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url(https://i.imgur.com/g9HweM6.png); background-repeat: no-repeat; background-size: cover; background-color: #050f19; color: #000000; border-radius: 0; width: 600px; margin: 0 auto;" width="600">
                            <tbody>
                            <tr>
                                <td class="column column-1" width="50%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top;">
                                    <table class="paragraph_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                        <tr>
                                            <td class="pad" style="padding-bottom:10px;padding-left:30px;padding-right:10px;padding-top:45px;">
                                                <div style="color:#7d8ab0;direction:ltr;font-family:'Ubuntu', Tahoma, Verdana, Segoe, sans-serif;font-size:15px;font-weight:500;letter-spacing:0px;line-height:1.2;text-align:left;mso-line-height-alt:18px;">
                                                    <p style="margin: 0;">Full Name</p>
                                                </div>
                                            </td>
                                        </tr>
                                    </table>
                                    <table class="paragraph_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                        <tr>
                                            <td class="pad" style="padding-bottom:10px;padding-left:50px;padding-right:10px;">
                                                <div style="color:#dce7fe;direction:ltr;font-family:'Ubuntu', Tahoma, Verdana, Segoe, sans-serif;font-size:18px;font-weight:500;letter-spacing:0px;line-height:1.2;text-align:left;mso-line-height-alt:22px;">
                                                    <p style="margin: 0;">${personInfo.fullname}</p>
                                                </div>
                                            </td>
                                        </tr>
                                    </table>
                                    <table class="paragraph_block block-3" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                        <tr>
                                            <td class="pad" style="padding-bottom:10px;padding-left:30px;padding-right:10px;padding-top:15px;">
                                                <div style="color:#7d8ab0;direction:ltr;font-family:'Ubuntu', Tahoma, Verdana, Segoe, sans-serif;font-size:15px;font-weight:500;letter-spacing:0px;line-height:1.2;text-align:left;mso-line-height-alt:18px;">
                                                    <p style="margin: 0;">Username</p>
                                                </div>
                                            </td>
                                        </tr>
                                    </table>
                                    <table class="paragraph_block block-4" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                        <tr>
                                            <td class="pad" style="padding-bottom:10px;padding-left:50px;padding-right:10px;">
                                                <div style="color:#dce7fe;direction:ltr;font-family:'Ubuntu', Tahoma, Verdana, Segoe, sans-serif;font-size:18px;font-weight:500;letter-spacing:0px;line-height:1.2;text-align:left;mso-line-height-alt:22px;">
                                                    <p style="margin: 0;">${personInfo.username}</p>
                                                </div>
                                            </td>
                                        </tr>
                                    </table>
                                    <table class="paragraph_block block-5" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                        <tr>
                                            <td class="pad" style="padding-bottom:10px;padding-left:30px;padding-right:10px;padding-top:15px;">
                                                <div style="color:#7d8ab0;direction:ltr;font-family:'Ubuntu', Tahoma, Verdana, Segoe, sans-serif;font-size:15px;font-weight:500;letter-spacing:0px;line-height:1.2;text-align:left;mso-line-height-alt:18px;">
                                                    <p style="margin: 0;">Email</p>
                                                </div>
                                            </td>
                                        </tr>
                                    </table>
                                    <table class="paragraph_block block-6" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                        <tr>
                                            <td class="pad" style="padding-bottom:10px;padding-left:50px;padding-right:10px;">
                                                <div style="color:#dce7fe;direction:ltr;font-family:'Ubuntu', Tahoma, Verdana, Segoe, sans-serif;font-size:18px;font-weight:500;letter-spacing:0px;line-height:1.2;text-align:left;mso-line-height-alt:22px;">
                                                    <p style="margin: 0;">${personInfo.email}</p>
                                                </div>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                                <td class="column column-2" width="50%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top;">
                                    <table class="image_block block-1 mobile_hide" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                        <tr>
                                            <td class="pad" style="padding-left:5px;padding-right:25px;width:100%;">
                                                <div class="alignment" align="center">
                                                    <div style="max-width: 270px;"><img src="https://bits.acicts.lk/img/comingsoonbot.png" style="display: block; height: auto; border: 0; width: 100%;" width="270" alt title height="auto"></div>
                                                </div>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
                </tbody>
            </table>
            <table class="row row-3" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                <tbody>
                <tr>
                    <td>
                        <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #050f19; color: #000000; border-radius: 0; width: 600px; margin: 0 auto;" width="600">
                            <tbody>
                            <tr>
                                <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top;">
                                    <table class="button_block block-1" width="100%" border="0" cellpadding="25" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                        <tr>
                                            <td class="pad">
                                                <div class="alignment" align="center"><a href="${process.env.SITE_URL}/profile" target="_blank" style="color:#dce7fe;text-decoration:none;"><!--[if mso]>
                                                        <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word"  href="${process.env.SITE_URL}/profile"  style="height:42px;width:139px;v-text-anchor:middle;" arcsize="24%" fillcolor="#293045">
                                                            <v:stroke dashstyle="Solid" weight="0px" color="#293045"/>
                                                            <w:anchorlock/>
                                                            <v:textbox inset="0px,0px,0px,0px">
                                                                <center dir="false" style="color:#dce7fe;font-family:sans-serif;font-size:16px">
                                                        <![endif]--><span class="button" style="background-color: #293045; border-bottom: 0px solid transparent; border-left: 0px solid transparent; border-radius: 10px; border-right: 0px solid transparent; border-top: 0px solid transparent; color: #dce7fe; display: inline-block; font-family: 'Ubuntu', Tahoma, Verdana, Segoe, sans-serif; font-size: 16px; font-weight: 700; mso-border-alt: none; padding-bottom: 5px; padding-top: 5px; padding-left: 20px; padding-right: 20px; text-align: center; width: auto; word-break: keep-all; letter-spacing: normal;"><span style="word-break: break-word; line-height: 32px;">Go To Profile</span></span><!--[if mso]></center></v:textbox></v:roundrect><![endif]--></a></div>
                                            </td>
                                        </tr>
                                    </table>
                                    <div class="spacer_block block-2" style="height:65px;line-height:65px;font-size:1px;">&#8202;</div>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
                </tbody>
            </table>
            <table class="row row-3" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                <tbody>
                <tr>
                    <td>
                        <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-radius: 0; color: #000000; width: 600px; margin: 0 auto;" width="600">
                            <tbody>
                            <tr>
                                <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top;">
                                    <table class="paragraph_block block-1" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                        <tr>
                                            <td class="pad">
                                                <div style="color:#bbbbbb;direction:ltr;font-family:'Ubuntu', Tahoma, Verdana, Segoe, sans-serif;font-size:14px;font-weight:400;letter-spacing:0px;line-height:1.2;text-align:center;mso-line-height-alt:17px;">
                                                    <p style="margin: 0;">2025 Bits Management. All rights reserved.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
                </tbody>
            </table>
        </td>
    </tr>
    </tbody>
</table><!-- End -->
</body>

</html>`
                                    }).then(console.log, console.error);
                                    res.status(201).send({ Success: "You are registered,You can login now." });
                                }
                                main().catch(console.error);
                            }
                        });
                } else {
                    res.status(200).send({ Success: "Email Already Used" });
                }
            }).sort({ id: -1 }).limit(1)
}
});

router.get("/login", General, (req, res, next) => {
    let username = [];
    if (req.session.userId) {
        username.push(req.session.username);
    }
    res.render("login.ejs", {
        username: username
    });
});

router.post("/login", (req, res, next) => {
    User.findOne({ email: req.body.email }, (err, data) => {
        if (data) {
            if (data.password === req.body.password) {
                req.session.userId = data.id;
                req.session.username = data.username;
                res.sendStatus(200)
            } else {
                res.status(401).json({ "message": "password incorrect" })
            }
        } else {
            res.status(401).json({ "message": "email unregistered" })
        }
    });
});

router.get("/profile", isAuthenticated, async (req, res, next) => {
    let username = [];
    if (req.session.userId) {
        username.push(req.session.username);
    }
    const userData = await User.findOne({ unique_id: req.session.userId });

    const approvedTasks = userData.competitionData.tasks
        .filter(function (data) {
            return data.status === 2;
        })
        .map(async function (data) {
            let task = await Task.findOne({id: data.taskId})
        return {
            task_title: task.title,
            task_description: task.description,
            task_id: task.id / 100,
            task_category: task.category,
        };
    });

    const declinedTasks = userData.competitionData.tasks
        .filter(function (data) {
            return data.status === 1;
        })
        .map(async function (data) {
            let task = await Task.findOne({id: data.taskId})
            return {
                task_title: task.title,
                task_description: task.description,
                task_id: task.id / 100,
                task_category: task.category,
            };
        });

    const pendingTasks = userData.competitionData.tasks
        .filter(function (data) {
            return data.status === 0;
        })
        .map(async function (data) {
            let task = await Task.findOne({id: data.taskId})
            return {
                task_title: task.title,
                task_description: task.description,
                task_id: task.id / 100,
                task_category: task.category,
            };
        });

    res.render("data", {
        approvedResults: approvedTasks,
        declinedResults: declinedTasks,
        pendingResults: pendingTasks,
        userData: userData,
        username: username
    });
});

router.get("/logout", (req, res, next) => {
    if (req.session) {
        // delete session object
        req.session.destroy((err) => {
            if (err) {
                return next(err);
            } else {
                return res.redirect("/");
            }
        });
    }else{
        res.redirect("/");
    }
});


//Competition
router.get("/tasks", isEnabled, isAuthenticated, async (req, res, next) => {
    let username = [];
    if (req.session.userId) {
        username.push(req.session.username);
    }
    const tasks = await Task.find();
    const userData = await User.findOne({ id: req.session.userId });

    const approvedTasks = userData.competitionData.tasks
        .filter(function (data) {
            return data.status === 2;
        })
        .map(function (data) {
            return data.taskId;
        });
    const declinedTasks = userData.competitionData.tasks
        .filter(function (data) {
            return data.status === 1;
        })
        .map(function (data) {
            return data.taskId;
        });
    const pendingTasks = userData.competitionData.tasks
        .filter(function (data) {
            return data.status === 0;
        })
        .map(function (data) {
            return data.taskId;
        });

    for (i = 0; i < tasks.length; i++) {
        tasks[i].task_id = tasks[i].id / 100
    }

    res.render("taskdata", {
        tasks: tasks,
        approvedArray: approvedTasks,
        declineArray: declinedTasks,
        pendingArray: pendingTasks,
        username: username
    });
});

router.get("/quiz", isEnabled, isAuthenticated, async (req, res, next) => {
    let username = [];
    if (req.session.userId) {
        username.push(req.session.username);
    }
    const quiz = await Quiz.find().sort({ quiz_id: -1 });
    const user = await User.findOne({ id: req.session.userId });

    let filteredQuizzes = quiz.filter(function (data) {
        if (isAdmin === true) {
            return data.category;
        } else {
            return data.category === user.category;
        }
    })

    let finalQuizzes = []
    filteredQuizzes.forEach((data) => {
        let currentDateTime = new Date();
        let quizStartDateTime = new Date(data.startDateTime);
        let quizEndDateTime = new Date(data.startDateTime).setMinutes(date.getMinutes() + data.duration);
        let quizSub = data.submissions.filter(function (submission) { return submission.id === req.session.userId });
        let quizStatus = 0; // 0 = not started, 1 = started, 2 = starting soon, 3 = completed, 4 = evaluated, 5 = ended


        if(data.venue === "Online") {
            if (currentDateTime > quizStartDateTime && currentDateTime < quizEndDateTime) {
                if (quizSub.answers.length > 0) {
                    quizStatus = 3;
                } else {
                    quizStatus = 1;
                }
            } else if (currentDateTime > quizEndDateTime) {
                if (quizSub.answers.length > 0 && data.evaluated) {
                    quizStatus = 4;
                } else {
                    quizStatus = 5;
                }
            } else {
                if (currentDateTime > quizStartDateTime.setMinutes(quizStartDateTime.getMinutes() - 15)) {
                    quizStatus = 2;
                } else {
                    quizStatus = 0;
                }
            }
        }else{
            if(currentDateTime < quizStartDateTime) {
                quizStatus = 0;
            }else if(currentDateTime > quizEndDateTime){
                if(data.evaluated){
                    quizStatus = 4;
                }else{
                    quizStatus = 5;
                }
            }
        }

        finalQuizzes.push({
            id: data.id,
            title: data.title,
            description: data.description,
            startDateTime: quizStartDateTime,
            duration: data.duration,
            venue: data.venue,
            category: data.category,
            status: quizStatus,
        })

    })

    res.render("onlinetests", {
        filteredQuiz: finalQuizzes,
        username: username
    });
});

router.get("/quiz/:id", isEnabled, isAuthenticated, async (req, res, next) => {

    let username = [];
    if (req.session.userId) {
        username.push(req.session.username);
    }
    const quiz = await Quiz.findOne({ id: req.params.id });
    const user = await User.findOne({ id: req.session.userId });
    let currentDateTime = new Date();
    let submission = quiz.submissions.filter(function (submission) { return submission.id === req.session.userId });

    if(currentDateTime > quiz.startDateTime && currentDateTime < quiz.startDateTime.setMinutes(quiz.startDateTime.getMinutes() + quiz.duration) && quiz.category === user.category && quiz.venue === "Online" && submission.answers.length < 1) {
        let startedTime;
        let durationLeft;
        if(submission){
            startedTime = submission.started_time;
            durationLeft = quiz.duration - (currentDateTime.getMinutes() - new Date(submission.started_time).getMinutes());
        }else{
            startedTime = currentDateTime;
            durationLeft = quiz.duration;
            Quiz.findOne({ id: req.params.id })
                .then((test) => {
                    test.user_submissions.push({
                        id: req.session.userId,
                        points: 0,
                        position: 0,
                        correct: 0,
                        penalties: 0,
                        started_time: startedTime,
                        answers: [],
                    });
                    test.save().then(() => { return "Success"; }).catch(console.log);
                }).catch(console.log);
        }

        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }
        
        let finalQuiz = {
            id: quiz.id,
            title: quiz.title,
            description: quiz.description,
            startTime: quiz.startDateTime,
            endTime: new Date(quiz.startDateTime).setMinutes(quiz.startDateTime.getMinutes() + quiz.duration),
            startedTime: startedTime,
            duration: quiz.duration,
            questions: shuffleArray(quiz.questions),
            durationLeft: durationLeft,
        }
        res.render("quiz", {
            quiz: finalQuiz,
            username: username
        });
    }else{
        res.redirect("/quiz")
    }
});

router.post("/quiz/submit/:id", isAuthenticated, async (req, res, next) => {
    const test_data = await Quiz.findOne({ id: req.params.id });
    const quizQuestionsArray = test_data.questions;

    const results = quizQuestionsArray.map(function (data){
        return {
            id: data._id,
            question: data.question,
            answers: data.answers,
            correct_answer: data.correct_answer,
            media_attachment: data.media_attachment,
        };
    });

    let user_ans = [];
    for (let i = 1; i <= quizQuestionsArray.length; i++) {
        let value = "q" + i;
        valueArray = (req.body[value]).split(" ; ");
        func1:
            for (let a = 1; a < results.length; a++) {
                if (results[a].id == valueArray[0]) {
                    user_ans[a] = valueArray[1];
                    break func1;
                }
            }
    }

    let user_record = test_data.submissions
        .filter(data => data.id === req.session.userId)
        .map(data => ({
            started_time: data.started_time,
            answers: data.answers,
            marks_scored: data.marks_scored
        }));

    if (JSON.stringify(user_record[0].answers) == JSON.stringify([])) {
        Tests.updateOne(
            { "id": req.params.id },
            {
                $set: {
                    'submissions.$[x].answers': user_ans,
                    'submissions.$[x].penalties': Math.round(parseInt(req.body.penalties))
                }
            },
            {
                arrayFilters: [
                    { "x.id": parseInt(req.session.userId) }
                ]
            }
        ).catch(error => {
            console.error("Error during update operation:", error);
        });
    }

    res.redirect("/quiz");
});



module.exports = router;