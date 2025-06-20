require("dotenv").config();
const express = require("express");
const router = express.Router();
const User = require("../models/user");
const userTasks = require("../models/userTasks");
const Tasks = require("../models/tasks");
const Admin = require("../models/admin");
const Tests = require("../models/tests");
const IMP = require("../models/confidential");
const Analytics = require("../models/analytics");
const nodemailer = require("nodemailer");
require("dotenv").config();

let isPowerAdmin = false;

// Checking if there is a session
const isAuthenticated = (req, res, next) => {
  if (!req.session.userId) {
    res.redirect("/login");
  } else {
    next();
  }
};

// Checking whether the current user is an admin
const isAdmin = (req, res, next) => {
  if (!req.session.adminToken) {
    return res.json({ code: 403, message: "Unauthorized" });
  }
  if (req.session.adminToken !== process.env.TOKEN) {
    res.json({ code: 400, message: "Invalid trust token" });
  } else {
      console.log(`admin logged in: ${req.session.userId}`)
    next();
  }
};

const isaPowerAdmin = async (req, res, next) => {
    const powerAdmins = [1, 2, 22, 21, 52];
    findPowerAdmins:
        for (let i = 0; i < powerAdmins.length; i++) {
            if (req.session.userId === powerAdmins[i]) {
                isPowerAdmin = true;
                console.log("Power Admin Logged : " + req.session.userId);
                break findPowerAdmins;
            } else {
                isPowerAdmin = false;
            }
        };
    const data = await IMP.findOne({ power_admin: 1 });
    if (!data) {
        let newData = new IMP({
            power_admin: 1,
            competition_enabled: true
        });

        newData.save((err, data) => {
            if (err) console.log(err)
            else {
                console.log("Successfully initialized Power Admin Sequence")
            }
        })
    }
    if (isPowerAdmin !== true) {
        return res.json({
            code: 403,
            message: "You are not authorized to access this page",
        });
    } else {
        next()
    }
}

let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD
    }
})

