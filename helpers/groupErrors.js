const groupErrors = (err) => {
  return err.errors.reduce((acc, item) => {
    if (!acc[item.path]) {
      acc[item.path] = [item.message];
    } else {
      acc[item.path].push(item.message);
    }
    return acc;
  }, {});
};

module.exports = groupErrors;
