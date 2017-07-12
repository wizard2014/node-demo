const mongoose = require('mongoose');
const Store = mongoose.model('Store');

exports.homePage = (req, res) => {
  res.render('index', {
    title: 'Home'
  });
};

exports.addStore = (req, res) => {
  res.render('editStore', {
    title: 'Add Store'
  });
};

exports.createStore = async (req, res) => {
  // const store = new Store(req.body);
  // store
  //     .save()
  //     .then(store => {
  //       res.json(store);
  //     })
  //     .catch(err => {
  //       throw Error(err);
  //     });

//  using async
  const store = await (new Store(req.body)).save();

  req.flash('success', `Successfully created ${store.name}`);

  res.redirect(`/store/${store.slug}`);
};

exports.getStores = async (req, res) => {
  const stores = await Store.find();

  res.render('stores', { title: 'Stores', stores });
};
