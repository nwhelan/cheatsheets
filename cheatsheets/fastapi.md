# FastAPI Quick Reference

## Installation & Setup

### Install
```bash
pip install "fastapi[standard]"
# Includes uvicorn and other standard dependencies
```

### Basic App
```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def read_root():
    return {"Hello": "World"}
```

### Run Server
```bash
uvicorn main:app --reload
# main = filename, app = FastAPI instance
# --reload for development
```

### Access
- API: `http://localhost:8000`
- Docs: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Path Operations

### HTTP Methods
Define different HTTP methods to perform CRUD operations on your resources.
```python
@app.get("/items")
async def read_items():
    return [{"item": "foo"}]

@app.post("/items")
async def create_item(item: Item):
    return item

@app.put("/items/{item_id}")
async def update_item(item_id: int, item: Item):
    return {"id": item_id, **item.model_dump()}

@app.delete("/items/{item_id}")
async def delete_item(item_id: int):
    return {"deleted": item_id}

@app.patch("/items/{item_id}")
async def partial_update(item_id: int, item: dict):
    return {"id": item_id, **item}
```

### Path Parameters
Extract dynamic values from the URL path with automatic type validation.
```python
@app.get("/items/{item_id}")
async def read_item(item_id: int):
    return {"item_id": item_id}

# Path parameter with type validation
@app.get("/users/{user_id}")
async def get_user(user_id: int):
    return {"user_id": user_id}

# Enum path parameters
from enum import Enum

class ModelName(str, Enum):
    alexnet = "alexnet"
    resnet = "resnet"

@app.get("/models/{model_name}")
async def get_model(model_name: ModelName):
    return {"model": model_name}
```

### Query Parameters
Handle optional filters, pagination, and search parameters from the URL query string.
```python
@app.get("/items/")
async def read_items(skip: int = 0, limit: int = 10):
    return {"skip": skip, "limit": limit}

# Optional parameters (Python 3.10+)
@app.get("/items/{item_id}")
async def read_item(item_id: int, q: str | None = None):
    if q:
        return {"item_id": item_id, "q": q}
    return {"item_id": item_id}

# Boolean parameters
@app.get("/items/")
async def read_items(active: bool = True):
    return {"active": active}
```

## Request Body

### Pydantic Models
Accept and validate JSON data sent in POST/PUT requests.
```python
from pydantic import BaseModel

class Item(BaseModel):
    name: str
    description: str | None = None
    price: float
    tax: float | None = None

@app.post("/items/")
async def create_item(item: Item):
    return item
```

### Model with Validation
Add constraints to ensure data meets business rules before processing.
```python
from pydantic import BaseModel, Field

class Item(BaseModel):
    name: str = Field(..., min_length=3)
    price: float = Field(..., gt=0)
    tax: float | None = Field(None, ge=0)

@app.post("/items/")
async def create_item(item: Item):
    return item
```

### Nested Models
Structure complex data with embedded objects and lists.
```python
class Image(BaseModel):
    url: str
    name: str

class Item(BaseModel):
    name: str
    image: Image | None = None
    tags: list[str] = []

@app.post("/items/")
async def create_item(item: Item):
    return item
```

## Response Models

Control what data is returned to clients, filtering out sensitive fields.

### Response Model
```python
class UserIn(BaseModel):
    username: str
    password: str
    email: str

class UserOut(BaseModel):
    username: str
    email: str

@app.post("/users/", response_model=UserOut)
async def create_user(user: UserIn) -> UserOut:
    return user  # password filtered out
```

### Status Codes
Return appropriate HTTP status codes to indicate operation results.
```python
from fastapi import status

@app.post("/items/", status_code=status.HTTP_201_CREATED)
async def create_item(item: Item):
    return item

@app.delete("/items/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_item(item_id: int):
    return None
```

### Multiple Response Models
Return different response types based on conditions using union types.
```python
@app.get("/items/{item_id}", response_model=Item | Message)
async def read_item(item_id: int):
    if item_id == 0:
        return {"message": "Not found"}
    return {"name": "Item", "price": 10}
```

## Dependencies

### Basic Dependency
Reuse common logic across multiple endpoints without code duplication.
```python
from fastapi import Depends

def common_parameters(q: str | None = None, skip: int = 0, limit: int = 100):
    return {"q": q, "skip": skip, "limit": limit}

@app.get("/items/")
async def read_items(commons: dict = Depends(common_parameters)):
    return commons
```

### Class Dependencies
Organize related dependencies into reusable classes for better structure.
```python
class CommonQueryParams:
    def __init__(self, q: str | None = None, skip: int = 0, limit: int = 100):
        self.q = q
        self.skip = skip
        self.limit = limit

@app.get("/items/")
async def read_items(commons: CommonQueryParams = Depends()):
    return commons
```

### Database Dependency
Manage database sessions with automatic cleanup using generator dependencies.
```python
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/users/")
async def read_users(db: Session = Depends(get_db)):
    return db.query(User).all()
```

## Authentication

### OAuth2 Password Bearer
Secure your API endpoints with token-based authentication.
```python
from fastapi.security import OAuth2PasswordBearer

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

@app.get("/users/me")
async def read_users_me(token: str = Depends(oauth2_scheme)):
    return {"token": token}
```

