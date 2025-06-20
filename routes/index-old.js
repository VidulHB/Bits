require("dotenv").config();
const express = require("express");
const router = express.Router();
const User = require("../models/user");
const userTasks = require("../models/userTasks");
const Tasks = require("../models/tasks");
const Tests = require("../models/tests");
const Admin = require("../models/admin");
const IMP = require("../models/confidential");
const Password = require("../models/passwordReset")
const Analytics = require("../models/analytics");
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require('uuid');

const isAuthenticated = (req, res, next) => {
  if (!req.session.userId) {
    res.redirect("/login");
  } else {
    next();
  }
};

const isEnabled = async (req, res, next) => {
  try {
    const data = await IMP.findOne({ power_admin: 1 });
    if (!data) {
      let newData = new IMP({
        power_admin: 1,
        competition_enabled: true
      })

      newData.save((error, data) => {
        if (error) {
          console.log(error);
        } else {
          console.log("Successfully added records for power admin");
        }
      })
    }
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
    hex = "#0913FF"
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
                            <tbody style="background-color: #050f19; background-image: url('https://bits.acicts.lk/img/bg_overlay.svg'); background-size: cover;">
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
                                                <h1 style="margin: 0; color: ${hex}; direction: ltr; font-family: 'Ubuntu', Tahoma, Verdana, Segoe, sans-serif; font-size: 43px; font-weight: 700; letter-spacing: normal; line-height: 1.2; text-align: center; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 52px;"><span class="tinyMce-placeholder" style="word-break: break-word;">${subject}</span></h1>
                                            </td>
                                        </tr>
                                    </table>
                                    <table class="paragraph_block block-5" width="100%" border="0" cellpadding="30" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                        <tr>
                                            <td class="pad">
                                                <div style="color:#dce7fe;direction:ltr;font-family:'Ubuntu', Tahoma, Verdana, Segoe, sans-serif;font-size:19px;font-weight:bold;letter-spacing:0px;line-height:1.2;text-align:center;mso-line-height-alt:23px;">
                                                    <p style="margin: 0;">${message}</p>
                                                </div>
                                            </td>
                                        </tr>
                                    </table>
                                    <table class="button_block block-6" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                        <tr>
                                            <td class="pad">
                                                <div class="alignment" align="center"><a href="https://bits.acicts.lk/profile" target="_blank" style="color:#ffffff;text-decoration:none;"><!--[if mso]>
                                                        <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word"  href="https://bits.acicts.lk/profile"  style="height:42px;width:107px;v-text-anchor:middle;" arcsize="34%" fillcolor="#293045">
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

// General
router.get("/", async (req, res, next) => {
  const data = await Analytics.findOne({ analytics_id: 1043 });
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
  let username = [];
  if (req.session.userId) {
    username.push(req.session.username);
  }
  res.render("index.ejs", {
    username: username,
    reg_enabled: true
  });
});

router.get("/help", (req, res, next) => {
  let username = [];
  if (req.session.userId) {
    username.push(req.session.username);
  }
  res.render("help", {
    username: username
  });
})

router.get("/thanks", (req, res, next) => {
  let username = [];
  if (req.session.userId) {
    username.push(req.session.username);
  }
  res.render("thanks", {
    username: username
  });
})

router.get("/leaderboard", isEnabled, async (req, res, next) => {
  let username = [];
  if (req.session.userId) {
    username.push(req.session.username);
  }
  const Database = await userTasks.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "user_id",
        foreignField: "unique_id",
        as: "same",
      },
    },
    {
      $match: { same: { $ne: [] } },
    },
    {
      $sort: { total_points: -1 },
    },
  ]);

  const filteredArray = Database
      .filter(function (data) {
        return data.same[0].bitsUser === true && data.same[0].adminUser === false && data.total_points !== 0;
      })
  res.render("leaderboard", {
    db: filteredArray,
    i: 1,
    username: username
  });
});

