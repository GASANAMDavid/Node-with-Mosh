var express = require("express");
var router = express.Router();

const { auth } = require("../middleware/auth");
const { Customer, validate } = require("../models/customer");
const { getErrorMessages } = require("../utilities/ErrorHandlers/utility");

/* GET customers listing. */
router.get("/", async (req, res, next) => {
  // getting customers
  const customers = await Customer.find().sort("name");
  res.send(customers);
});

router.get("/:id", async (req, res, next) => {
  // getting single customer
  const customer = await Customer.findById(req.params.id);
  // check existence
  if (!customer)
    return res.status(404).send(`The customer with the given ID wasn't found`);
  res.send(customer);
});

router.post("/", auth, async (req, res) => {
  // validate
  const { error } = validate(req.body);
  if (error) return res.status(400).send(getErrorMessages(error));

  // Adding
  let customer = new Customer({
    name: req.body.name,
    phone: req.body.phone,
    isGold: req.body.isGold
  });
  await customer.save();
  res.send(customer);
});

router.put("/:id", auth, async (req, res) => {
  // validate
  const { error } = validate(req.body);
  if (error) return res.status(400).send(getErrorMessages(error));

  // update routine
  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      phone: req.body.phone,
      isGold: req.body.isGold
    },
    { new: true }
  );
  // check existence
  if (!customer)
    return res.status(404).send(`The customer with the given ID wasn't found`);
  res.send(customer);
});

router.delete("/:id", auth, async (req, res) => {
  const customer = await Customer.findByIdAndRemove(req.params.id);
  // check existence
  if (!customer)
    return res.status(404).send(`The customer with the given ID wasn't found`);

  res.send(customer);
});

module.exports = router;
