const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
const multer = require("multer");
var bcrypt = require("bcryptjs");

const Product = require("./model/productModel.js");
const User = require("./model/productModel.js");
// const product = require('./model/productModel.js');

// mongoose
// Connect MongoDB at default port 27017.
mongoose
  .connect("mongodb://root:linhtutkyaw@127.0.0.1:27017/basicCRUD")
  .then(() => {
    console.log("connect");
    app.listen(port, () =>
      console.log(`Example app listening on port ${port}!`)
    );
  })
  .catch((error) => console.log(error));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/api", (req, res) => [
  res.status(200).json({
    json: "success",
  }),
]);

// Create
app.post("/product", async (req, res) => {
  // console.log(req.body)
  // res.send(req.body)

  try {
    const product = await Product.create(req.body);
    res.status(200).json({
      newPorduct: product,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: error.message,
    });
  }
});

// fetch or get data
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json({
      productList: products,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// get product with id
app.get("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.status(200).json({
      productList: product,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// update or edit
app.put("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body);
    if (!product) {
      // if dont see id return 404 error
      return res.status(404).json({
        message: "no data for this id",
      });
    } else {
      const updateProduct = await Product.findById(id);
      res.status(200).json({
        updateProductwithId: updateProduct,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// remove or delete
app.delete("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      res.status(404).json({
        message: `cant find product by this ${id}`,
      });
    } else {
      res.status(200).json({
        deleteProduct: product,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});
// -------------------------------------------------------------------------------------------
app.post("/product", async (req, res) => {
  // console.log(req.body)
  // res.send(req.body)

  try {
    const product = await Product.create(req.body);
    res.status(200).json({
      newPorduct: product,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: error.message,
    });
  }
});

// User Create
app.post("/register", async (req, res) => {
  const data = req.body;
  const password = req.body.password;

  // if (password) {
  //   var salt = bcrypt.genSaltSync(10);
  //   var hash = bcrypt.hashSync(password, salt);
  //   console.log("passWord is " + hash);
  //   // Store hash in your password DB.
  // } else {
  //   console.log("need to fill pass");
  // }

  try {
    const user = await User.create(data, password);
    res.status(200).json({
      user: user,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: error.message,
    });
  }
});

//Handling user login
app.post("/login", async (req, res) => {
  try {
    // check if the user exists
    const user = await User.findOne({ username: req.body.username });
    if (user) {
      //check if password matches
      const result = req.body.password === user.password;
      if (result) {
        res.status(200).json({
          user: user,
        });
      } else {
        res.status(400).json({ error: "password doesn't match" });
      }
    } else {
      res.status(400).json({ error: "User doesn't exist" });
    }
  } catch (error) {
    res.status(400).json({ error });
  }
});

//Handling user logout
app.get("/logout", function (req, res) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

// const register = (req, res) => {
//   const data = req.body;

//   const password = data.password;

//   if (password) {
//     var salt = bcrypt.genSaltSync(10);
//     var hash = bcrypt.hashSync(password, salt);
//     console.log("passWord is " + hash);
//     // Store hash in your password DB.
//   } else {
//     console.log("need to fill pass");
//   }

//   const authToken = jwt.sign(
//     { email: data.email, username: data.username },
//     "12345",
//     {
//       expiresIn: "24h",
//     }
//   );

//   data.token = authToken;
//   console.log("token is:", authToken);

//   const query =
//     "insert into users (username,email,password,token) values (?,?,?,?)";

//   db.execute(
//     query,
//     [data.username, data.email, hash, data.token],
//     (err, result) => {
//       if (err) {
//         console.log(err);
//         return;
//       }

//       res.status(200).json({
//         error: false,
//         message: "user register successfully",
//         data: {
//           id: result.insertId,
//           ...data,
//         },
//       });
//     }
//   );
// };

// // ?LOGIN
// const login = (req, res) => {
//   const data = req.body;

//   const password = data.password;
//   console.log("password is " + password);

//   var salt = bcrypt.genSaltSync(10);
//   var hash = bcrypt.hashSync(password, salt);

//   if (bcrypt.compare(password, hash)) {
//     const query = "select * from users where email = ? AND password = ?";
//     db.execute(query, [data.email, data.password], (err, result) => {
//       if (err) {
//         console.log(err);
//         return;
//       }

//       const data = result[0];
//       const authToken = jwt.sign(
//         { email: data.email, username: data.username },
//         "12345",
//         {
//           expiresIn: "1h",
//         }
//       );

//       // false

//       const query = "update users set token = ? where id = ?";

//       db.execute(query, [authToken, data.id], (err, result) => {
//         if (err) {
//           console.log(err);
//           return;
//         }

//         res.status(200).json({
//           error: false,
//           message: "user login successfully",
//           data: {
//             id: result.insertId,
//             token: authToken,
//             ...data,
//           },
//         });
//       });
//     });
//   } else {
//     res.status(404).json({
//       error: true,
//       message: "password no match",
//     });
//     return;
//   }
// };

app.get("/", (req, res) => res.send("Hello World!"));