router.post("/update", (req, res, next) => {
  const time_in_sec = req.body.timeSpend / 1000;

  Analytics
    .findOne({ analytics_id: 1043 })
    .then((data) => {
      data.time_spend.push({
        time: time_in_sec
      }),
        data.total_page_clicks.push({
          clicks: req.body.totalClicks
        }),
        data.total_button_clicks.push({
          clicks: req.body.totalButtonClicks.total
        }),
        data.total_link_press.push({
          clicks: req.body.totalLinkClickCount
        }),
        data.total_mouse_movement.push({
          movement: req.body.totalMouseMovementCount
        });
      data
        .save()
        .then(() => {
          return "Success";
        })
        .catch(console.log);
    })
    .catch(console.log);
})
// end of General

//Account management
router.get("/signup", (req, res, next) => {
  let username = [];
  if (req.session.userId) {
    username.push(req.session.username);
  }
  let site_key = process.env.RECAPTCHA_SITE_KEY
  return res.render("signup.ejs", {
    site_key: site_key,
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
    if (personInfo.password == personInfo.passwordConf) {
      User.findOne({ email: personInfo.email }, async (err, data) => {
        if (!data) {
          let c;
          User.findOne({}, (err, data) => {
            if (data) {
              c = data.unique_id + 1;
            } else {
              c = 1;
            }

            let bits_id = com_id();
            let bitshype = false;
            let hype = false;

            if (req.body.competition === "bitshype") {
              bitshype = true;
            } else {
              hype = true;
            }

            let newPerson = new User({
              unique_id: c,
              email: personInfo.email,
              username: personInfo.username,
              school: personInfo.school,
              fullname: personInfo.fullname,
              age: personInfo.age,
              competitor_id: "BITS25-" + bits_id,
              grade: personInfo.grade,
              password: personInfo.password,
              passwordConf: personInfo.passwordConf,
              adminUser: false,
              bitsUser: bitshype,
              hypertextUser: hype,
              admissionNo: req.body.admission,
            });

            let newUserTasks = new userTasks({
              user_id: c,
              total_points: 0,
              pending_tasks: [],
              approved_tasks: [],
              declined_tasks: [],
            });

            newUserTasks.save((err, Data) => {
              if (err) {
                console.log(err);
              } else {
                console.log("Successfully added records for user tasks");
              }
            });

            newPerson.save((err, Person) => {
              if (err) console.log(err);
              else if (bitshype === true) {
                async function main() {
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
                }
                main().catch(console.error);
              }
            });
          })
            .sort({ _id: -1 })
            .limit(1);
          res.status(201).send({ Success: "You are registered,You can login now." });
        } else {
          res.status(200).send({ Success: "Email Already Used" });
        }
      });
    } else {
      res.status(200).send({ Success: "Passwords Not Matched" });
    }
  }
});

router.get("/login", (req, res, next) => {
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
      if (data.password == req.body.password) {
        if (data.adminUser) {
          req.session.adminToken = process.env.TOKEN;
        }
        req.session.bitsUser = data.bitsUser;
        req.session.hypertextUser = data.hypertextUser;
        req.session.userId = data.unique_id;
        req.session.username = data.username;
        // res.send({ Success: "Success!" });
        res.sendStatus(200)
      } else {
        res.status(401).json({ "message": "password incorrect" })
        // res.send({ Success: "Wrong email or password!" });
      }
    } else {
      res.status(401).json({ "message": "email unregistered" })
      // res.send({ Success: "This Email Is not regestered!" });
    }
  });
});

