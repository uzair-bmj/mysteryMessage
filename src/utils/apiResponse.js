const apiResponse = ( statusCode, data = null, message = '') => {
    res.status(statusCode).json({
        status: statusCode >= 200 && statusCode < 300 ? 'success' : 'error',
        data,
        message,
    });
};

export default apiResponse;
