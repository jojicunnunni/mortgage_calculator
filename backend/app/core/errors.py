from fastapi import Request
from fastapi.responses import JSONResponse

def register_error_handlers(app):
    @app.exception_handler(Exception)
    async def all_exception_handler(request: Request, exc: Exception):
        # Avoid leaking internals; log separately
        return JSONResponse(status_code=500, content={"error": "Internal server error"})