### Login Endpoint
Validate user credentials and issue access tokens.
```python
from fastapi.security import OAuth2PasswordRequestForm

@app.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect credentials")
    return {"access_token": user.username, "token_type": "bearer"}
```

### JWT Tokens
Create signed tokens with expiration for secure stateless authentication.
```python
from jose import JWTError, jwt
from datetime import datetime, timedelta, timezone

SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
```

## Error Handling

### HTTPException
Return structured error responses with appropriate status codes and messages.
```python
from fastapi import HTTPException

@app.get("/items/{item_id}")
async def read_item(item_id: int):
    if item_id not in items:
        raise HTTPException(status_code=404, detail="Item not found")
    return items[item_id]
```

### Custom Exception Handler
Define custom error handling logic for specific exception types.
```python
from fastapi import Request
from fastapi.responses import JSONResponse

class CustomException(Exception):
    def __init__(self, name: str):
        self.name = name

@app.exception_handler(CustomException)
async def custom_exception_handler(request: Request, exc: CustomException):
    return JSONResponse(
        status_code=418,
        content={"message": f"Oops! {exc.name} did something."}
    )
```

## Request Data

### Headers
Access different parts of the HTTP request beyond URL and body.
```python
from fastapi import Header

@app.get("/items/")
async def read_items(user_agent: str | None = Header(None)):
    return {"User-Agent": user_agent}
```

### Cookies
Read browser cookies for session management and preferences.
```python
from fastapi import Cookie

@app.get("/items/")
async def read_items(session_id: str | None = Cookie(None)):
    return {"session_id": session_id}
```

### Form Data
Accept HTML form submissions instead of JSON payloads.
```python
from fastapi import Form

@app.post("/login/")
async def login(username: str = Form(...), password: str = Form(...)):
    return {"username": username}
```

### File Upload
Handle file uploads from multipart form data.
```python
from fastapi import File, UploadFile

@app.post("/files/")
async def create_file(file: bytes = File(...)):
    return {"file_size": len(file)}

@app.post("/uploadfile/")
async def create_upload_file(file: UploadFile):
    contents = await file.read()
    return {"filename": file.filename, "size": len(contents)}
```

## Background Tasks

Run time-consuming operations after returning the response to avoid blocking.

```python
from fastapi import BackgroundTasks

def write_log(message: str):
    with open("log.txt", "a") as f:
        f.write(message)

@app.post("/send-notification/")
async def send_notification(email: str, background_tasks: BackgroundTasks):
    background_tasks.add_task(write_log, f"Notification sent to {email}\n")
    return {"message": "Notification sent"}
```

## Middleware

Process requests and responses globally across all endpoints.

### CORS
Enable cross-origin requests from browsers for frontend integration.
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Custom Middleware
Add custom logic that runs on every request and response.
```python
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response
```

## WebSockets

Enable real-time bidirectional communication with clients.

```python
from fastapi import WebSocket

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
        await websocket.send_text(f"Message: {data}")
```

## Database Integration

### SQLAlchemy Setup
Connect to SQL databases with ORM for easy data persistence.
```python
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

SQLALCHEMY_DATABASE_URL = "sqlite:///./sql_app.db"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()
```

### Models
Define database table structures using Python classes.
```python
from sqlalchemy import Column, Integer, String

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    name = Column(String)
```

### CRUD Operations
Implement Create, Read, Update, Delete operations with database integration.
```python
@app.post("/users/", response_model=UserOut)
async def create_user(user: UserIn, db: Session = Depends(get_db)):
    db_user = User(**user.model_dump())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.get("/users/", response_model=list[UserOut])
async def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = db.query(User).offset(skip).limit(limit).all()
    return users
```

## Testing

### Test Setup
Write automated tests for your API endpoints without running a server.
```python
from fastapi.testclient import TestClient

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"Hello": "World"}

def test_create_item():
    response = client.post(
        "/items/",
        json={"name": "Foo", "price": 10.5}
    )
    assert response.status_code == 200
    assert response.json()["name"] == "Foo"
```

## Advanced Features

Organize and scale your application with modular patterns.

### APIRouter
Split large applications into multiple files with separate route modules.
```python
from fastapi import APIRouter

router = APIRouter(prefix="/items", tags=["items"])

@router.get("/")
async def read_items():
    return [{"name": "Item"}]

app.include_router(router)
```

### Lifespan Events (Modern)
Run initialization and cleanup code when the application starts and stops.
```python
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("Starting up...")
    yield
    # Shutdown
    print("Shutting down...")

app = FastAPI(lifespan=lifespan)
```

### Custom Response
Return different response types like HTML, files, or redirects instead of JSON.
```python
from fastapi.responses import HTMLResponse, FileResponse, RedirectResponse

@app.get("/html", response_class=HTMLResponse)
async def get_html():
    return "<h1>Hello</h1>"

@app.get("/file")
async def get_file():
    return FileResponse("file.pdf")

@app.get("/redirect")
async def redirect():
    return RedirectResponse(url="/docs")
```