function SendEmail(email, subject, username, message, color) {
    let hex;
    if(color === "red"){
        hex = "#FC2828"
    }else if(color === "green"){
        hex = "#19c346"
    }else{
        hex = "#2788F7"
    }
transporter.sendMail({
    from: {
        address: process.env.SMTP_EMAIL,
        name: "Bits'25",
    },
    to: email,
    subject: `Hello ${username}`,
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
<table class="nl-container" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f0f0f0; background-position: top left; background-size: cover; background-repeat: no-repeat;">
    <tbody>
    <tr>
        <td>
            <table class="row row-1" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                <tbody>
                <tr>
                    <td>
                        <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 600px; margin: 0 auto;" width="600">
                            <tbody style="background-color: #050f19; background-image: url(https://i.imgur.com/g9HweM6.png); background-size: cover;">
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
                                    <table class="heading_block block-4" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                        <tr>
                                            <td class="pad">
                                                <h1 style="margin: 0; color: ${hex}; text-shadow: 0 0 60px ${hex}; direction: ltr; font-family: 'Ubuntu', Tahoma, Verdana, Segoe, sans-serif; font-size: 43px; font-weight: 700; letter-spacing: normal; line-height: 1.2; text-align: center; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 52px;"><span class="tinyMce-placeholder" style="word-break: break-word;">${subject}</span></h1>
                                            </td>
                                        </tr>
                                    </table>
                                    <table class="paragraph_block block-5" width="100%" border="0" cellpadding="30" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                        <tr>
                                            <td class="pad">
                                                <div style="color:#dce7fe;direction:ltr;font-family:'Ubuntu', Tahoma, Verdana, Segoe, sans-serif;font-size:19px;font-weight: bold;letter-spacing:0px;line-height:1.2;text-align:center;mso-line-height-alt:23px;">
                                                    <p style="margin: 0;">${message}</p>
                                                </div>
                                            </td>
                                        </tr>
                                    </table>
                                    <table class="button_block block-6" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                        <tr>
                                            <td class="pad">
                                                <div class="alignment" align="center"><a href="${process.env.SITE_URL}/profile" target="_blank" style="color:#ffffff;text-decoration:none;"><!--[if mso]>
                                                        <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word"  href="${process.env.SITE_URL}/profile"  style="height:42px;width:107px;v-text-anchor:middle;" arcsize="34%" fillcolor="#293045">
                                                            <v:stroke dashstyle="Solid" weight="0px" color="#293045"/>
                                                            <w:anchorlock/>
                                                            <v:textbox inset="0px,0px,0px,0px">
                                                                <center dir="false" style="color:#ffffff;font-family:sans-serif;font-size:16px">
                                                        <![endif]--><span class="button" style="background-color: #293045; border-bottom: 0px solid transparent; border-left: 0px solid transparent; border-radius: 14px; border-right: 0px solid transparent; border-top: 0px solid transparent; color: #ffffff; display: inline-block; font-family: 'Ubuntu', Tahoma, Verdana, Segoe, sans-serif; font-size: 16px; font-weight: 400; font-weight: bold; mso-border-alt: none; padding-bottom: 5px; padding-top: 5px; padding-left: 20px; padding-right: 20px; text-align: center; width: auto; word-break: keep-all; letter-spacing: normal;"><span style="word-break: break-word; line-height: 32px;">Go To Profile</span></span><!--[if mso]></center></v:textbox></v:roundrect><![endif]--></a></div>
                                            </td>
                                        </tr>
                                    </table>
                                    <div class="spacer_block block-7" style="height:65px;line-height:65px;font-size:1px;">&#8202;</div>
                                </td>
                            </tr>
                            </tbody>
                            <tbody style="background-color: transparent;">
                            <table class="paragraph_block block-8" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word; background-color: transparent; max-width: 600px; margin: auto;">
                                <tr>
                                    <td class="pad" style="padding-bottom:20px;padding-left:60px;padding-right:60px;padding-top:20px;">
                                        <div style="color:#bbbbbb;direction:ltr;font-family:'Ubuntu', Tahoma, Verdana, Segoe, sans-serif;font-size:13px;font-weight:400;letter-spacing:0px;line-height:1.2;text-align:center;mso-line-height-alt:19px;">
                                            <p style="margin: 0;">This email was sent to ${email}. If you're not the intended recipient immediately remove this email from your system and all of it's content.</p>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                            <table class="paragraph_block block-10" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word; background-color: transparent; max-width: 600px; margin: auto;">
                                <tr>
                                    <td class="pad" style="padding-bottom:20px;padding-left:60px;padding-right:60px;padding-top:20px;">
                                        <div style="color:#bbbbbb;direction:ltr;font-family:'Ubuntu', Tahoma, Verdana, Segoe, sans-serif;font-size:13px;font-weight:400;letter-spacing:0px;line-height:1.2;text-align:center;mso-line-height-alt:19px;">
                                            <p style="margin: 0;">2025 Bits Management. All rights reserved</p>
                                        </div>
                                    </td>
                                </tr>
                            </table>
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

</html>`,
}).then(console.log, console.error);
}

// Tasks

router.get("/", isAuthenticated, isAdmin, async (req, res, next) => {
    res.redirect("/admin/tasks/");
})

router.get("/tasks", isAuthenticated, isAdmin, async (req, res, next) => {
      const data = await Admin.findOne({ number: 1 });
      let task = await Tasks.find({})

    if(!data){
        res.render("review", {
            coding_tasks: [],
            design_tasks: [],
            explore_tasks: [],
            username: req.session.username
        });
    }else {
        const admintasks = data.taskData;

        let codingTasksArray = admintasks
            .filter(function (data) {
                return data.task_category === "CODING";
            })
            .map(function (data) {
                let task_details = task
                    .filter(function (data2) {
                        return data2.task_id === data.task_id;
                    })
                    .map(function (data2) {
                        return {
                            max_marks: data2.max_marks,
                            advanced: data2.advanceTask
                        };
                    })
                return {
                    task_title: data.task_title,
                    task_description: data.task_description,
                    task_id: data.task_id,
                    task_category: data.task_category,
                    username: data.username,
                    userid: data.userId,
                    project_url: data.project_url,
                    feedback: data.feedback,
                    max_marks: task_details[0].max_marks,
                    advanced: task_details[0].advanced,
                }
            });
        let designTasksArray = admintasks
            .filter(function (data) {
                return data.task_category === "DESIGN";
            })
            .map(function (data) {
                let task_details = task
                    .filter(function (data2) {
                        return data2.task_id === data.task_id;
                    })
                    .map(function (data2) {
                        return {
                            max_marks: data2.max_marks,
                            advanced: data2.advanceTask
                        };
                    })
                return {
                    task_title: data.task_title,
                    task_description: data.task_description,
                    task_id: data.task_id,
                    task_category: data.task_category,
                    username: data.username,
                    userid: data.userId,
                    project_url: data.project_url,
                    feedback: data.feedback,
                    max_marks: task_details[0].max_marks,
                    advanced: task_details[0].advanced,
                };
            });
        let exploreTasksArray = admintasks
            .filter(function (data) {
                return data.task_category === "EXPLORE";
            })
            .map(function (data) {
                let task_details = task
                    .filter(function (data2) {
                        return data2.task_id === data.task_id;
                    })
                    .map(function (data2) {
                        return {
                            max_marks: data2.max_marks,
                            advanced: data2.advanceTask
                        };
                    })
                return {
                    task_title: data.task_title,
                    task_description: data.task_description,
                    task_id: data.task_id,
                    task_category: data.task_category,
                    username: data.username,
                    userid: data.userId,
                    project_url: data.project_url,
                    feedback: data.feedback,
                    max_marks: task_details[0].max_marks,
                    advanced: task_details[0].advanced,
                };
            });


        res.render("review", {
            coding_tasks: codingTasksArray,
            design_tasks: designTasksArray,
            explore_tasks: exploreTasksArray,
            username: req.session.username
        });
    }
    });

router.post("/task/approve/:id/:user", isAuthenticated, isAdmin, async (req, res, next) => {
    const userData = await User.findOne({ unique_id: parseInt(req.params.user) });
    const task_dat = await Tasks.findOne({ task_id: parseInt(req.params.id) });
    if (!userData || !task_dat) {
      res.sendStatus(404);
    } else {
        const taskData = await userTasks.findOne({user_id: parseInt(req.params.user)});
        const Admindata = await Admin.findOne({number: 1});
        const datag = await Analytics.findOne({analytics_id: 1043});

        let admintask = Admindata.taskData
            .filter(function (sub) {
                return sub.task_id === parseInt(req.params.id) && sub.userId === parseInt(req.params.user);
            })
        if (admintask.length === 0) {
            res.render("error", {
                code: "403",
                msg: "The task was already reviewed by somebody else",
                icon: "",
                username: req.session.username
            });
        } else {

            if (!datag) {
                let newData = new Analytics({
                    total_views: 1,
                    total_signup: 1,
                    coding_tasks: 1,
                    design_tasks: 1,
                    explore_tasks: 1
                })

                newData.save((error, data) => {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log("Successfully added records for analytics");
                    }
                })
            }

            var currentdate = new Date();

            let id = parseInt(req.params.id) / 100;

            if (task_dat.task_category === "CODING") {
                if (id < 10) {
                    if (task_dat.advanceTask === true) {
                        id = `CA0${id}`
                    } else {
                        id = `C0${id}`
                    }
                } else {
                    if (task_dat.advanceTask === true) {
                        id = `CA${id}`
                    } else {
                        id = `C${id}`
                    }
                }
            } else if (task_dat.task_category === "DESIGN") {
                if (id < 10) {
                    if (task_dat.advanceTask === true) {
                        id = `DA0${id}`
                    } else {
                        id = `D0${id}`
                    }
                } else {
                    if (task_dat.advanceTask === true) {
                        id = `DA${id}`
                    } else {
                        id = `D${id}`
                    }
                }
            } else if (task_dat.task_category === "EXPLORE") {
                if (id < 10) {
                    if (task_dat.advanceTask === true) {
                        id = `EA0${id}`
                    } else {
                        id = `E0${id}`
                    }
                } else {
                    if (task_dat.advanceTask === true) {
                        id = `EA${id}`
                    } else {
                        id = `E${id}`
                    }
                }
            }

            var pendingTasksArray = taskData.pending_tasks;
            var adminTasksArray = Admindata.taskData;

            const choosedResults = pendingTasksArray
                .filter(function (data) {
                    return data.task_id == req.params.id;
                })
                .map(function (data) {
                    return {
                        id: data._id,
                        task_title: data.task_title,
                        task_description: data.task_description,
                        task_id: data.task_id,
                        task_category: data.task_category,
                    };
                });

            const adminChoosedResults = adminTasksArray
                .filter(function (data) {
                    return data.task_id == req.params.id && data.userId == req.params.user;
                })
                .map(function (data) {
                    return {
                        id: data._id,
                        task_title: data.task_title,
                        task_description: data.task_description,
                        task_id: data.task_id,
                        task_category: data.task_category,
                        project_url: data.project_url,
                    };
                });

            if (adminChoosedResults[0].task_category === "CODING") {
                await Analytics.updateOne({total_views: datag.total_views}, [
                    {
                        $set: {
                            coding_tasks: {
                                $add: ["$coding_tasks", 1],
                            }
                        }
                    }
                ]);
            } else if (adminChoosedResults[0].task_category === "DESIGN") {
                await Analytics.updateOne({total_views: datag.total_views}, [
                    {
                        $set: {
                            design_tasks: {
                                $add: ["$design_tasks", 1],
                            }
                        }
                    }
                ]);
            } else if (adminChoosedResults[0].task_category === "EXPLORE") {
                await Analytics.updateOne({total_views: datag.total_views}, [
                    {
                        $set: {
                            explore_tasks: {
                                $add: ["$explore_tasks", 1],
                            }
                        }
                    }
                ]);
            }

            Tasks.updateOne({
                task_id: req.params.id,
                'submissions.user_id': parseInt(req.params.user)
            }, {
                $set: {
                    "submissions.$.status": "Approved",
                    "submissions.$.marks": parseInt(req.body.points),
                    "submissions.$.reviewer_id": req.session.userId
                }
            }).catch(console.log);

            userTasks
                .findOne({user_id: parseInt(req.params.user)})
                .then((task) => {
                    task.approved_tasks.push({
                        task_title: task_dat.task_title,
                        task_description: task_dat.task_description,
                        task_id: task_dat.task_id,
                        task_category: task_dat.task_category,
                        reviewer_id: req.session.userId
                    });
                    task
                        .save()
                        .then(() => {
                            return "Success";
                        })
                        .catch(console.log);
                })
                .catch(console.log);

            await userTasks.updateOne({user_id: parseInt(req.params.user)}, [ //Adding points to the user profile
                {
                    $set: {
                        total_points: {
                            $add: ["$total_points", parseInt(req.body.points)],
                        },
                    },
                },
            ]);

            await userTasks.update(
                {_id: taskData._id},
                {$pull: {pending_tasks: {_id: choosedResults[0].id}}}
            );
            await Admin.update(
                {_id: Admindata._id},
                {$pull: {taskData: {_id: adminChoosedResults[0].id}}}
            );
            let fullmarks;
            if (req.body.points > 10) {
                fullmarks = 100
            } else {
                fullmarks = 10
            }

            async function main() {

                SendEmail(userData.email, 'Task Approved', userData.username, `Congradulations. Your Task ID: ${id} has been accepted and will count towards in the competition. You got ${req.body.points}/${fullmarks} for this task.`, 'green')

            }

            main().catch(console.error);
            res.redirect("/admin/tasks/");
        }
    }
  });

router.post("/task/decline/:id/:user", isAuthenticated, isAdmin, async (req, res, next) => {
    const userData = await User.findOne({ unique_id: parseInt(req.params.user) });
    const task_dat = await Tasks.findOne({ task_id: parseInt(req.params.id) });
    if (!userData || !task_dat) {
      res.sendStatus(404);
    } else {
      const taskData = await userTasks.findOne({ user_id: parseInt(req.params.user) });
      const Admindata = await Admin.findOne({ number: 1 });

      var currentdate = new Date();
        let admintask = Admindata.taskData
            .filter(function (sub) {
                return sub.task_id === parseInt(req.params.id) && sub.userId === parseInt(req.params.user);
            })
        if (admintask.length === 0) {
            res.render("error", {
                code: "403",
                msg: "The task was already reviewed by somebody else",
                icon: "",
                username: req.session.username
            });
        } else {

            let id = parseInt(req.params.id) / 100;

            if (task_dat.task_category === "CODING") {
                if (id < 10) {
                    id = `C0${id}`
                } else {
                    id = `C${id}`
                }
            } else if (task_dat.task_category === "DESIGN") {
                if (id < 10) {
                    id = `D0${id}`
                } else {
                    id = `D${id}`
                }
            } else if (task_dat.task_category === "EXPLORE") {
                if (id < 10) {
                    id = `E0${id}`
                } else {
                    id = `E${id}`
                }
            }

            var pendingTasksArray = taskData.pending_tasks;
            var adminTasksArray = Admindata.taskData;

            const choosedResults = pendingTasksArray
                .filter(function (data) {
                    return data.task_id == req.params.id;
                })
                .map(function (data) {
                    return {
                        id: data._id,
                        task_title: data.task_title,
                        task_description: data.task_description,
                        task_id: data.task_id,
                        task_category: data.task_category,
                    };
                });

            const adminChoosedResults = adminTasksArray
                .filter(function (data) {
                    return data.task_id == req.params.id && data.userId == req.params.user;
                })
                .map(function (data) {
                    return {
                        id: data._id,
                        task_title: data.task_title,
                        task_description: data.task_description,
                        task_id: data.task_id,
                        task_category: data.task_category,
                        project_url: data.project_url,
                    };
                });

            Tasks.updateOne({
                task_id: req.params.id,
                'submissions.user_id': parseInt(req.params.user)
            }, {
                $set: {
                    "submissions.$.status": "Declined",
                    "submissions.$.reviewer_id": req.session.userId
                }
            }).catch(console.log);

            userTasks
                .findOne({user_id: parseInt(req.params.user)})
                .then((task) => {
                    task.declined_tasks.push({
                        task_title: task_dat.task_title,
                        task_description: task_dat.task_description,
                        task_id: task_dat.task_id,
                        task_category: task_dat.task_category,
                        denial_reason: req.body.denialreason,
                        reviewer_id: req.session.userId
                    });
                    task
                        .save()
                        .then(() => {
                            return "Success";
                        })
                        .catch(console.log);
                })
                .catch(console.log);

            await userTasks.update(
                {_id: taskData._id},
                {$pull: {pending_tasks: {_id: choosedResults[0].id}}}
            );
            await Admin.update(
                {_id: Admindata._id},
                {$pull: {taskData: {_id: adminChoosedResults[0].id}}}
            );

            async function main() {

                SendEmail(userData.email, 'Task Rejected', userData.username, `Sorry, your task ID: ${id} got rejected for the following reason. Please fix the issue and Re-Submit from your profile or task page.`, 'red')

            }

            main().catch(console.error);

            res.redirect("/admin/tasks/");
        }
    }
  });
// End of Tasks

// System management
router.get("/dashboard", isaPowerAdmin, isAuthenticated, isAdmin, async (req, res, next) => {
    const data = await IMP.findOne({ power_admin: 1 });
    const test_data = await Tests.find({ evaluated: false });
  let quizzes = test_data
      .filter(function (data) {
      return new Date() > new Date(data.test_endDateTime) && data.test_venue === "Online";
    })
      .map(function (data) {
        return {
          test_id: data.test_id,
          test_name: data.test_name,
          test_description: data.test_description,
          test_link: data.test_link,
          test_dateTime: data.test_dateTime,
          test_endDateTime: data.test_endDateTime,
          test_type: data.test_type,
          test_venue: data.test_venue,
        }
      })
    res.render("dashboard", {
      username: req.session.username,
      data: data,
      quizzes: quizzes
    });
});

router.get("/submissions", isaPowerAdmin, isAuthenticated, isAdmin, async (req, res, next) => {
        const data = await IMP.findOne({ power_admin: 1 });
            let tasks = await Tasks.find()
            let quizzes = await Tests.find()

            let coding_tasks_nums = tasks
                .filter((data) => {
                    return data.task_category === "CODING"
                })
                .map((data) => {
                    return {
                        task_id: data.task_id
                    }
                })

            let design_tasks_nums = tasks
                .filter((data) => {
                    return data.task_category === "DESIGN"
                })
                .map((data) => {
                    return {
                        task_id: data.task_id
                    }
                })

            let explore_tasks_nums = tasks
                .filter((data) => {
                    return data.task_category === "EXPLORE"
                })
                .map((data) => {
                    return {
                        task_id: data.task_id
                    }
                })

            res.render("submissions", {
                tasks: tasks,
                quizzes: quizzes,
                coding_nums: coding_tasks_nums,
                design_nums: design_tasks_nums,
                explore_nums: explore_tasks_nums,
                username: req.session.username
            });
    });

router.get("/users", isaPowerAdmin, isAuthenticated, isAdmin, async (req, res, next) => {
    const data = await IMP.findOne({ power_admin: 1 });
    let users = await User.find()

    let updated_users = users
        .filter((usr) => {
            return  usr.adminUser === false
        })
        .map((usr) => {
            let grade = usr.grade.replace("Grade ", "")
            return {
                id: usr.unique_id,
                grade: grade,
                name: usr.fullname,
                username: usr.username,
                email: usr.email,
                date: usr.createdAt,
                admission: usr.admissionNo
            }
        })

    res.render("users", {
        users: updated_users,
        username: req.session.username
    });
});

router.post("/competition/enable", isAuthenticated, isAdmin, async (req, res, next) => {
    if (isPowerAdmin !== true) {
      return res.json({
        code: 403,
        message: "You are not authorized to access this page",
      });
    } else {
      await IMP.updateOne(
        {
          power_admin: 1,
        },
        {
          competition_enabled: true,
        }
      );
    }

    res.redirect("/admin/dashboard");
  });

router.post("/competition/disable", isAuthenticated, isAdmin, async (req, res, next) => {
    if (isPowerAdmin !== true) {
      return res.json({
        code: 403,
        message: "You are not authorized to access this page",
      });
    } else {
      await IMP.updateOne(
        {
          power_admin: 1,
        },
        {
          competition_enabled: false,
        }
      );
    }

    res.redirect("/admin/dashboard");
  });

router.post("/email/send/bits", isAuthenticated, isAdmin, async (req, res, next) => {
    const user_data = await User.find({ bitsUser: true });
    const emails = user_data.map(function (data) {
      return data.email;
    });

    async function main() {
    user_data.forEach((user) => {
        SendEmail(user.email, req.body.subject, user.username, req.body.message, 'normal')
    })
    }
    main().catch(console.error);


    res.redirect("/admin/dashboard");
  });

router.get('/analytics', isAdmin, async (req, res, next) => {
  const data = await Analytics.findOne({ analytics_id: 1043 });
  const userdata = await User.find({ adminUser: false });
  const points = await userTasks.find()
  if (!data) {
    let newData = new Analytics({
      total_views: 1,
      total_signup: 1,
      coding_tasks: 1,
      design_tasks: 1,
      explore_tasks: 1
    })

    newData.save((error, data) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Successfully added records for analytics");
      }
    })
  }
  await Analytics.updateOne({ total_views: data.total_views }, [
    {
      $set: {
        total_views: {
          $add: ["$total_views", 1],
        }
      }
    }
  ]);

  const ageArray = userdata.map(function (data) {
    return data.age;
  });

  let pointsArray = points.map(function (data) {
    return data.total_points
  });

  let timeSpendArray = data.time_spend.map(function (data) {
    return data.time
  });

  let pageClicksArray = data.total_page_clicks.map(function (data) {
    return data.clicks
  });

  let buttonClicksArray = data.total_button_clicks.map(function (data) {
    return data.clicks
  });

  let linkPressArray = data.total_link_press.map(function (data) {
    return data.clicks
  });

  const strigifiedData = JSON.stringify(ageArray);
  const stringifiedPoints = JSON.stringify(pointsArray);
  const stringifiedTime = JSON.stringify(timeSpendArray);
  const stringifiedPageClicks = JSON.stringify(pageClicksArray);
  const stringifiedButtonClicks = JSON.stringify(buttonClicksArray);
  const stringifiedLinkPress = JSON.stringify(linkPressArray)

  let date = new Date()

  res.render("analytics", {
    strigifiedData: strigifiedData,
    data: data,
    userdata: userdata,
    date: date.toString().replace("GMT+0000 (Coordinated Universal Time)",""),
    stringifiedPoints: stringifiedPoints,
    stringifiedTime: stringifiedTime,
    stringifiedPageClicks: stringifiedPageClicks,
    stringifiedButtonClicks: stringifiedButtonClicks,
    stringifiedLinkPress: stringifiedLinkPress
  })
})
// End of System management

// Quiz management
router.post("/test/add", isAuthenticated, isAdmin, async (req, res, next) => {
  let c;
  Tests.findOne({}, async (err, data) => {
    if (data) {
      const testdata = await Tests.find().limit(1).sort({ $natural: -1 }); //Checking for the unique ids
      c = testdata[0].test_id + 100;
    } else {
      c = 100;
    }
    let endtime = new Date(req.body.dateTime).setUTCHours(new Date(req.body.dateTime).getUTCHours() + 1)
    let link;
    if(req.body.link === "web"){
      link = `/quiz/${c}`
    }else {
      link = req.body.link
    }

    let newTest = new Tests({
      test_id: c,
      test_name: req.body.name,
      test_description: req.body.description,
      test_dateTime: (req.body.dateTime + ":00.000+05:30"),
      test_endDateTime: (new Date(endtime).toISOString().replace('Z', '') + "+05:30"),
      test_link: link,
      test_type: req.body.type,
      test_venue: req.body.venue,
      evaluated: false
    });

    newTest.save((err, Data) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Successfully added records for Tests");
      }
    });

    res.redirect(`/admin/power/quiz/${c}`);
  });
});

router.get("/power/quiz/:id", isaPowerAdmin, isAuthenticated, isAdmin, async (req, res, next) => {

  const data = await IMP.findOne({ power_admin: 1 });
    if(!req.params.id) {
      res.render("quizquestions");
    }else {
      res.render("quizquestions", {id: req.params.id});
    }
});

router.post("/power/quiz/sumbit", isAuthenticated, isAdmin, async (req, res, next) => {
  let quiz = req.body["quiz_id"];
  for (let i = 1; i <= 20; i++) {
    let question = req.body["q" + i];
    let correct_answer = req.body["q" + i + "_radio"];
    let user_ans = [req.body["q" + i + "_text_1"], req.body["q" + i + "_text_2"], req.body["q" + i + "_text_3"], req.body["q" + i + "_text_4"]];
    Tests.updateOne(
      { "test_id": quiz },
      {
        $push: {
          questions: {
            question: question,
            answers: user_ans,
            correct_answer: correct_answer,
            media_attachment: ""
          }
        }
      }
    ).catch(error => {
      console.error("Error during update operation:", error);
    });
  }
  res.redirect("/admin/dashboard");
});

router.get("/power/quiz/evaluate/:id", isaPowerAdmin, isAuthenticated, isAdmin, async (req, res, next) => {

    const test_data = await Tests.findOne({ test_id: req.params.id });
    const userTasks_data = await userTasks.findOne({ test_id: req.params.id });

    await Tests.updateOne({ test_id: req.params.id }, { evaluated: true})

    var quizQuestionsArray = test_data.questions;
    const correct_answers = quizQuestionsArray.map(function (data) {
      return {
        correct_answer: data.correct_answer,
      };
    });

    var userSubmission_array = test_data.user_submissions;
    let user_record = userSubmission_array.map(data => ({
      unique_id: data.unique_id,
      user_answers: data.user_answers,
      marks_scored: data.marks_scored
    }));

    let proccessed_submissions = [];

    for (let usersNum = 0; usersNum < user_record.length; usersNum++) {
      let personInfo = await User.findOne({ unique_id: parseInt(user_record[usersNum].unique_id) });
      let old_marks;
      if(user_record[usersNum].marks_scored != ""){
        old_marks = parseInt(user_record[usersNum].marks_scored);
      } else {
        old_marks = 0;
      }

      let marks = 0;

      for (let quesID = 0; quesID < correct_answers.length; quesID++) {
        if (correct_answers[quesID].correct_answer == user_record[usersNum].user_answers[quesID]) {
          marks += 1;
        }
      }

      if(user_record[usersNum].penalties > 0){
          marks = marks - user_record[usersNum].penalties
      }

      // Tests.updateOne(
      //   { "test_id": req.params.id },
      //   {
      //     $set: {
      //       'user_submissions.$[x].marks_scored': marks
      //     }
      //   },
      //   {
      //     arrayFilters: [
      //       { "x.unique_id": parseInt(user_record[usersNum].unique_id) }
      //     ]
      //   }
      // ).catch(error => {
      //   console.error("Error during update operation:", error);
      // });

      proccessed_submissions.push({
          email: personInfo.email,
          username: personInfo.username,
          marks: marks,
          user_id: parseInt(user_record[usersNum].unique_id),
          old_marks: old_marks
      })

    }
    proccessed_submissions.sort(function(a, b) {
        return b.marks - a.marks;
    });

    //add marks and send emails
    for (let si = 0; si < proccessed_submissions.length; si++) {
              if(si === 0) {
                  userTasks.updateOne({user_id: proccessed_submissions[si].user_id}, [
                      {
                          $set: {
                              total_points: {
                                  $add: ["$total_points", ((proccessed_submissions[si].marks - proccessed_submissions[si].old_marks) * 5)],
                              },
                          },
                      },
                  ]).catch(error => {
                      console.error("Error during update operation:", error);
                  });
                  Tests.updateOne(
                      { "test_id": req.params.id },
                      {
                          $set: {
                              'user_submissions.$[x].marks_scored': (proccessed_submissions[si].marks * 5),
                              'user_submissions.$[x].position': 1
                          }
                      },
                      {
                          arrayFilters: [
                              { "x.unique_id": proccessed_submissions[si].user_id }
                          ]
                      }
                  ).catch(error => {
                      console.error("Error during update operation:", error);
                  });
                  SendEmail(proccessed_submissions[si].email, 'Quiz Evaluated', proccessed_submissions[si].username, `Congradulations. The Quiz you submited (${test_data.test_name}) has been evaluated and will count towards the competition. You got ${proccessed_submissions[si].marks}/20 for this quiz. And you placed 1st in the quiz. As a reward you get an extra ${Math.round((proccessed_submissions[si].marks*4))} Marks`, 'green')
              } else if(si === 1) {
                  userTasks.updateOne({user_id: proccessed_submissions[si].user_id}, [
                      {
                          $set: {
                              total_points: {
                                  $add: ["$total_points", ((proccessed_submissions[si].marks - proccessed_submissions[si].old_marks) * 2.5)],
                              },
                          },
                      },
                  ]).catch(error => {
                      console.error("Error during update operation:", error);
                  });
                  Tests.updateOne(
                      { "test_id": req.params.id },
                      {
                          $set: {
                              'user_submissions.$[x].marks_scored': (proccessed_submissions[si].marks * 2.5),
                              'user_submissions.$[x].position': 2
                          }
                      },
                      {
                          arrayFilters: [
                              { "x.unique_id": proccessed_submissions[si].user_id }
                          ]
                      }
                  ).catch(error => {
                      console.error("Error during update operation:", error);
                  });
                  SendEmail(proccessed_submissions[si].email, 'Quiz Evaluated', proccessed_submissions[si].username, `Congradulations. The Quiz you submited (${test_data.test_name}) has been evaluated and will count towards the competition. You got ${proccessed_submissions[si].marks}/20 for this quiz. And you placed 2nd in the quiz. As a reward you get an extra ${Math.round((proccessed_submissions[si].marks*1.5))} Marks`, 'green')
              } else if(si === 2) {
                  userTasks.updateOne({user_id: proccessed_submissions[si].user_id}, [
                      {
                          $set: {
                              total_points: {
                                  $add: ["$total_points", (Math.round((proccessed_submissions[si].marks - proccessed_submissions[si].old_marks) * 1.75))],
                              },
                          },
                      },
                  ]).catch(error => {
                      console.error("Error during update operation:", error);
                  });
                  Tests.updateOne(
                      { "test_id": req.params.id },
                      {
                          $set: {
                              'user_submissions.$[x].marks_scored': (proccessed_submissions[si].marks * 1.75),
                              'user_submissions.$[x].position': 3
                          }
                      },
                      {
                          arrayFilters: [
                              { "x.unique_id": proccessed_submissions[si].user_id }
                          ]
                      }
                  ).catch(error => {
                      console.error("Error during update operation:", error);
                  });
                  SendEmail(proccessed_submissions[si].email, 'Quiz Evaluated', proccessed_submissions[si].username, `Congradulations. The Quiz you submited (${test_data.test_name}) has been evaluated and will count towards the competition. You got ${proccessed_submissions[si].marks}/20 for this quiz. And you placed 3rd in the quiz. As a reward you get an extra ${Math.round((proccessed_submissions[si].marks*0.75))} Marks`, 'green')
              } else{
                  userTasks.updateOne({ user_id: proccessed_submissions[si].user_id }, [
                      {
                          $set: {
                              total_points: {
                                  $add: ["$total_points", (proccessed_submissions[si].marks - proccessed_submissions[si].old_marks)],
                              },
                          },
                      },
                  ]).catch(error => {
                      console.error("Error during update operation:", error);
                  });
                  Tests.updateOne(
                      { "test_id": req.params.id },
                      {
                          $set: {
                              'user_submissions.$[x].marks_scored': proccessed_submissions[si].marks,
                              'user_submissions.$[x].position': si+1
                          }
                      },
                      {
                          arrayFilters: [
                              { "x.unique_id": proccessed_submissions[si].user_id }
                          ]
                      }
                  ).catch(error => {
                      console.error("Error during update operation:", error);
                  });
                  SendEmail(proccessed_submissions[si].email, 'Quiz Evaluated', proccessed_submissions[si].username, `Congradulations. The Quiz you submited (${test_data.test_name}) has been evaluated and will count towards the competition. You got ${proccessed_submissions[si].marks}/20 for this quiz.`, 'green')
              }
      }

    res.redirect("/admin/dashboard");
});
// End of Quiz management

module.exports = router;