const express = require("express");
const expressLayout = require("express-ejs-layouts");
const { body, validationResult, check } = require("express-validator");

require("./db");
const Book = require("./model/contact.js");
const Comment = require("./model/comment.js");

const app = express();
const port = process.env.PORT || 10000;

//gunakan template ejs
app.set("view engine", "ejs");
app.use(expressLayout);

//
app.use(express.json());

// built-in middleware
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/f9DwNsZ", async (req, res) => {
  const comments = await Comment.find({}, { email: 0 });
  res.status(200).json({
    status: "success",
    message: "successfully retrieved data from database",
    data: comments,
  });
});

app.get("/", (req, res) => {
  //res.send("Hello World!");
  res.render("index", { greet: "Selamat Datang", layout: "Layouts/main-layout" });
});

app.get("/arrival", (req, res) => {
  //res.send("Hello World!");
  res.render("arrival", { layout: "Layouts/arrival-layout" });
});

app.get("/awsmonitoring", (req, res) => {
  //res.send("Hello World!");
  res.render("awsmonitoring", { layout: "Layouts/aws-monitoring" });
});

app.get("/about", (req, res) => {
  //res.send("Ini adalah halaman about");
  const mahasiswa = [
    {
      nama: "Erik",
      email: "eriklesler@gmail.com",
    },
  ];
  res.render("about", { layout: "Layouts/main-layout", mahasiswa });
});

app.get("/contact", async (req, res) => {
  const contacts = await Book.find();
  res.render("contact", { layout: "Layouts/none", contacts });
});

app.get("/comment123", (req, res) => {
  //const contacts = await Book.find();
  res.render("comment123", { layout: "Layouts/none" });
});


// procesc add contact
app.post(
  "/contact",
  [
    body("nama").custom(async (value) => {
      const duplikat = await Book.findOne({ nama: value });
      if (duplikat) {
        throw new Error("Nama dengan kontak tersebut sudah ada");
      }
      return true;
    }),
    check("email", "email tidak valid").isEmail(),
    check("noHp", "No. Hp tidak valid").isMobilePhone("id-ID"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("tambah", { layout: "Layouts/none", errors: errors.array() });
    } else {
      Book.insertMany(req.body),
        (error, result) => {
          console.log(result.status.json());
          //res.redirect(301, "/contact");
          //res.render("contact", { layout: "Layouts/none", contacts });
        };
      res.redirect("/contact");
    }
  }
);

app.post(
  "/comment123", (req, res) => {
    Comment.insertMany(req.body), (error, result) => {
    console.log(result.status.json());

     
    }
    res.redirect("/contact");
  }
);

app.get("/contact/add", (req, res) => {
  res.render("tambah", { layout: "Layouts/none" });
});

// halaman detail kontak
app.get("/contact/:nama", async (req, res) => {
  const contact = await Book.findOne({ nama: req.params.nama });
  res.render("detail", { layout: "Layouts/none", contact });
});

app.use("/", (req, res) => {
  res.status(404);
  res.send("<h1>404</h1>");
});

app.listen(port, () => {
  console.log(`app is listening on port ${port}..`);
});
