let app;
try {
    const serverModule = await import('../server/server.js');
    app = serverModule.default;
} catch (error) {
    console.error("Initialization Error:", error);
    app = (req, res) => {
        res.status(500).json({
            error: "Initialization Error",
            message: error.message,
            stack: error.stack
        });
    };
}

export default function(req, res) {
    try {
        return app(req, res);
    } catch (error) {
        console.error("Runtime Error:", error);
        return res.status(500).json({
            error: "Runtime Error",
            message: error.message,
            stack: error.stack
        });
    }
}
