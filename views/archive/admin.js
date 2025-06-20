//hypertext email
// router.post(
//   "/email/send/hypertext",
//   isAuthenticated,
//   isAdmin,
//   async (req, res, next) => {
//     const user_data = await User.find({ hypertextUser: true });
//     const emails = user_data.map(function (data) {
//       return data.email;
//     });
//
//     async function main() {
//       let transporter = nodemailer.createTransport({
//         host: process.env.SMTP_SERVER,
//         port: parseInt(process.env.SMTP_PORT),
//         secure: true,
//         auth: {
//           user: process.env.USERNAME,
//           pass: process.env.PASSWORD,
//         },
//       });
//
//       let info = await transporter.sendMail({
//         from: `"BITS 24" <${process.env.USERNAME}>`,
//         to: emails,
//         subject: req.body.subject,
//         text: req.body.message, // plain text body
//       });
//
//       console.log("Message sent: %s", info.messageId);
//     }
//     main().catch(console.error);
//     res.redirect("/admin/email/send");
//   }
// );

// old dashboard code
// router.get("/", isAuthenticated, isAdmin, async (req, res, next) => {
//   const userData = await User.findOne({ unique_id: req.session.userId });
//
//   if (userData.adminUser) { //Fetching user profile
//     const taskdata = await Admin.findOne({ number: 1 });
//
//     if (!taskdata) {
//       let newData = new Admin({
//         number: 1,
//         taskData: [],
//         quizData: []
//       });
//
//       newData.save((err, data) => {
//         if (err) console.log(err)
//         else {
//           console.log("Successfully initialized Admin Panel")
//         }
//       })
//     }
//
//     const tasks = taskdata.taskData;
//
//     const choosedResults = tasks.map(function (data) {
//       return {
//         username: data.username,
//         userid: data.userId,
//         task_title: data.task_title,
//         task_description: data.task_description,
//         task_id: data.task_id,
//         task_category: data.task_category,
//         project_url: data.project_url,
//         feedback: data.feedback,
//       };
//     });
//
//     res.render("admin", {
//       taskData: choosedResults,
//     });
//   } else {
//     res.send(
//         "This is a restricted area. Please do not try to access this page."
//     );
//   }
// });
// router.get("/email/send", isAuthenticated, isAdmin, async (req, res, next) => {
//   res.render("email");
// });
// router.get("/power", isAuthenticated, isAdmin, async (req, res, next) => {
//   const powerAdmins = [1, 2, 3];
//   findPowerAdmins:
//   for (let i = 0; i < powerAdmins.length; i++) {
//     if (req.session.userId === powerAdmins[i]) {
//       isPowerAdmin = true;
//       console.log("Power Admin Logged : " + req.session.userId);
//       break findPowerAdmins;
//     } else {
//       isPowerAdmin = false;
//     }
//   };
//   const data = await IMP.findOne({ power_admin: 1 });
//   if (!data) {
//     let newData = new IMP({
//       power_admin: 1,
//       competition_enabled: true
//     });
//
//     newData.save((err, data) => {
//       if (err) console.log(err)
//       else {
//         console.log("Successfully initialized Power Admin Sequence")
//       }
//     })
//   }
//   if (isPowerAdmin !== true) {
//     return res.json({
//       code: 403,
//       message: "You are not authorized to access this page",
//     });
//   } else {
//     res.render("power", {
//       data: data,
//     });
//   }
// });
// router.get("/tests", isAuthenticated, isAdmin, async (req, res, next) => {
//   const test_data = await Tests.find();
//   res.render("tests", {
//     test_data: test_data,
//   });
// });
// router.get(
//   "/tasks/coding",
//   isAuthenticated,
//   isAdmin,
//   async (req, res, next) => {
//     const data = await Admin.findOne({ number: 1 });
//     const tasks = data.taskData;
//
//     var codingTasksArray = tasks
//       .filter(function (data) {
//         return data.task_category === "CODING";
//       })
//       .map(function (data) {
//         return {
//           id: data._id,
//           task_title: data.task_title,
//           task_description: data.task_description,
//           task_id: data.task_id,
//           task_category: data.task_category,
//         };
//       });
//
//     const uniqueArray = [
//       ...new Map(codingTasksArray.map((m) => [m.task_id, m])).values(),  //Mapping values to the array
//     ];
//
//     let length = [];
//
//     uniqueArray.forEach((data) => {
//       var array = tasks
//         .filter(function (mesure) {
//           return mesure.task_id === data.task_id;
//         })
//         .map(function (mesure) {
//           return {
//             id: mesure._id,
//             task_id: mesure.task_id,
//           };
//         });
//
//       length.push(array.length);
//     });
//
//     res.render("coding", {
//       uniqueArray: uniqueArray,
//       length: length,
//     });
//   }
// );
//
// router.get(
//   "/tasks/design",
//   isAuthenticated,
//   isAdmin,
//   async (req, res, next) => {
//     const data = await Admin.findOne({ number: 1 });
//     const tasks = data.taskData;
//
//     const designTasksArray = tasks
//       .filter(function (data) {
//         return data.task_category === "DESIGN";
//       })
//       .map(function (data) {
//         return {
//           id: data._id,
//           task_title: data.task_title,
//           task_description: data.task_description,
//           task_id: data.task_id,
//           task_category: data.task_category,
//         };
//       });
//
//     const uniqueArray = [
//       ...new Map(designTasksArray.map((m) => [m.task_id, m])).values(),
//     ];
//
//     let length = [];
//
//     uniqueArray.forEach((data) => {
//       var array = tasks
//         .filter(function (mesure) {
//           return mesure.task_id === data.task_id;
//         })
//         .map(function (mesure) {
//           return {
//             id: mesure._id,
//             task_id: mesure.task_id,
//           };
//         });
//
//       length.push(array.length);
//     });
//
//     res.render("design", {
//       uniqueArray: uniqueArray,
//       length: length,
//     });
//   }
// );
//
// router.get(
//   "/tasks/explore",
//   isAuthenticated,
//   isAdmin,
//   async (req, res, next) => {
//     const data = await Admin.findOne({ number: 1 });
//     const tasks = data.taskData;
//
//     const exploreTasksArray = tasks
//       .filter(function (data) {
//         return data.task_category === "EXPLORE";
//       })
//       .map(function (data) {
//         return {
//           id: data._id,
//           task_title: data.task_title,
//           task_description: data.task_description,
//           task_id: data.task_id,
//           task_category: data.task_category,
//         };
//       });
//
//     const uniqueArray = [
//       ...new Map(exploreTasksArray.map((m) => [m.task_id, m])).values(),
//     ];
//
//     let length = [];
//
//     uniqueArray.forEach((data) => {
//       var array = tasks
//         .filter(function (mesure) {
//           return mesure.task_id === data.task_id;
//         })
//         .map(function (mesure) {
//           return {
//             id: mesure._id,
//             task_id: mesure.task_id,
//           };
//         });
//
//       length.push(array.length);
//     });
//
//     res.render("explore", {
//       uniqueArray: uniqueArray,
//       length: length,
//     });
//   }
// );
//
// router.get(
//   "/tasks/coding/:id",
//   isAuthenticated,
//   isAdmin,
//   async (req, res, next) => {
//     const data = await Tasks.findOne({ task_id: req.params.id });
//     let max_marks;
//     if (data.max_marks !== undefined) {
//       max_marks = data.max_marks;
//     } else {
//       max_marks = "10";
//     }
//     const admin = await Admin.findOne({ number: 1 });
//     const tasks = admin.taskData;
//     if (data) {
//       const codingTasksArray = tasks
//         .filter(function (data) {
//           return data.task_id === parseInt(req.params.id);
//         })
//         .map(function (data) {
//           return {
//             id: data._id,
//             username: data.username,
//             userid: data.userId,
//             task_title: data.task_title,
//             task_description: data.task_description,
//             task_id: data.task_id,
//             task_category: data.task_category,
//             project_url: data.project_url,
//             feedback: data.feedback,
//             max_marks: max_marks,
//           };
//         });
//
//       res.render("codingpage", {
//         codingTasksArray: codingTasksArray
//       });
//     } else {
//       return res.json({
//         code: 404,
//         message:
//           "Task ID not found. If you think this is a mistake please message +94702420707",
//       });
//     }
//   }
// );
//
// router.get(
//   "/tasks/design/:id",
//   isAuthenticated,
//   isAdmin,
//   async (req, res, next) => {
//     const data = await Tasks.findOne({ task_id: req.params.id });
//     let max_marks;
//     if (data.max_marks !== undefined) {
//       max_marks = data.max_marks;
//     } else {
//       max_marks = "10";
//     }
//     const admin = await Admin.findOne({ number: 1 });
//     const tasks = admin.taskData;
//     if (data) {
//       const designTasksArray = tasks
//         .filter(function (data) {
//           return data.task_id === parseInt(req.params.id);
//         })
//         .map(function (data) {
//           return {
//             id: data._id,
//             username: data.username,
//             userid: data.userId,
//             task_title: data.task_title,
//             task_description: data.task_description,
//             task_id: data.task_id,
//             task_category: data.task_category,
//             project_url: data.project_url,
//             feedback: data.feedback,
//             max_marks: max_marks,
//           };
//         });
//
//       res.render("designpage", {
//         designTasksArray: designTasksArray,
//       });
//     } else {
//       return res.json({
//         code: 404,
//         message:
//           "Task ID not found. If you think this is a mistake please message +94776976673",
//       });
//     }
//   }
// );
//
// router.get(
//   "/tasks/explore/:id",
//   isAuthenticated,
//   isAdmin,
//   async (req, res, next) => {
//     const data = await Tasks.findOne({ task_id: req.params.id });
//     let max_marks;
//     if (data.max_marks !== undefined) {
//       max_marks = data.max_marks;
//     } else {
//       max_marks = "10";
//     }
//     const admin = await Admin.findOne({ number: 1 });
//     const tasks = admin.taskData;
//     if (data) {
//       const exploreTasksArray = tasks
//         .filter(function (data) {
//           return data.task_id === parseInt(req.params.id);
//         })
//         .map(function (data) {
//           return {
//             id: data._id,
//             username: data.username,
//             userid: data.userId,
//             task_title: data.task_title,
//             task_description: data.task_description,
//             task_id: data.task_id,
//             task_category: data.task_category,
//             project_url: data.project_url,
//             feedback: data.feedback,
//             max_marks: max_marks,
//           };
//         });
//
//       res.render("explorepage", {
//         exploreTasksArray: exploreTasksArray,
//       });
//     } else {
//       return res.json({
//         code: 404,
//         message:
//           "Task ID not found. If you think this is a mistake please message +94776976673",
//       });
//     }
//   }
// );