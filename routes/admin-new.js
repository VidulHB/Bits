require("dotenv").config();
const express = require("express");
const fs = require('fs');
const path = require('path');
const router = express.Router();
const User = require("../new-models/user");
const nodemailer = require("nodemailer");
const Log = require("../Modules/logger");

const isAuthenticated = (req, res, next) => {
    if (!req.session.userId) {
        res.redirect("/login");
    } else {
        next();
    }
};
const isAdmin = async (req, res, next) => {
    if(await User.findOne({ id: req.session.userId }).admin === true) {
        Log('Admin Logged In: ' + req.session.userId);
        next();
    }else{
        res.redirect("/");
    }
};
const isSuperAdmin = async (req, res, next) => {
    if(await User.findOne({ id: req.session.userId }).superAdmin === true) {
        Log('Super Admin Logged In: ' + req.session.userId);
        next();
    }else{
        res.redirect("/");
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
    }).then(function (email){Log("Email Sent: " + email.envelope)}).catch(function (error) {Log("Error sending email: " + error)})
}

router.get("/", isAuthenticated, isAdmin, async (req, res, next) => {
    res.redirect("/admin/tasks/");
})





module.exports = router;