router.get("/profile", isAuthenticated, async (req, res, next) => {
      const data = await Analytics.findOne({ analytics_id: 1043 });
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
      let username = [];
      if (req.session.userId) {
        username.push(req.session.username);
      }
      const taskData = await userTasks.findOne({ user_id: req.session.userId });
      const userData = await User.findOne({ unique_id: req.session.userId });
      var approvedTasksArray = taskData.approved_tasks;
      var declinedTasksArray = taskData.declined_tasks;
      var pendingTasksArray = taskData.pending_tasks;

      const approvedResults = approvedTasksArray.map(function (data) {
        return {
          task_title: data.task_title,
          task_description: data.task_description,
          task_id: data.task_id / 100,
          task_category: data.task_category,
        };
      });

      const declinedResults = declinedTasksArray.map(function (data) {
        return {
          task_title: data.task_title,
          task_description: data.task_description,
          task_id: data.task_id / 100,
          task_category: data.task_category,
          denial_reason: data.denial_reason,
        };
      });

      const pendingResults = pendingTasksArray.map(function (data) {
        return {
          task_title: data.task_title,
          task_description: data.task_description,
          task_id: data.task_id / 100,
          task_category: data.task_category,
        };
      });

      res.render("data", {
        approvedResults: approvedResults,
        declinedResults: declinedResults,
        pendingResults: pendingResults,
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
  }
});

router.get("/forgetpass", (req, res, next) => {
  let username = [];
  if (req.session.userId) {
    username.push(req.session.username);
  }
  res.render("forget.ejs", {
    username: username
  });
});

router.post("/forgetpass", (req, res, next) => {
  User.findOne({ email: req.body.email }, (err, data) => {
    if (!data) {
      res.status(200).send({ "msg": "EmailUnregistered" });
    } else {
      let reset = uuidv4();

      let pass = new Password({
        user_id: data.unique_id,
        reset_link: reset,
        expired: false
      })

      pass.save((err, Person) => {
        if (err) console.log(err);
        else console.log("Success");
        res.status(201).send();
      });

      async function main() {
        // let transporter = nodemailer.createTransport({
        //   host: process.env.SMTP_SERVER,
        //   port: parseInt(process.env.SMTP_PORT),
        //   secure: true,
        //   auth: {
        //     user: process.env.USERNAME,
        //     pass: process.env.PASSWORD,
        //   },
        // });

        transporter.sendMail({
          from: {
            address: process.env.SMTP_EMAIL,
            name: "Bits'25",
          },
          to: data.email,
          subject: "Password Reset Request",
          html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns=http://www.w3.org/1999/xhtml xmlns:v=urn:schemas-microsoft-com:vml xmlns:o=urn:schemas-microsoft-com:office:office lang="en">
<head>
<meta name=x-apple-disable-message-reformatting>
<meta http-equiv=X-UA-Compatible>
<meta charset=utf-8>
<meta name=viewport content=target-densitydpi=device-dpi>
<meta content=true name=HandheldFriendly>
<meta content=width=device-width name=viewport>
<style type="text/css">
table {
border-collapse: separate;
table-layout: fixed;
mso-table-lspace: 0pt;
mso-table-rspace: 0pt
}
table td {
border-collapse: collapse
}
.ExternalClass {
width: 100%
}
.ExternalClass,
.ExternalClass p,
.ExternalClass span,
.ExternalClass font,
.ExternalClass td,
.ExternalClass div {
line-height: 100%
}
* {
line-height: inherit;
text-size-adjust: 100%;
-ms-text-size-adjust: 100%;
-moz-text-size-adjust: 100%;
-o-text-size-adjust: 100%;
-webkit-text-size-adjust: 100%;
-webkit-font-smoothing: antialiased;
-moz-osx-font-smoothing: grayscale
}
html {
-webkit-text-size-adjust: none !important
}
img+div {
display: none;
display: none !important
}
img {
Margin: 0;
padding: 0;
-ms-interpolation-mode: bicubic
}
h1, h2, h3, p, a {
font-family: inherit;
font-weight: inherit;
font-size: inherit;
line-height: 1;
color: inherit;
background: none;
overflow-wrap: normal;
white-space: normal;
word-break: break-word
}
a {
color: inherit;
text-decoration: none
}
h1, h2, h3, p {
min-width: 100%!important;
width: 100%!important;
max-width: 100%!important;
display: inline-block!important;
border: 0;
padding: 0;
margin: 0
}
a[x-apple-data-detectors] {
color: inherit !important;
text-decoration: none !important;
font-size: inherit !important;
font-family: inherit !important;
font-weight: inherit !important;
line-height: inherit !important
}
a[href^="mailto"],
a[href^="tel"],
a[href^="sms"] {
color: inherit !important;
text-decoration: none !important
}
@media only screen and (min-width: 481px) {
.hd { display: none!important }
}
@media only screen and (max-width: 480px) {
.hm { display: none!important }
}
[style*="Fira Sans"] {font-family: 'Fira Sans', BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,sans-serif !important;}
</style>
<!--[if !mso]><!-->
<link href="https://fonts.googleapis.com/css2?family=Fira+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" type="text/css">
<!--<![endif]-->
<!--[if mso]>
<xml>
<o:OfficeDocumentSettings>
<o:AllowPNG/>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml>
<![endif]-->
</head>
<body class=t0 style="min-width:100%;Margin:0px;padding:0px;background-color:#F0F0F0;"><div class=t1 style="background-color:#F0F0F0;"><table role=presentation width=100% cellpadding=0 cellspacing=0 border=0 align=center><tr><td class=t113 style="font-size:0;line-height:0;mso-line-height-rule:exactly;" valign=top align=center>
<!--[if mso]>
<v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false">
<v:fill color=#F0F0F0 />
</v:background>
<![endif]-->
<table role=presentation width=100% cellpadding=0 cellspacing=0 border=0 align=center><tr><td>
<table class=t44 role=presentation cellpadding=0 cellspacing=0 align=center><tr><td class=t45 style="background-color:#1B1E27;"><div class=t51 style="display:inline-table;width:100%;text-align:center;vertical-align:top;">
<!--[if mso]>
<table role=presentation cellpadding=0 cellspacing=0 align=center valign=top><tr><td width=600 valign=top><![endif]-->
<div class=t55 style="display:inline-table;text-align:initial;vertical-align:inherit;width:100%;max-width:600px;">
<table role=presentation width=100% cellpadding=0 cellspacing=0 class=t57><tr>
<td class=t58 style="background-color:#1B1E27;background-image:url(https://i.imgur.com/g9HweM6.png);background-repeat:repeat;background-size:auto;background-position:center center;"><table role=presentation width=100% cellpadding=0 cellspacing=0><tr><td><div class=t103 style="mso-line-height-rule:exactly;mso-line-height-alt:125px;line-height:125px;font-size:1px;display:block;">&nbsp;</div></td></tr><tr><td>
<table class=t105 role=presentation cellpadding=0 cellspacing=0 align=center><tr><td class=t106 style="background-color:unset;background-repeat:repeat;background-size:auto;background-position:center center;width:180px;"><div style="font-size:0px;"><img class=t112 style="display:block;border:0;height:auto;width:100%;Margin:0;max-width:100%;" width=180 src=https://mailsend-email-assets.mailtrap.io/r3cf1p6x4d4vf1blh57bjdafymmg.png /></div></td>
</tr></table>
</td></tr><tr><td><div class=t93 style="mso-line-height-rule:exactly;mso-line-height-alt:55px;line-height:55px;font-size:1px;display:block;">&nbsp;</div></td></tr><tr><td>
<table class=t95 role=presentation cellpadding=0 cellspacing=0 align=center><tr><td class=t96 style="width:315px;"><h1 class=t102 style="text-decoration:none;text-transform:none;color:#FFFFFF;text-align:center;mso-line-height-rule:exactly;mso-text-raise:1px;font:normal 700 48px/52px BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,sans-serif, 'Fira Sans';">Forgot your password?</h1></td>
</tr></table>
</td></tr><tr><td><div class=t94 style="mso-line-height-rule:exactly;mso-line-height-alt:30px;line-height:30px;font-size:1px;display:block;">&nbsp;</div></td></tr><tr><td>
<table class=t85 role=presentation cellpadding=0 cellspacing=0 align=center><tr><td class=t86 style="width:350px;"><p class=t92 style="text-decoration:none;text-transform:none;color:#666666;text-align:center;mso-line-height-rule:exactly;mso-text-raise:3px;font:normal 500 20px/30px BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,sans-serif, 'Fira Sans';">To reset your password, click the button below.</p></td>
</tr></table>
</td></tr><tr><td><div class=t71 style="mso-line-height-rule:exactly;mso-line-height-alt:40px;line-height:40px;font-size:1px;display:block;">&nbsp;</div></td></tr><tr><td>
<table class=t73 role=presentation cellpadding=0 cellspacing=0 align=center><tr><td class=t74 style="background-color:#0055FF;width:308px;text-align:center;line-height:58px;mso-line-height-rule:exactly;mso-text-raise:11px;border-radius:14px 14px 14px 14px;"><a class=t80 href=${process.env.SITE_URL}/pass/forget/${reset} style="display:block;text-decoration:none;color:#FFFFFF;text-align:center;mso-line-height-rule:exactly;mso-text-raise:11px;font:normal 600 21px/58px BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,sans-serif, 'Fira Sans';" target=_blank>Reset your password</a></td>
</tr></table>
</td></tr><tr><td><div class=t72 style="mso-line-height-rule:exactly;mso-line-height-alt:60px;line-height:60px;font-size:1px;display:block;">&nbsp;</div></td></tr><tr><td>
<table class=t63 role=presentation cellpadding=0 cellspacing=0 align=center><tr><td class=t64 style="width:350px;"><p class=t70 style="text-decoration:none;text-transform:none;color:#BBBBBB;text-align:center;mso-line-height-rule:exactly;mso-text-raise:3px;font:normal 400 16px/25px BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,sans-serif, 'Fira Sans';">If you do not want to change your password or didn&#39;t request a reset, you can ignore and delete this email.</p></td>
</tr></table>
</td></tr><tr><td><div class=t62 style="mso-line-height-rule:exactly;mso-line-height-alt:125px;line-height:125px;font-size:1px;display:block;">&nbsp;</div></td></tr></table></td>
</tr></table>
</div>
<!--[if mso]>
</td>
</tr></table>
<![endif]-->
</div></td>
</tr></table>
</td></tr><tr><td>
<table class=t5 role=presentation cellpadding=0 cellspacing=0 align=center><tr><td class=t6 style="background-color:unset;"><div class=t12 style="display:inline-table;width:100%;text-align:center;vertical-align:top;">
<!--[if mso]>
<table role=presentation cellpadding=0 cellspacing=0 align=center valign=top><tr><td width=600 valign=top><![endif]-->
<div class=t16 style="display:inline-table;text-align:initial;vertical-align:inherit;width:100%;max-width:600px;">
<table role=presentation width=100% cellpadding=0 cellspacing=0 class=t18><tr>
<td class=t19 style="background-color:unset;padding:40px 0 40px 0;"><table role=presentation width=100% cellpadding=0 cellspacing=0><tr><td>
<table class=t34 role=presentation cellpadding=0 cellspacing=0 align=center><tr><td class=t35 style="width:350px;"><p class=t41 style="text-decoration:none;text-transform:none;color:#BBBBBB;text-align:center;mso-line-height-rule:exactly;mso-text-raise:2px;font:normal 400 12px/19px BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,sans-serif, 'Fira Sans';">This email was sent to ${data.email}. If you&#39;re not the intended receipient immediately remove this email from your system and all of it&#39;s content.</p></td>
</tr></table>
</td></tr><tr><td><div class=t33 style="mso-line-height-rule:exactly;mso-line-height-alt:20px;line-height:20px;font-size:1px;display:block;">&nbsp;</div></td></tr><tr><td>
<table class=t24 role=presentation cellpadding=0 cellspacing=0 align=center><tr><td class=t25 style="width:350px;"><p class=t31 style="text-decoration:none;text-transform:none;color:#BBBBBB;text-align:center;mso-line-height-rule:exactly;mso-text-raise:2px;font:normal 400 12px/19px BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,sans-serif, 'Fira Sans';">2024 Bits Management. All rights reserved</p></td>
</tr></table>
</td></tr></table></td>
</tr></table>
</div>
<!--[if mso]>
</td>
</tr></table>
<![endif]-->
</div></td>
</tr></table>
</td></tr></table></td></tr></table></div></body>
</html>`, // plain text body
        }).then(console.log, console.error);

        //console.log("Message sent: %s", info.messageId);
      }
      main().catch(console.error);
    }
  });
});

router.get("/pass/forget/:id", async (req, res, next) => {
  let username = [];
  if (req.session.userId) {
    username.push(req.session.username);
  }
  Password.findOne({ reset_link: req.params.id }, async (err, data) => {
    if (!data) {
      res.sendStatus(404)
    } else if (data.expired === true) {
      res.sendStatus(404)
    } else {
      const UserData = await User.findOne({ unique_id: data.user_id });

      let link = req.params.id

      res.render("forgotpass", {
        UserData: UserData,
        link: link,
        username: username
      })
    }
  })
});

router.post("/pass/forget", (req, res, next) => {
  console.log(req.body.user)
  User.findOne({ unique_id: parseInt(req.body.user) }, async (err, data) => {
    if (!data) {
      res.sendStatus(404)
    } else {
      data.password = req.body.password
      data.passwordConf = req.body.password

      data.save((err, Person) => {
        if (err) console.log(err);
        console.log("Success")
      });

      await Password.findOneAndUpdate({ reset_link: req.body.link }, { $set: { expired: true } })

      res.redirect("/login")
    }
  })
})

const com_id = () => {
  var val = Math.floor(1000 + Math.random() * 9000);
  return val;
};
//End of account management

// Tasks & quizzes
router.get("/tasks", isEnabled, isAuthenticated, async (req, res, next) => {
    let username = [];
    if (req.session.userId) {
      username.push(req.session.username);
    }
    let tasks = await Tasks.find();
    const user_tasks = await userTasks.findOne({ user_id: req.session.userId });
    const approved = user_tasks.approved_tasks;
    const declined = user_tasks.declined_tasks;
    const pending = user_tasks.pending_tasks;
    const approvedArray = approved.map(function (data) {
      return data.task_id;
    });
    const declineArray = declined.map(function (data) {
      return data.task_id;
    });
    const pendingArray = pending.map(function (data) {
      return data.task_id;
    });

    for (i = 0; i < tasks.length; i++) {
      tasks[i].task_id = tasks[i].task_id / 100
    }

    res.render("taskdata", {
      tasks: tasks,
      approvedArray: approvedArray,
      declineArray: declineArray,
      pendingArray: pendingArray,
      username: username
    });
  });

router.get("/quiz", isEnabled, isAuthenticated, async (req, res, next) => {
    let username = [];
    if (req.session.userId) {
      username.push(req.session.username);
    }
    const user_data = await User.findOne({ unique_id: req.session.userId });
    const test_data = await Tests.find().sort({ test_id: -1 });
    const str = user_data.grade;
    const isAdmin = user_data.adminUser;

    const replaced = str.replace(/\D/g, "");

    let user_type;
    if (replaced >= 6 && replaced <= 9) {  //Checking the users grade.
      user_type = "junior";
    } else if (replaced >= 10) {
      user_type = "senior";
    }

    const filteredQuiz = test_data
      .filter(function (data) {
        if (isAdmin === true) {
          return data.test_type;
        } else {
          return data.test_type === user_type;
        }
      })
      .map(function (data) {
        return {
          id: data._id,
          test_dateTime: data.test_dateTime + " ; " + data.test_endDateTime,
          test_duration: "",
          test_id: data.test_id,
          test_name: data.test_name,
          test_description: data.test_description,
          test_link: ["", data.test_link],
          time: "",
          venue: data.test_venue,
          user_submissions: data.user_submissions
        };
      });

    for (let i = 0; i < filteredQuiz.length; i++) {
      const { DateTime } = require('luxon');

      const quizDateTimeOriginal = ((filteredQuiz[i].test_dateTime).split(" ; "))[0];
      const quizEndDateTimeOriginal = ((filteredQuiz[i].test_dateTime).split(" ; "))[1];

      const currentDateTime = DateTime.now().setZone('IST');
      const quizStartDateTime = DateTime.fromISO(quizDateTimeOriginal);
      const quizEndDateTime = DateTime.fromISO(quizEndDateTimeOriginal);
      const quizStartDateTime_20minExtension = quizEndDateTime.plus({ minutes: 20 });
      const quizStartDateTime_Soon = quizStartDateTime.minus({ minutes: 30 });

      let userSubmission_array = filteredQuiz[i].user_submissions;

      let user_record = userSubmission_array
        .filter(data => data.unique_id === req.session.userId)
        .map(data => ({
          started_time: data.started_time,
          user_answers: data.user_answers,
          marks_scored: data.marks_scored
        }));

      if (user_record[0] != undefined && JSON.stringify(user_record[0].user_answers) != JSON.stringify([])) {
        if(user_record[0].marks_scored !== ""){
          filteredQuiz[i].test_link = ["Submission Evaluated", ""];
        }else {
          filteredQuiz[i].test_link = ["Submission Recorded", ""];
        }
      } else if (currentDateTime >= quizStartDateTime && currentDateTime < quizStartDateTime_20minExtension && filteredQuiz[i].venue === "Online") {
        if (filteredQuiz[i].test_link[1] !== "") {
          filteredQuiz[i].test_link = ["Start Quiz", `/quiz/${filteredQuiz[i].test_id}`];
        } else {
          filteredQuiz[i].test_link = ["Start Quiz", `/quiz/${filteredQuiz[i].test_id}`];
        }
      } else if (filteredQuiz[i].venue === "Online") {
        if(currentDateTime >= quizStartDateTime_Soon && currentDateTime <= quizStartDateTime){
          filteredQuiz[i].test_link = ["Starting Soon", "/"];
        }else if(currentDateTime >= quizEndDateTime) {
          filteredQuiz[i].test_link = ["Quiz Ended", ''];
        }else {
            filteredQuiz[i].test_link = ["Link Will Be Provided", "/"];
          }
        }

      const quizHour = (quizDateTimeOriginal).slice(11, 13);

      if (quizHour < 12) {
        filteredQuiz[i].time = (quizDateTimeOriginal).slice(11, 16) + " AM";
      } else if (quizHour >= 12) {
        let quizHourTwoDigit;
        if ((quizHour - 12) < 10 && (quizHour - 12) > 0) {
          quizHourTwoDigit = "0" + (quizHour - 12);
        } else if ((quizHour - 12) === 0) {
          quizHourTwoDigit = quizHour;
        } else {
          quizHourTwoDigit = quizHour - 12;
        }
        filteredQuiz[i].time = quizHourTwoDigit + ":" + (quizDateTimeOriginal).slice(14, 16) + " PM";
      }

      filteredQuiz[i].test_dateTime = (quizDateTimeOriginal).slice(0, 10);

      filteredQuiz[i].test_duration = quizEndDateTime.diff(quizStartDateTime, 'minutes').minutes;

      delete filteredQuiz[i].user_submissions;
    }

    res.render("onlinetests", {
      filteredQuiz: filteredQuiz,
      username: username
    });
  });

router.get("/quiz/:id", isEnabled, isAuthenticated, async (req, res, next) => {
    const test_data = await Tests.findOne({ test_id: req.params.id });
    const userdata = await User.findOne({unique_id: req.session.userId})

    const { DateTime } = require('luxon');

    const currentDateTime_Date = DateTime.now().setZone('IST');
    const currentDateTime_Iso = currentDateTime_Date.toISO();
    const quizStartDateTime_Date = DateTime.fromISO(test_data.test_dateTime);
    const quizEndDateTime_Date = DateTime.fromISO(test_data.test_endDateTime);
    const quizEndDateTime_20minExtension_Date = quizEndDateTime_Date.plus({ minutes: 20 });

    correctTime:
    if (currentDateTime_Date >= quizStartDateTime_Date && currentDateTime_Date < quizEndDateTime_20minExtension_Date) {
      userSubmission_array = test_data.user_submissions;

      let user_record = userSubmission_array
        .filter(data => data.unique_id === req.session.userId)
        .map(data => ({
          started_time: data.started_time,
          user_answers: data.user_answers,
          marks_scored: data.marks_scored
        }));

      if (user_record.length === 0) {
        Tests
          .findOne({ test_id: req.params.id })
          .then((test) => {
            test.user_submissions.push({
              unique_id: req.session.userId,
              email: userdata.email,
              marks_scored: "",
              position: 0,
              started_time: currentDateTime_Iso,
              user_answers: [],
              penalties: 0
            });
            test
              .save()
              .then(() => {
                return "Success";
              })
              .catch(console.log);
          })
          .catch(console.log);

        user_record = [
          {
            started_time: currentDateTime_Iso,
            user_answers: [],
            marks_scored: ''
          }
        ];
      }

      if (JSON.stringify(user_record[0].user_answers) != JSON.stringify([])) {
        res.redirect("/quiz");
        break correctTime;
      }

      var quizQuestionsArray = test_data.questions;

      const results = quizQuestionsArray.map(function (data) {
        return {
          id: data._id,
          question: data.question,
          answers: data.answers,
          correct_answer: data.correct_answer,
          media_attachment: data.media_attachment,
        };
      });

      let quizTimer = "";
      const quizDurationInMinutes = quizEndDateTime_Date.diff(quizStartDateTime_Date, 'minutes').minutes;

      const quizStartDateTime_20minExtension_Date = quizStartDateTime_Date.plus({ minutes: 20 });
      const userLoggedTime_Date = DateTime.fromISO(user_record[0].started_time);

      if (userLoggedTime_Date < quizStartDateTime_20minExtension_Date) {
        const calculatingQuizTimer = userLoggedTime_Date.plus({ minutes: quizDurationInMinutes });
        quizTimer = calculatingQuizTimer.diff(currentDateTime_Date, 'seconds').seconds;
        quizTimer = Math.round(quizTimer);
        //user logged time + (quiz start time - quiz end time) - current time
      } else {
        quizTimer = quizEndDateTime_20minExtension_Date.diff(currentDateTime_Date, 'seconds').seconds;
        quizTimer = Math.round(quizTimer);
        //quiz end time - current time
      }

      let username = [];
      if (req.session.userId) {
        username.push(req.session.username);
      }

      function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
      }

      const resultsShuffled = shuffleArray(results);

      res.render("quiz", {
        results: resultsShuffled,
        test_data: test_data,
        quizTimer: quizTimer,
        username: username
      });
    } else {
      res.redirect("/quiz");
    }
  });

router.post("/quiz/submit/:id", isAuthenticated, async (req, res, next) => {
  const test_data = await Tests.findOne({ test_id: req.params.id });

  var quizQuestionsArray = test_data.questions;

  const results = quizQuestionsArray.map(function (data) {
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
  let userSubmission_array = test_data.user_submissions;

  let user_record = userSubmission_array
    .filter(data => data.unique_id === req.session.userId)
    .map(data => ({
      started_time: data.started_time,
      user_answers: data.user_answers,
      marks_scored: data.marks_scored
    }));

  if (JSON.stringify(user_record[0].user_answers) == JSON.stringify([])) {
    Tests.updateOne(
      { "test_id": req.params.id },
      {
        $set: {
          'user_submissions.$[x].user_answers': user_ans,
          'user_submissions.$[x].penalties': Math.round(parseInt(req.body.penalties))
        }
      },
      {
        arrayFilters: [
          { "x.unique_id": parseInt(req.session.userId) }
        ]
      }
    ).catch(error => {
      console.error("Error during update operation:", error);
    });
  }

  res.redirect("/quiz");
});

router.post("/test/submit", isEnabled, isAuthenticated, async (req, res, next) => {
    const user_data = await User.findOne({ unique_id: req.session.userId });
    Admin.findOne({ number: 1 })
      .then((task) => {
        task.quizData.push({
          quiz_name: req.body.name,
          quiz_id: req.body.id,
          username: user_data.username,
          userId: user_data.unique_id,
        });
        task
          .save()
          .then(() => {
            return "Success";
          })
          .catch(console.log);
      })
      .catch(console.log);

    res.redirect(req.body.link);
  });

module.exports = router;