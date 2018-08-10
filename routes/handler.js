const handler = (req, res) => {
  res.type('json');
  res.status(req.status ? req.status : 200);
  res.json({
    data: req.data ? req.data : 'success',
    error: req.error,
    errors: req.errors,
  });
  // switch (req.status) {
  //   case 404: {
  //     res.json();
  //     break;
  //   }
  //   case 400: {
  //     console.log(req.error);
  //     res.status(req.error.status).json({ error: req.error });
  //     break;
  //   }
  //   case 500: {
  //     const errors = req.error.errors;
  //     const error = errors[Object.keys(errors)[0]];
  //     res.json({ error: error.message });
  //     break;
  //   }
  //   case 200: {
  //     res.json({ data: req.data });
  //     break;
  //   }
  //   default: {
  //     res.end();
  //   }
  // }
};
export default handler