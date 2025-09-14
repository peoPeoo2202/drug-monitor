// Error Handler Middleware
const errorHandler = (err, req, res, next) => {
    console.error('Error occurred:', err);

    // Default error values
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';
    let stack = err.stack;

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = 'Validation Error';
        const errors = Object.values(err.errors).map(val => val.message);
        return res.status(statusCode).json({
            success: false,
            message: message,
            errors: errors
        });
    }

    // Mongoose duplicate key error
    if (err.code === 11000) {
        statusCode = 400;
        message = 'Duplicate field value entered';
        return res.status(statusCode).json({
            success: false,
            message: message,
            error: 'Duplicate field value'
        });
    }

    // Mongoose cast error (invalid ObjectId)
    if (err.name === 'CastError') {
        statusCode = 400;
        message = 'Invalid ID format';
        return res.status(statusCode).json({
            success: false,
            message: message,
            error: 'Invalid ID'
        });
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Invalid token';
    }

    if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Token expired';
    }

    // Development vs Production error response
    const isDevelopment = process.env.NODE_ENV === 'development';

    // For API routes, return JSON
    if (req.originalUrl.startsWith('/api/')) {
        return res.status(statusCode).json({
            success: false,
            message: message,
            ...(isDevelopment && { stack: stack })
        });
    }

    // For web pages, render error page
    res.status(statusCode).render('error', {
        title: 'Error',
        statusCode: statusCode,
        message: message,
        stack: isDevelopment ? stack : null,
        url: req.originalUrl,
        timestamp: new Date().toISOString()
    });
};

// 404 Not Found Handler
const notFoundHandler = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    error.statusCode = 404;
    next(error);
};

// Async Error Handler Wrapper
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

// Unhandled Promise Rejection Handler
const unhandledRejectionHandler = () => {
    process.on('unhandledRejection', (err, promise) => {
        console.error('Unhandled Promise Rejection:', err);
        // Close server gracefully
        process.exit(1);
    });
};

// Uncaught Exception Handler
const uncaughtExceptionHandler = () => {
    process.on('uncaughtException', (err) => {
        console.error('Uncaught Exception:', err);
        // Close server gracefully
        process.exit(1);
    });
};

module.exports = {
    errorHandler,
    notFoundHandler,
    asyncHandler,
    unhandledRejectionHandler,
    uncaughtExceptionHandler
};
