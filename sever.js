const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
const Product = require("./model/productModel.js");
// const product = require('./model/productModel.js');

// mongoose
// Connect MongoDB at default port 27017.
mongoose
  .connect(
    "mongodb://root:linhtutkyaw@127.0.0.1:27017/basicCRUD?authSource=admin"
  )
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
app.get('/products/:id', async(req,res) => {
  try {
    const {id} = req.params;
     const product = await Product.findById(id);
     res.status(200).json({
       productList: product,
     });
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
})


// update or edit 
app.put('/products/:id', async(req,res) => {
  try {
    const {id} = req.params
    const product = await Product.findByIdAndUpdate(id,req.body);
    if (!product) {
      // if dont see id return 404 error 
      return res.status(404).json({
        message: "no data for this id"
      })
    } else {
      const updateProduct = await Product.findById(id)
      res.status(200).json({
        updateProductwithId : updateProduct
      })
    }

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
})


// remove or delete 
app.delete('/products/:id', async(req,res) => {
  try {
    const {id} = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      res.status(404).json({
        message : `cant find product by this ${id}`
      })
    } else {
      res.status(200).json({
        deleteProduct :product
      })
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
})




app.get("/", (req, res) => res.send("Hello World!"));
