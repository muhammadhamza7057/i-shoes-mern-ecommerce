export const sendSuccess = (res, data = null, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    data,
    message,
  });
};

export const sendPaginated = (res, items, pagination, message = 'Success') => {
  return res.status(200).json({
    success: true,
    data: { items, pagination },
    message,
  });
};

export default { sendSuccess, sendPaginated };
